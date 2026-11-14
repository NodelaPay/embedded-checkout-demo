import Link from "next/link";
import { Header, Footer } from "@/modules/storefront/components";
import { BagView } from "@/modules/cart-ui/bag-view";

export default function BagPage() {
  return (
    <>
      <Header />
      <main className="bag-route">
        <BagView />
        <Link className="text-link" href="/shop">
          CONTINUE SHOPPING
        </Link>
      </main>
      <Footer />
    </>
  );
}
