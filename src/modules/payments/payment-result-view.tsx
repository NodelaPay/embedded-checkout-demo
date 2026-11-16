"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ensureGuestSession } from "@/infrastructure/http/client-session";
import type { PaymentDto } from "./payment.dto";

export function PaymentResultView() {
  const orderId = useSearchParams().get("orderId");
  const [payment, setPayment] = useState<PaymentDto | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const check = useCallback(async () => {
    if (!orderId) {
      setError("Order reference is missing.");
      return;
    }
    setChecking(true);
    setError("");
    try {
      await ensureGuestSession();
      const response = await fetch(
        `/api/payments/${encodeURIComponent(orderId)}`,
        { cache: "no-store" },
      );
      const data: { payment?: PaymentDto; error?: string } =
        await response.json();
      if (!response.ok || !data.payment)
        throw new Error(data.error ?? "Could not verify payment");
      setPayment(data.payment);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not verify payment",
      );
    } finally {
      setChecking(false);
    }
  }, [orderId]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void check();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [check]);
  return (
    <main className="checkout-route">
      <h1>{payment?.status === "paid" ? "THANK YOU" : "PAYMENT STATUS"}</h1>
      {payment?.status === "paid" ? (
        <p>Your payment has been verified. Your order is confirmed.</p>
      ) : (
        <p>
          {checking
            ? "Checking your payment with Nodela..."
            : "Payment is not confirmed yet."}
        </p>
      )}
      {orderId && <p>Reference: {orderId.slice(0, 8).toUpperCase()}</p>}
      {payment && payment.status !== "paid" && (
        <>
          <p>Status: {payment.status}</p>
          <button
            className="text-link"
            onClick={() => void check()}
            disabled={checking}
          >
            CHECK AGAIN
          </button>
          <Link
            className="text-link"
            href={`/checkout?orderId=${encodeURIComponent(orderId ?? "")}`}
          >
            RETURN TO CHECKOUT
          </Link>
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <Link className="text-link" href="/account">
        VIEW ORDER HISTORY
      </Link>
    </main>
  );
}
