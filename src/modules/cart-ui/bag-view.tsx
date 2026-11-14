"use client";

import { EditorialImage } from "@/modules/storefront/components";
import { useShop } from "@/modules/storefront/shop-context";
import Link from "next/link";

export function BagView() {
  const { bagItems, clearBag } = useShop();
  const total = bagItems.reduce((sum, item) => sum + item.price, 0);
  const grouped = Object.values(
    bagItems.reduce<
      Record<string, { product: (typeof bagItems)[number]; quantity: number }>
    >((groups, item) => {
      const current = groups[item.id];
      groups[item.id] = {
        product: item,
        quantity: (current?.quantity ?? 0) + 1,
      };
      return groups;
    }, {}),
  );
  return (
    <>
      <h1>YOUR BAG</h1>
      {bagItems.length ? (
        <>
          {grouped.map(({ product, quantity }) => (
            <div className="bag-item" key={product.id}>
              <EditorialImage src={product.image} alt={product.title} />
              <div>
                <h2>{product.title}</h2>
                <p>Quantity: {quantity}</p>
                <p>${(product.price * quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
          <p>Estimated total: ${total.toLocaleString()}</p>
          <button className="text-link" onClick={() => void clearBag()}>
            REMOVE ALL
          </button>
          <Link className="button-light" href="/checkout">
            CONTINUE TO CHECKOUT
          </Link>
        </>
      ) : (
        <p>Your bag is empty.</p>
      )}
    </>
  );
}
