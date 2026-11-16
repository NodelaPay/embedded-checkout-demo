import { Header, Footer } from "@/modules/storefront/components";
import { CheckoutView } from "@/modules/orders/checkout-view";
export default function CheckoutPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={<main className="checkout-route">Loading checkout…</main>}
      >
        <CheckoutView />
      </Suspense>
      <Footer />
    </>
  );
}
import { Suspense } from "react";
