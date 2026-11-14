import Link from "next/link";
import {
  EditorialImage,
  Footer,
  Header,
} from "@/modules/storefront/components";
import { images } from "@/modules/storefront/data";

const looks = [
  images.black,
  images.redTwo,
  images.leather,
  images.scarf,
  images.monochrome,
  images.coat,
];

export default function LookbookPage() {
  return (
    <>
      <Header />
      <main className="lookbook-route">
        <div className="route-heading">
          <span>NEW RELEASES — CURATED BY</span>
          <h1>Martin Schleifen</h1>
          <p>Rare pieces from our limited collection.</p>
        </div>
        <div className="lookbook-grid">
          {looks.map((image, index) => (
            <Link href="/product/leather-shoes" key={image}>
              <EditorialImage src={image} alt={`Look ${index + 1}`} />
              <span>LOOK {String(index + 1).padStart(2, "0")} ↗</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
