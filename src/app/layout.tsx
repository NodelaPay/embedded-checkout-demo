import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShopProvider } from "@/modules/storefront/shop-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trümung — Fashion Store",
  description: "Rare limited edition pieces from New York and Los Angeles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
