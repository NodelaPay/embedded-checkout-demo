import { Header, Footer } from "@/modules/storefront/components";
import { CheckoutView } from "@/modules/orders/checkout-view";
export default function CheckoutPage() {
  return (
    <>
      <Header />
      <CheckoutView />
      <Footer />
    </>
  );
}
