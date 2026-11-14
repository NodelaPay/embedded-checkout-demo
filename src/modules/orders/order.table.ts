import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { OrderDto } from "./order.dto";
export const ordersTable = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey(),
    guestId: uuid("guest_id").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 100 }).notNull(),
    status: varchar("status", { length: 30 }).notNull(),
    subtotal: integer("subtotal").notNull(),
    total: integer("total").notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    customer: jsonb("customer").$type<OrderDto["customer"]>().notNull(),
    items: jsonb("items").$type<OrderDto["items"]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("orders_guest_idempotency_key").on(
      table.guestId,
      table.idempotencyKey,
    ),
  ],
);
