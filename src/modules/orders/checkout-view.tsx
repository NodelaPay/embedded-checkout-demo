"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useShop } from "@/modules/storefront/shop-context";
import { ensureGuestSession } from "@/infrastructure/http/client-session";
import type { ProfileDto } from "@/modules/account/profile.dto";
import type { OrderDto } from "./order.dto";

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
export function CheckoutView() {
  const { bagItems, refreshBag } = useShop();
  const [customer, setCustomer] = useState<ProfileDto>(blank);
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState("");
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
    })().catch(console.error);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, idempotencyKey }),
      });
      const data: { order?: OrderDto; error?: string } = await response.json();
      if (!response.ok || !data.order)
        throw new Error(data.error ?? "Could not create order");
      setOrder(data.order);
      await refreshBag();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not create order",
      );
    } finally {
      setPending(false);
    }
  }
  if (order)
    return (
      <main className="checkout-route">
        <h1>ORDER CREATED</h1>
        <p>Reference: {order.id.slice(0, 8).toUpperCase()}</p>
        <p>Total: ${order.total.toLocaleString()}</p>
        <p>Status: Awaiting payment</p>
        <p>
          Your order is saved. Payment will be available once the embedded
          checkout is connected.
        </p>
        <Link className="text-link" href="/account">
          VIEW ORDER HISTORY
        </Link>
      </main>
    );
  return (
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
                  {field === "postalCode" ? "POSTAL CODE" : field.toUpperCase()}
                </span>
                <input
                  required
                  type={field === "email" ? "email" : "text"}
                  value={customer[field]}
                  onChange={(event) =>
                    setCustomer({ ...customer, [field]: event.target.value })
                  }
                />
              </label>
            ))}
            <button className="button-light" disabled={pending}>
              {pending ? "CREATING ORDER..." : "CREATE ORDER"}
            </button>
          </form>
          {error && <p role="alert">{error}</p>}
        </>
      )}
    </main>
  );
}
