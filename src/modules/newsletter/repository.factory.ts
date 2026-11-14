import { getDatabaseProvider } from "@/infrastructure/database/factory";
import { PostgreSqlNewsletterRepository } from "./repository.postgresql";
export class NewsletterRepositoryFactory {
  static create() {
    return new PostgreSqlNewsletterRepository(getDatabaseProvider().client);
  }
}
