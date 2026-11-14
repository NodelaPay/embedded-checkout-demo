import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const profilesTable = pgTable("profiles", {
  guestId: uuid("guest_id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
