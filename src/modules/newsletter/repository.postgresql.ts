import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { subscribersTable } from "./subscriber.table";
import type { NewsletterRepository } from "./repository.contract";
export class PostgreSqlNewsletterRepository implements NewsletterRepository {
  constructor(private readonly database: NodePgDatabase) {}
  async subscribe(email: string) {
    await this.database
      .insert(subscribersTable)
      .values({ email })
      .onConflictDoNothing();
  }
}
