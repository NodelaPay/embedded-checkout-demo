import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: varchar("id", { length: 100 }).primaryKey(),
  category: varchar("category", { length: 40 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  stock: integer("stock").notNull(),
});
