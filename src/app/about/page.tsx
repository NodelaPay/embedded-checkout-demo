import {
  Footer,
  Header,
  EditorialImage,
  TextLink,
} from "@/modules/storefront/components";
import { images } from "@/modules/storefront/data";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-route">
        <div className="about-route-copy">
          <span>CRAFTED — IN</span>
          <h1>Paris, France</h1>
          <p>
            Temporarily used to fill a space where actual content will
            eventually appear. It serves as a visual placeholder to help
            designers and developers visualize...
          </p>
          <TextLink href="/lookbook">LEARN MORE</TextLink>
        </div>
        <EditorialImage
          src={images.monochrome}
          alt="Black and white fashion portrait"
        />
      </main>
      <Footer />
    </>
  );
}
