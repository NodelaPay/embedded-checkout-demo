"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/modules/storefront/components";
import { useShop } from "@/modules/storefront/shop-context";

export function ShopView() {
  const params = useSearchParams();
  const { products } = useShop();
  const query = params.get("q")?.toLowerCase().trim() ?? "";
  const listing = products.filter(
    (item) =>
      !query || `${item.title} ${item.category}`.toLowerCase().includes(query),
  );
  return (
    <main className="shop-route">
      <div className="route-heading">
        <span>TRÜMUNG — LIMITED COLLECTION</span>
        <h1>Shop the collection</h1>
        <p>Selected pieces from New York and Los Angeles.</p>
      </div>
      {listing.length ? (
        <div className="shop-grid">
          {listing.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <p>No pieces match “{query}”.</p>
      )}
    </main>
  );
}
