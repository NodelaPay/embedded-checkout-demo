import { getDatabaseProvider } from "@/infrastructure/database/factory";
import { PostgreSqlProductRepository } from "./repository.postgresql";

export class ProductRepositoryFactory {
  static create() {
    return new PostgreSqlProductRepository(getDatabaseProvider().client);
  }
}
