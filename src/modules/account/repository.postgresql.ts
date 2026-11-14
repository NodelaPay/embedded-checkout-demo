import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { profilesTable } from "./profile.table";
import type { ProfileRepository } from "./repository.contract";
import type { ProfileDto } from "./profile.dto";
export class PostgreSqlProfileRepository implements ProfileRepository {
  constructor(private readonly database: NodePgDatabase) {}
  async get(guestId: string): Promise<ProfileDto | undefined> {
    const [row] = await this.database
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.guestId, guestId));
    if (!row) return undefined;
    return {
      name: row.name,
      email: row.email,
      phone: row.phone,
      city: row.city,
      address: row.address,
      postalCode: row.postalCode,
    };
  }
  async save(guestId: string, profile: ProfileDto) {
    await this.database
      .insert(profilesTable)
      .values({ guestId, ...profile })
      .onConflictDoUpdate({
        target: profilesTable.guestId,
        set: { ...profile, updatedAt: new Date() },
      });
  }
  async remove(guestId: string) {
    await this.database
      .delete(profilesTable)
      .where(eq(profilesTable.guestId, guestId));
  }
}
