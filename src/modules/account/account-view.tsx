"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EditorialImage, ProductCard } from "@/modules/storefront/components";
import { images } from "@/modules/storefront/data";
import { useShop } from "@/modules/storefront/shop-context";
import { ensureGuestSession } from "@/infrastructure/http/client-session";

type Tab = "contact" | "saved" | "orders";
type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
};
const initialProfile: Profile = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  postalCode: "",
};
type Order = {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  items: { title: string; quantity: number }[];
};

export function AccountView() {
  const [tab, setTab] = useState<Tab>("contact");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const { saved, products } = useShop();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 700px)").matches) setTab("saved");
      void (async () => {
        await ensureGuestSession();
        const [accountResponse, ordersResponse] = await Promise.all([
          fetch("/api/account"),
          fetch("/api/orders"),
        ]);
        if (accountResponse.ok) {
          const data: { profile: Profile | null } =
            await accountResponse.json();
          if (data.profile) {
            setProfile(data.profile);
            setDraft(data.profile);
          }
        }
        if (ordersResponse.ok) {
          const data: { orders: Order[] } = await ordersResponse.json();
          setOrders(data.orders);
        }
      })().catch(console.error);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function saveProfile() {
    const response = await fetch("/api/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!response.ok) {
      setNotice("Please enter a valid name and email address.");
      return;
    }
    setProfile(draft);
    setEditing(false);
    setNotice("Contact information updated.");
  }

  const firstName = profile.name.split(" ")[0] || "there";
  const savedProducts = products.filter((product) =>
    saved.includes(product.id),
  );

  return (
    <main className="account-page">
      <aside className="account-hero">
        <EditorialImage src={images.coat} alt="Black coat fashion portrait" />
        <div className="account-intro">
          <h1>Hi, {firstName}</h1>
          <p>
            You can manage your account here. Please,
            <br />
            choose what you’d like to do.
          </p>
          <AccountTabs tab={tab} setTab={setTab} />
        </div>
      </aside>
      <section className="account-main">
        <div className="account-mobile-intro">
          <h1>Hi, {firstName}</h1>
          <p>
            You can manage your account here. Please, choose what you’d like to
            do.
          </p>
          <AccountTabs tab={tab} setTab={setTab} />
        </div>
        {tab === "contact" && (
          <div className="account-contact">
            <h2>CONTACT INFORMATION</h2>
            <div className="contact-grid">
              {(
                [
                  ["name", "NAME"],
                  ["email", "EMAIL"],
                  ["phone", "PHONE"],
                  ["city", "CITY"],
                  ["address", "ADDRESS"],
                  ["postalCode", "POSTAL CODE"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className={`contact-field field-${key}`}>
                  <span>{label}</span>
                  {editing ? (
                    <input
                      value={draft[key]}
                      onChange={(event) =>
                        setDraft({ ...draft, [key]: event.target.value })
                      }
                    />
                  ) : (
                    <strong>{profile[key]}</strong>
                  )}
                </label>
              ))}
            </div>
            <div className="contact-actions">
              {editing ? (
                <>
                  <button className="text-link" onClick={saveProfile}>
                    SAVE
                  </button>
                  <button
                    className="text-link muted"
                    onClick={() => {
                      setDraft(profile);
                      setEditing(false);
                    }}
                  >
                    CANCEL
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-link"
                    onClick={() => setEditing(true)}
                  >
                    EDIT
                  </button>
                  <button
                    className="text-link muted"
                    onClick={() => setEditing(true)}
                  >
                    CHANGE
                  </button>
                  <button
                    className="text-link muted"
                    onClick={() => {
                      void fetch("/api/account", { method: "DELETE" }).then(
                        (response) => {
                          if (response.ok) {
                            setProfile(initialProfile);
                            setDraft(initialProfile);
                            setNotice("Contact information removed.");
                          }
                        },
                      );
                    }}
                  >
                    REMOVE
                  </button>
                </>
              )}
            </div>
            {notice && <p role="status">{notice}</p>}
          </div>
        )}
        {tab === "saved" && (
          <div className="account-saved">
            <h2>SAVED COATS</h2>
            <div className="saved-row">
              {savedProducts
                .filter((item) => item.category === "COATS")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <h2>SAVED BAGS</h2>
            <div className="saved-row">
              {savedProducts
                .filter((item) => item.category === "BAGS")
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {saved.includes("leather-shoes") && (
              <>
                <h2>SAVED SHOES</h2>
                <div className="saved-row">
                  {products
                    .filter((item) => item.id === "leather-shoes")
                    .map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))}
                </div>
              </>
            )}
            {savedProducts.length === 0 && <p>No saved items yet.</p>}
          </div>
        )}
        {tab === "orders" && (
          <div className="account-orders">
            <h2>ORDER HISTORY</h2>
            {orders.map((order) => (
              <div className="order-row" key={order.id}>
                <div>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <p>Ref: {order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <strong>${order.total.toLocaleString()}</strong>
                <button
                  className="text-link muted"
                  onClick={() =>
                    setNotice(
                      `${order.items.map((item) => `${item.quantity} × ${item.title}`).join(", ")} · ${order.status.replace("_", " ")}`,
                    )
                  }
                >
                  VIEW
                </button>
                {order.status !== "paid" && (
                  <Link
                    className="text-link"
                    href={`/checkout?orderId=${order.id}`}
                  >
                    PAY
                  </Link>
                )}
              </div>
            ))}
            {orders.length === 0 && <p>No orders yet.</p>}
            {notice && <p role="status">{notice}</p>}
          </div>
        )}
      </section>
    </main>
  );
}

function AccountTabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  return (
    <nav className="account-tabs" aria-label="Account sections">
      <button
        className={tab === "contact" ? "active" : ""}
        onClick={() => setTab("contact")}
      >
        CONTACT INFORMATION
      </button>
      <button
        className={tab === "saved" ? "active" : ""}
        onClick={() => setTab("saved")}
      >
        SAVED ITEMS
      </button>
      <button
        className={tab === "orders" ? "active" : ""}
        onClick={() => setTab("orders")}
      >
        ORDER HISTORY
      </button>
    </nav>
  );
}
