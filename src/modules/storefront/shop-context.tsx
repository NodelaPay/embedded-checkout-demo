"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ensureGuestSession } from "@/infrastructure/http/client-session";
import type { Product } from "./data";

type CartRow = { productId: string; quantity: number };
type ShopContextValue = {
  products: Product[];
  bagCount: number;
  bagItems: Product[];
  saved: string[];
  addToBag: (product: Product) => Promise<void>;
  toggleSaved: (id: string) => Promise<void>;
  clearBag: () => Promise<void>;
  refreshBag: () => Promise<void>;
};
const ShopContext = createContext<ShopContextValue | null>(null);

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, credentials: "same-origin" });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartRow[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    void (async () => {
      await ensureGuestSession();
      const [catalog, bag, favorites] = await Promise.all([
        json<{ products: Product[] }>("/api/products"),
        json<{ items: CartRow[] }>("/api/cart"),
        json<{ productIds: string[] }>("/api/favorites"),
      ]);
      if (active) {
        setProducts(catalog.products);
        setCart(bag.items);
        setSaved(favorites.productIds);
      }
    })().catch(console.error);
    return () => {
      active = false;
    };
  }, []);
  async function setQuantity(productId: string, quantity: number) {
    await ensureGuestSession();
    const result = await json<{ items: CartRow[] }>("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    setCart(result.items);
  }
  async function addToBag(product: Product) {
    await setQuantity(
      product.id,
      (cart.find((item) => item.productId === product.id)?.quantity ?? 0) + 1,
    );
  }
  async function toggleSaved(id: string) {
    await ensureGuestSession();
    const result = await json<{ productIds: string[] }>("/api/favorites", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id, favorite: !saved.includes(id) }),
    });
    setSaved(result.productIds);
  }
  async function clearBag() {
    await Promise.all(cart.map((item) => setQuantity(item.productId, 0)));
    setCart([]);
  }
  async function refreshBag() {
    const result = await json<{ items: CartRow[] }>("/api/cart");
    setCart(result.items);
  }
  const bagItems = cart.flatMap((row) => {
    const product = products.find((item) => item.id === row.productId);
    return product ? Array.from({ length: row.quantity }, () => product) : [];
  });
  return (
    <ShopContext.Provider
      value={{
        products,
        bagCount: bagItems.length,
        bagItems,
        saved,
        addToBag,
        toggleSaved,
        clearBag,
        refreshBag,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
