import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { products, images } from "../src/modules/storefront/data";
import { productsTable } from "../src/modules/catalog/product.table";

config({ path: ".env.local" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const database = drizzle(pool);
const catalog = [
  ...products.map((product) => ({
    ...product,
    description: "Rare limited edition piece from the Trümung collection.",
    stock: 350,
  })),
  {
    id: "leather-shoes",
    category: "SHOES",
    title: "LEATHER SHOES",
    price: 1200,
    image: images.shoes,
    description:
      "Sculptural black leather footwear from the limited collection.",
    stock: 350,
  },
];
async function main() {
  try {
    for (const product of catalog) {
      await database
        .insert(productsTable)
        .values(product)
        .onConflictDoUpdate({ target: productsTable.id, set: product });
    }
    console.log(`Seeded ${catalog.length} products`);
  } finally {
    await pool.end();
  }
}
void main();
