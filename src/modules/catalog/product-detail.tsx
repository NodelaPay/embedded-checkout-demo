"use client";

import { useState } from "react";
import { EditorialImage, ProductCard } from "@/modules/storefront/components";
import { images } from "@/modules/storefront/data";
import { useShop } from "@/modules/storefront/shop-context";

const sizes = ["07", "7.5", "08", "8.5", "09", "9.5", "10"] as const;

export function ProductDetail({ id }: { id: string }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>("08");
  const [open, setOpen] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { addToBag, saved, toggleSaved, products } = useShop();
  const product = products.find((item) => item.id === id);
  const gallery = product
    ? id === "leather-shoes"
      ? [images.shoes, images.shoesAlt, images.shoes]
      : [product.image]
    : [];

  function addProduct() {
    if (!product) return;
    void addToBag(product);
    setMessage("Added to bag.");
  }

  if (!product)
    return (
      <main className="product-page">
        <p>Loading product...</p>
      </main>
    );

  return (
    <main className="product-page">
      <div className="product-gallery">
        <div className="product-thumbnails">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={activeImage === index ? "active" : ""}
              onClick={() => setActiveImage(index)}
              aria-label={`Show product image ${index + 1}`}
            >
              <EditorialImage
                src={image}
                alt={`${product.title} view ${index + 1}`}
              />
            </button>
          ))}
        </div>
        <EditorialImage
          src={gallery[activeImage] ?? product.image}
          alt={product.title}
          className="product-main-image"
        />
        <div className="style-with">
          <h2>STYLE WITH</h2>
          <div>
            {products
              .filter((item) => item.id !== id)
              .slice(0, 3)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </div>
      </div>
      <section className="product-info">
        <div className="product-heading">
          <span>by Angel Vaccaro</span>
          <h1>{product.title}</h1>
        </div>
        <p className="product-summary">
          A placeholder text is a block of nonsensical or meaningless text that
          is temporarily used to fill a space where actual content will
          eventually appear.
        </p>
        <p className="product-price">${product.price.toLocaleString()}</p>
        <div className="product-color">
          <span>COLOR</span>
          <span>BLACK</span>
        </div>
        <div className="size-row" aria-label="Select size">
          {sizes.map((item) => (
            <button
              key={item}
              className={size === item ? "selected" : ""}
              onClick={() => {
                setSize(item);
                setMessage("");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="limited-note">
          This collection is limited to <strong>350</strong> pieces.
        </p>
        <div className="product-mobile-gallery">
          <EditorialImage
            src={gallery[activeImage] ?? product.image}
            alt={product.title}
          />{" "}
          <div>
            {gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={activeImage === index ? "active" : ""}
                aria-label={`Show image ${index + 1}`}
              >
                <EditorialImage
                  src={image}
                  alt={`${product.title} detail ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="product-accordions">
          {(
            [
              [
                "DETAILS",
                "Sculptural leather footwear designed for a limited collection. Crafted with a contemporary silhouette and a comfortable fit.",
              ],
              [
                "SHIPPING",
                "Shipping options and delivery estimates are shown at checkout. Returns are accepted according to our store policy.",
              ],
            ] as const
          ).map(([title, content]) => (
            <div key={title}>
              <button
                onClick={() => setOpen(open === title ? null : title)}
                aria-expanded={open === title}
              >
                {title}
                <span>{open === title ? "−" : "+"}</span>
              </button>
              {open === title && <p>{content}</p>}
            </div>
          ))}
        </div>
        <div className="product-actions">
          <button className="button-light" onClick={addProduct}>
            ADD TO BAG
          </button>
          <button className="text-link" onClick={() => void toggleSaved(id)}>
            {saved.includes(id) ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}
          </button>
          {message && <p role="status">{message}</p>}
        </div>
      </section>
    </main>
  );
}
