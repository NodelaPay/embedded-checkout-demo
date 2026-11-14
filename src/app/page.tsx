import Link from "next/link";
import {
  EditorialImage,
  FeaturedProducts,
  Footer,
  Header,
  SectionRule,
  TextLink,
} from "@/modules/storefront/components";
import { editorialCopy, images } from "@/modules/storefront/data";

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-page">
        <section className="hero-grid" aria-label="Featured collections">
          <Link href="/shop?city=new-york" className="hero-panel">
            <EditorialImage
              src={images.heroNewYork}
              alt="Editorial fashion portrait in New York"
              priority
            />
            <div className="hero-caption">
              <span>EAST VILLAGE</span>
              <h1>New York</h1>
            </div>
          </Link>
          <Link href="/shop?city=los-angeles" className="hero-panel">
            <EditorialImage
              src={images.heroLosAngeles}
              alt="Editorial fashion portrait in Los Angeles"
              priority
            />
            <div className="hero-caption">
              <span>KOREATOWN</span>
              <h2>Los Angeles</h2>
            </div>
          </Link>
        </section>
        <SectionRule number="XVI" title="LIMITED COLLECTION" />
        <section className="limited-section section-block">
          <p className="limited-intro">{editorialCopy}</p>
          <div className="limited-watermark">Trümung</div>
          <div className="limited-cards">
            <FeaturedProducts />
          </div>
        </section>
        <section className="lookbook-section section-block">
          <div className="lookbook-image one">
            <EditorialImage
              src={images.black}
              alt="Black leather fashion portrait"
            />
          </div>
          <div className="lookbook-image two">
            <EditorialImage src={images.redTwo} alt="Red fashion portrait" />
          </div>
          <div className="lookbook-image three">
            <EditorialImage
              src={images.leather}
              alt="Leather fashion portrait"
            />
          </div>
          <div className="lookbook-image four">
            <EditorialImage src={images.scarf} alt="Fashion portrait" />
          </div>
          <div className="lookbook-image five">
            <EditorialImage
              src={images.monochrome}
              alt="Monochrome fashion portrait"
            />
          </div>
          <div className="lookbook-image six">
            <EditorialImage src={images.coat} alt="Coat portrait" />
          </div>
          <div className="lookbook-center">
            <span>NEW RELEASES — CURATED BY</span>
            <strong>Martin Schleifen</strong>
            <TextLink href="/lookbook">SHOP COLLECTION</TextLink>
          </div>
        </section>
        <SectionRule number="XVII" title="NEWSLETTER" />
        <section className="newsletter-section section-block">
          <div className="newsletter-feature-image">
            <EditorialImage src={images.red} alt="Editorial portrait in red" />
          </div>
          <div className="newsletter-content">
            <span>Nº001</span>
            <h2>MIDNIGHT CHRONICLES</h2>
            <p>
              {editorialCopy} It serves as a visual placeholder to help
              designers and developers visualize the layout of a website,
              document, or other design project before the final content is
              added...
            </p>
            <TextLink href="/newsletter">READ MORE</TextLink>
            <div className="article-strip">
              {(
                [
                  [images.leather, "Nº002", "NEW YORK — FASHION WEEK"],
                  [images.redTwo, "Nº003", "HEADLINE — HEADLINE"],
                  [images.black, "Nº004", "HEADLINE — HEADLINE"],
                ] as const
              ).map(([image, number, title]) => (
                <Link href="/newsletter" className="article-card" key={number}>
                  <EditorialImage src={image} alt={title} />
                  <small>{number}</small>
                  <h3>{title}</h3>
                  <p>{editorialCopy}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <SectionRule number="XVIII" title="ABOUT US" />
        <section className="about-section section-block">
          <div className="about-copy">
            <span>CRAFTED — IN</span>
            <h2>Paris, France</h2>
            <p>
              Temporarily used to fill a space where actual content will
              eventually appear. It serves as a visual placeholder to help
              designers and developers visualize...
            </p>
            <div className="about-small-image">
              <EditorialImage src={images.street} alt="Fashion craft detail" />
            </div>
            <TextLink href="/about">LEARN MORE</TextLink>
          </div>
          <div className="about-large-image">
            <EditorialImage
              src={images.monochrome}
              alt="Black and white fashion editorial portrait"
            />
          </div>
        </section>
        <SectionRule number="XVIII" title="UPCOMING" />
        <section className="upcoming-section section-block">
          <div className="upcoming-photo a">
            <EditorialImage src={images.coat} alt="Fashion portrait" />
          </div>
          <div className="upcoming-photo b">
            <EditorialImage src={images.trench} alt="Fashion outfit" />
          </div>
          <div className="upcoming-photo c">
            <EditorialImage src={images.redTwo} alt="Fashion look" />
          </div>
          <div className="upcoming-photo d">
            <EditorialImage src={images.black} alt="Editorial portrait" />
          </div>
          <div className="upcoming-photo e">
            <EditorialImage src={images.red} alt="Red editorial" />
          </div>
          <div className="upcoming-copy">
            <span>SPECIALS</span>
            <h2>NEW YORK FASHION — WEEK</h2>
            <strong>w/ Ralph Lauren</strong>
            <p>
              Placeholder text helps maintain the structure and appearance of
              the layout while the content is being developed. Here’s an extra
              line to create some length difference.
            </p>
            <TextLink href="/lookbook">LEARN MORE</TextLink>
          </div>
        </section>
        <section className="journey-section section-block">
          <div className="journey-art">
            <EditorialImage src={images.redTwo} alt="Red fashion editorial" />
            <span className="journey-left">A JOURNEY</span>
            <span className="journey-right">THROUGH TIME</span>
            <em>Fashion Fades, Style is Eternal</em>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
