import { getDatabaseProvider } from "@/infrastructure/database/factory";
import { PostgreSqlProfileRepository } from "./repository.postgresql";
export class ProfileRepositoryFactory {
  static create() {
    return new PostgreSqlProfileRepository(getDatabaseProvider().client);
  }
}
