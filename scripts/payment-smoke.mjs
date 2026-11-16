import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
const appPort = 3011;
const invoices = new Map();
let mismatchVerification = false;
let serverLog = "";
const mock = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  response.setHeader("Content-Type", "application/json");
  if (request.headers["x-api-key"] !== "nk_test_smoke") {
    response.writeHead(401).end(JSON.stringify({ success: false }));
    return;
  }
  if (request.method === "POST" && url.pathname === "/v1/invoices") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const input = JSON.parse(Buffer.concat(chunks).toString());
    const invoiceId = `NOD_TEST_INV_${randomUUID().replaceAll("-", "")}`;
    invoices.set(invoiceId, {
      reference: input.reference,
      amount: input.amount,
      paid: false,
    });
    response.writeHead(201).end(
      JSON.stringify({
        success: true,
        data: {
          invoice_id: invoiceId,
          checkout_url: `https://pay.nodela.co/checkout?invoice_id=${invoiceId}`,
          original_amount: input.amount,
          original_currency: "USD",
        },
      }),
    );
    return;
  }
  const match = url.pathname.match(/^\/v1\/invoices\/(.+)\/verify$/);
  if (request.method === "GET" && match) {
    const invoice = invoices.get(decodeURIComponent(match[1]));
    if (!invoice) {
      response.writeHead(404).end(JSON.stringify({ success: false }));
      return;
    }
    response.writeHead(200).end(
      JSON.stringify({
        success: true,
        data: {
          invoice_id: match[1],
          reference: invoice.reference,
          original_amount: mismatchVerification ? 1 : invoice.amount,
          original_currency: "USD",
          status: invoice.paid ? "paid" : "pending",
          paid: invoice.paid,
        },
      }),
    );
    return;
  }
  response.writeHead(404).end(JSON.stringify({ success: false }));
});
await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
const mockPort = mock.address().port;
const app = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(appPort)],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODELA_API_KEY: "nk_test_smoke",
      NODELA_API_URL: `http://127.0.0.1:${mockPort}`,
      APP_BASE_URL: `http://127.0.0.1:${appPort}`,
      NODELA_WEBHOOK_SECRET: "smoke-secret",
    },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
app.stdout.on("data", (chunk) => {
  serverLog += chunk.toString();
});
app.stderr.on("data", (chunk) => {
  serverLog += chunk.toString();
});
const base = `http://127.0.0.1:${appPort}`;
let cookie = "";
let guestId = "";
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
async function request(path, method = "GET", input, overrideCookie) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...((overrideCookie ?? cookie)
        ? { cookie: overrideCookie ?? cookie }
        : {}),
      ...(input ? { "content-type": "application/json" } : {}),
    },
    body: input ? JSON.stringify(input) : undefined,
  });
  const issued = response.headers.get("set-cookie");
  if (issued && !overrideCookie) cookie = issued.split(";")[0];
  const body = await response.json();
  return { status: response.status, body };
}
function assert(value, message) {
  if (!value) throw new Error(message);
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (app.exitCode !== null) throw new Error(`App exited: ${serverLog}`);
    try {
      const response = await fetch(base + "/api/products");
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for the server. */
    }
    await delay(500);
  }
  assert(ready, `App did not start: ${serverLog}`);
  await request("/api/session");
  guestId = cookie.split("=")[1].split(".")[0];
  const customer = {
    name: "Payment Smoke",
    email: "payment-smoke@example.com",
    phone: "1",
    city: "New York",
    address: "100 Main St",
    postalCode: "10001",
  };
  assert(
    (await request("/api/cart", "PUT", { productId: "coat-01", quantity: 1 }))
      .status === 200,
    "Cart write failed",
  );
  const created = await request("/api/orders", "POST", {
    idempotencyKey: randomUUID(),
    customer,
  });
  assert(
    created.status === 201 && created.body.order.total === 875,
    "Order was not priced by server",
  );
  const orderId = created.body.order.id;
  const started = await request("/api/payments", "POST", { orderId });
  assert(
    started.status === 201 && started.body.payment.invoiceId,
    `Invoice creation failed: ${JSON.stringify(started)}`,
  );
  const invoiceId = started.body.payment.invoiceId;
  assert(
    (await request(`/api/payments/${orderId}`)).body.payment.status ===
      "pending",
    "Expected pending invoice",
  );
  const stranger = (await fetch(base + "/api/session")).headers
    .get("set-cookie")
    .split(";")[0];
  assert(
    (await request(`/api/payments/${orderId}`, "GET", undefined, stranger))
      .status === 404,
    "Guest isolation failed",
  );
  invoices.get(invoiceId).paid = true;
  mismatchVerification = true;
  assert(
    (await request(`/api/payments/${orderId}`)).status === 502,
    "Mismatched verification was accepted",
  );
  let orders = await request("/api/orders");
  assert(
    orders.body.orders[0].status === "awaiting_payment",
    "Mismatched verification marked order paid",
  );
  mismatchVerification = false;
  const payload = JSON.stringify({ data: { invoice_id: invoiceId } });
  const invalid = await fetch(base + "/api/payments/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nodela-signature": "sha256=" + "0".repeat(64),
    },
    body: payload,
  });
  assert(invalid.status === 401, "Invalid webhook signature was accepted");
  const signature =
    "sha256=" +
    createHmac("sha256", "smoke-secret").update(payload).digest("hex");
  const webhook = await fetch(base + "/api/payments/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nodela-signature": signature,
    },
    body: payload,
  });
  assert(webhook.ok, `Signed webhook failed: ${webhook.status}`);
  orders = await request("/api/orders");
  assert(
    orders.body.orders[0].status === "paid",
    "Verified payment did not mark order paid",
  );
  assert(
    (await request(`/api/payments/${orderId}`)).body.payment.status === "paid",
    "Payment status was not persisted",
  );
  console.log(
    JSON.stringify({
      invoiceCreated: true,
      pendingVerified: true,
      mismatchRejected: true,
      guestIsolated: true,
      invalidWebhookRejected: true,
      paidAfterVerifiedWebhook: true,
    }),
  );
} finally {
  app.kill("SIGTERM");
  mock.close();
  if (guestId) {
    await pool.query("DELETE FROM payments WHERE guest_id = $1", [guestId]);
    await pool.query("DELETE FROM orders WHERE guest_id = $1", [guestId]);
    await pool.query("DELETE FROM cart_items WHERE guest_id = $1", [guestId]);
  }
  await pool.end();
}
