import { getDatabaseProvider } from "@/infrastructure/database/factory";
import { PostgreSqlOrderRepository } from "./repository.postgresql";
export class OrderRepositoryFactory {
  static create() {
    return new PostgreSqlOrderRepository(getDatabaseProvider().client);
  }
}
