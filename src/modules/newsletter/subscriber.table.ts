import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
export const subscribersTable = pgTable("newsletter_subscribers", {
  email: varchar("email", { length: 254 }).primaryKey(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
