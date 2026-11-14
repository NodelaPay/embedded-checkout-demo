"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ShoppingBag,
  ChevronDown,
  Heart,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { editorialCopy, type Product } from "./data";
import { useShop } from "./shop-context";

export function EditorialImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`editorial-image ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        priority={priority}
      />
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { bagCount } = useShop();
  const pathname = usePathname();
  const router = useRouter();

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(query)}`);
  }

  return (
    <>
      <header className="site-header">
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/shop">
            SHOP <ChevronDown size={13} />
          </Link>
          <Link href="/lookbook">LOOKBOOK</Link>
          <Link href="/about">ABOUT</Link>
        </nav>
        <button
          className="mobile-menu icon-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={21} />
        </button>
        <Link className="brand" href="/">
          Trümung
        </Link>
        <div className="header-actions">
          <button
            className="desktop-icon icon-button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.4} />
          </button>
          <Link
            className="desktop-icon icon-button"
            href="/account"
            aria-label="Account"
          >
            <UserRound size={20} fill="currentColor" strokeWidth={1.2} />
          </Link>
          <Link
            className="icon-button bag-link"
            href="/bag"
            aria-label={`Bag with ${bagCount} items`}
          >
            <ShoppingBag size={20} fill="currentColor" strokeWidth={1.2} />
            {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
          </Link>
        </div>
      </header>
      <div className="double-rule" />
      {menuOpen && (
        <div className="menu-overlay">
          <button
            className="icon-button menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
          <nav aria-label="Mobile navigation">
            {(
              [
                ["/", "HOME"],
                ["/shop", "SHOP"],
                ["/lookbook", "LOOKBOOK"],
                ["/about", "ABOUT"],
                ["/newsletter", "NEWSLETTER"],
                ["/account", "ACCOUNT"],
                ["/bag", "BAG"],
              ] as const
            ).map(([href, label]) => (
              <Link
                key={href}
                className={pathname === href ? "active" : ""}
                href={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
      {searchOpen && (
        <div className="search-overlay">
          <button
            className="icon-button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <X />
          </button>
          <form onSubmit={search}>
            <label htmlFor="site-search">SEARCH THE COLLECTION</label>
            <input
              id="site-search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pieces"
            />
            <button type="submit">SEARCH ↗</button>
          </form>
        </div>
      )}
    </>
  );
}

export function SectionRule({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="section-rule">
      <span>{number}</span>
      <span>{title}</span>
    </div>
  );
}

export function TextLink({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return href ? (
    <Link className="text-link" href={href}>
      {children}
    </Link>
  ) : (
    <button className="text-link" onClick={onClick}>
      {children}
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToBag, saved, toggleSaved } = useShop();
  return (
    <article className="product-card">
      <Link href={`/product/${product.id}`}>
        <EditorialImage
          src={product.image}
          alt={product.title}
          className="product-card-image"
        />
      </Link>
      <p className="product-desc">{editorialCopy}</p>
      <div className="product-card-title">{product.title}</div>
      <div className="product-card-row">
        <span>${product.price}</span>
        <button onClick={() => void addToBag(product)}>ADD TO CART ↙</button>
      </div>
      <button
        className={`save-small ${saved.includes(product.id) ? "is-saved" : ""}`}
        onClick={() => void toggleSaved(product.id)}
        aria-label={
          saved.includes(product.id) ? "Remove from saved items" : "Save item"
        }
      >
        <Heart
          size={18}
          fill={saved.includes(product.id) ? "currentColor" : "none"}
        />
      </button>
    </article>
  );
}

export function FeaturedProducts() {
  const { products } = useShop();
  return (
    <>
      {products
        .filter((item) => item.category === "COATS")
        .slice(0, 2)
        .map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
    </>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <footer className="site-footer">
      <div>
        <h2>
          TRÜMUNG —<br />
          SHOP RARE LIMITED EDITION
          <br />
          PIECES IN OUR LA &amp; NYC LOCATIONS
        </h2>
        <p>
          Placeholder text helps maintain the structure and appearance of the
          layout while the content is being developed.
        </p>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (!email.trim()) return;
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (response.ok) setSubscribed(true);
        }}
      >
        <label htmlFor="footer-email">EMAIL</label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" className="text-link">
          {subscribed ? "YOU’RE ON THE LIST" : "GET EXCLUSIVE DEALS"}
        </button>
      </form>
      <div className="footer-links">
        <Link href="/about">SHIPPING &amp; RETURNS</Link>
        <Link href="/about">PRIVACY POLICY</Link>
      </div>
      <small>All rights reserved Trümung 2026</small>
      <small>trumung@fashion.com</small>
    </footer>
  );
}
