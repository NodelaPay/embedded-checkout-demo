import { Suspense } from "react";
import { Header, Footer } from "@/modules/storefront/components";
import { PaymentResultView } from "@/modules/payments/payment-result-view";
export default function ThankYouPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={<main className="checkout-route">Checking payment…</main>}
      >
        <PaymentResultView />
      </Suspense>
      <Footer />
    </>
  );
}
