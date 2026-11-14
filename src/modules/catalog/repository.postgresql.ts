import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { productsTable } from "./product.table";
import type { ProductRepository } from "./repository.contract";

export class PostgreSqlProductRepository implements ProductRepository {
  constructor(private readonly database: NodePgDatabase) {}
  list() {
    return this.database.select().from(productsTable);
  }
}
