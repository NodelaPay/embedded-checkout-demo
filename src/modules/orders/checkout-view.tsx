"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useShop } from "@/modules/storefront/shop-context";
import { ensureGuestSession } from "@/infrastructure/http/client-session";
import type { ProfileDto } from "@/modules/account/profile.dto";
import type { PaymentDto } from "@/modules/payments/payment.dto";
import type { OrderDto } from "./order.dto";

type PaymentSuccessResult = {
  invoiceId: string;
  txHash?: string;
  amount: number;
  currency: string;
  network?: string;
  token?: string;
};
declare global {
  interface Window {
    Nodela?: {
      open(options: {
        baseUrl: string;
        invoiceId: string;
        theme: "auto" | "light" | "dark";
        onSuccess?: (result: PaymentSuccessResult) => void;
        onClose?: () => void;
        onError?: (error: unknown) => void;
      }): void;
      close(): void;
    };
  }
}

const blank: ProfileDto = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  postalCode: "",
};
const fields = [
  "name",
  "email",
  "phone",
  "city",
  "address",
  "postalCode",
] as const;

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, credentials: "same-origin" });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "Payment request failed";
    throw new Error(message);
  }
  return body as T;
}

export function CheckoutView() {
  const { bagItems, refreshBag } = useShop();
  const router = useRouter();
  const params = useSearchParams();
  const [customer, setCustomer] = useState<ProfileDto>(blank);
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [payment, setPayment] = useState<PaymentDto | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    void (async () => {
      await ensureGuestSession();
      const response = await fetch("/api/account");
      if (response.ok) {
        const data: { profile: ProfileDto | null } = await response.json();
        if (data.profile) setCustomer(data.profile);
      }
      const orderId = params.get("orderId");
      if (orderId) {
        const data = await api<{ orders: OrderDto[] }>("/api/orders");
        const existing = data.orders.find((item) => item.id === orderId);
        if (existing) setOrder(existing);
        else setError("Order not found.");
      }
    })().catch((cause) =>
      setError(
        cause instanceof Error ? cause.message : "Could not load checkout",
      ),
    );
  }, [params]);

  async function verify(orderId: string) {
    const data = await api<{ payment: PaymentDto }>(`/api/payments/${orderId}`);
    setPayment(data.payment);
    if (data.payment.status === "paid")
      router.push(`/thank-you?orderId=${encodeURIComponent(orderId)}`);
    else
      setNotice(
        "Payment has not been confirmed yet. You can check again shortly.",
      );
  }

  function openOverlay(invoice: PaymentDto, orderId: string) {
    if (!invoice.invoiceId)
      throw new Error("Invoice is not ready. Please try again.");
    if (!window.Nodela)
      throw new Error("Secure checkout is still loading. Please try again.");
    window.Nodela.open({
      baseUrl: "https://pay.nodela.co",
      invoiceId: invoice.invoiceId,
      theme: "auto",
      onSuccess: (result) => {
        if (result.invoiceId !== invoice.invoiceId) {
          setError("Invoice confirmation did not match this order.");
          return;
        }
        setNotice("Confirming payment with Nodela...");
        void verify(orderId).catch((cause) =>
          setError(
            cause instanceof Error ? cause.message : "Could not verify payment",
          ),
        );
      },
      onClose: () => {
        setNotice(
          "Checkout closed. You can reopen it or check the payment status.",
        );
      },
      onError: () => {
        setError(
          "The checkout could not complete. You can reopen it and try again.",
        );
      },
    });
  }

  async function pay(existingOrder: OrderDto) {
    setError("");
    setNotice("");
    setPending(true);
    try {
      if (!scriptReady || !window.Nodela)
        throw new Error("Secure checkout is still loading. Please try again.");
      const data = await api<{ payment: PaymentDto }>("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: existingOrder.id }),
      });
      setPayment(data.payment);
      if (data.payment.status === "paid") {
        router.push(
          `/thank-you?orderId=${encodeURIComponent(existingOrder.id)}`,
        );
        return;
      }
      openOverlay(data.payment, existingOrder.id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not start payment",
      );
    } finally {
      setPending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const data = await api<{ order: OrderDto }>("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, idempotencyKey }),
      });
      setOrder(data.order);
      await refreshBag();
      if (scriptReady && window.Nodela) await pay(data.order);
      else
        setNotice(
          "Order saved. Secure checkout is loading; select Pay with Crypto when ready.",
        );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not create order",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Script
        src="https://cdn.nodela.co/nodela.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() =>
          setError("Secure checkout could not load. Refresh and try again.")
        }
      />
      {order ? (
        <main className="checkout-route">
          <h1>
            {order.status === "paid" ? "PAYMENT CONFIRMED" : "COMPLETE PAYMENT"}
          </h1>
          <p>Reference: {order.id.slice(0, 8).toUpperCase()}</p>
          <p>Total: ${order.total.toLocaleString()}</p>
          <p>
            Status:{" "}
            {order.status === "paid" || payment?.status === "paid"
              ? "Paid"
              : "Awaiting payment"}
          </p>
          {order.status !== "paid" && payment?.status !== "paid" && (
            <div className="checkout-payment-actions">
              <button
                className="button-light"
                onClick={() => void pay(order)}
                disabled={pending || !scriptReady}
              >
                {pending ? "PREPARING PAYMENT..." : "PAY WITH CRYPTO"}
              </button>
              {payment?.invoiceId && (
                <button
                  className="text-link"
                  onClick={() =>
                    void verify(order.id).catch((cause) =>
                      setError(
                        cause instanceof Error
                          ? cause.message
                          : "Could not verify payment",
                      ),
                    )
                  }
                >
                  CHECK PAYMENT STATUS
                </button>
              )}
            </div>
          )}
          <Link className="text-link" href="/account">
            VIEW ORDER HISTORY
          </Link>
          {notice && <p role="status">{notice}</p>}
          {error && <p role="alert">{error}</p>}
        </main>
      ) : (
        <main className="checkout-route">
          <h1>CHECKOUT</h1>
          <p>Review your details and create your order.</p>
          {bagItems.length === 0 ? (
            <p>
              Your bag is empty. <Link href="/shop">Shop the collection</Link>
            </p>
          ) : (
            <>
              <div className="checkout-summary">
                {bagItems.map((item, index) => (
                  <p key={`${item.id}-${index}`}>
                    {item.title} — ${item.price.toLocaleString()}
                  </p>
                ))}
                <strong>
                  Total: $
                  {bagItems
                    .reduce((sum, item) => sum + item.price, 0)
                    .toLocaleString()}
                </strong>
              </div>
              <form onSubmit={submit} className="checkout-form">
                {fields.map((field) => (
                  <label key={field}>
                    <span>
                      {field === "postalCode"
                        ? "POSTAL CODE"
                        : field.toUpperCase()}
                    </span>
                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={customer[field]}
                      onChange={(event) =>
                        setCustomer({
                          ...customer,
                          [field]: event.target.value,
                        })
                      }
                    />
                  </label>
                ))}
                <button className="button-light" disabled={pending}>
                  {pending ? "CREATING ORDER..." : "CREATE ORDER & PAY"}
                </button>
              </form>
            </>
          )}
          {notice && <p role="status">{notice}</p>}
          {error && <p role="alert">{error}</p>}
        </main>
      )}
    </>
  );
}
