import {
  EditorialImage,
  Footer,
  Header,
  TextLink,
} from "@/modules/storefront/components";
import { images } from "@/modules/storefront/data";

const articles = [
  { number: "Nº002", title: "NEW YORK — FASHION WEEK", image: images.leather },
  { number: "Nº003", title: "HEADLINE — HEADLINE", image: images.redTwo },
  { number: "Nº004", title: "HEADLINE — HEADLINE", image: images.black },
];

export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main className="newsletter-route">
        <div className="newsletter-route-intro">
          <span>Nº001</span>
          <h1>
            MIDNIGHT
            <br />
            CHRONICLES
          </h1>
          <p>
            A placeholder text ──── is a block of nonsensical or meaningless
            text that is temporarily used to fill a space where actual content
            will eventually appear. It serves as a visual placeholder to help
            designers and developers visualize the layout of a website,
            document, or other design project before the final content is
            added...
          </p>
          <TextLink href="#stories">READ MORE</TextLink>
        </div>
        <div className="newsletter-route-feature">
          <EditorialImage src={images.red} alt="Fashion editorial in red" />
        </div>
        <div className="newsletter-route-stories" id="stories">
          {articles.map((article) => (
            <article key={article.number}>
              <EditorialImage src={article.image} alt={article.title} />
              <small>{article.number}</small>
              <h2>{article.title}</h2>
              <p>
                Temporarily used to fill a space where actual content will
                eventually appear. It serves as a visual placeholder to help
                designers and developers visualize the layout of a website,
                document, or other design project before the final content is
                added. Placeholder text helps maintain the structure and
                appearance of the layout while the content is being developed.
                Here’s an extra line to create some length difference...
              </p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
