import { Suspense } from "react";
import { Header, Footer } from "@/modules/storefront/components";
import { ShopView } from "@/modules/catalog/shop-view";

export default function ShopPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={<main className="shop-route">Loading collection…</main>}
      >
        <ShopView />
      </Suspense>
      <Footer />
    </>
  );
}
