import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ordersTable } from "./order.table";
import type { OrderRepository } from "./repository.contract";
import type { OrderDto, OrderItemDto } from "./order.dto";

type Row = typeof ordersTable.$inferSelect;
function toDto(row: Row): OrderDto {
  return {
    id: row.id,
    status: "awaiting_payment",
    subtotal: row.subtotal,
    total: row.total,
    currency: "USD",
    createdAt: row.createdAt.toISOString(),
    customer: row.customer,
    items: row.items,
  };
}
export class PostgreSqlOrderRepository implements OrderRepository {
  constructor(private readonly database: NodePgDatabase) {}
  async list(guestId: string) {
    const rows = await this.database
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.guestId, guestId))
      .orderBy(desc(ordersTable.createdAt));
    return rows.map(toDto);
  }
  async getByKey(guestId: string, key: string) {
    const [row] = await this.database
      .select()
      .from(ordersTable)
      .where(
        and(
          eq(ordersTable.guestId, guestId),
          eq(ordersTable.idempotencyKey, key),
        ),
      );
    return row ? toDto(row) : undefined;
  }
  async create(
    guestId: string,
    key: string,
    customer: OrderDto["customer"],
    items: readonly OrderItemDto[],
  ) {
    const total = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const [row] = await this.database
      .insert(ordersTable)
      .values({
        id: randomUUID(),
        guestId,
        idempotencyKey: key,
        status: "awaiting_payment",
        subtotal: total,
        total,
        currency: "USD",
        customer,
        items,
      })
      .onConflictDoNothing()
      .returning();
    if (row) return toDto(row);
    const existing = await this.getByKey(guestId, key);
    if (!existing)
      throw new Error("Order insert conflict without an existing order");
    return existing;
  }
}
