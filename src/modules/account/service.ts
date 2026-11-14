import type { ProfileDto } from "./profile.dto";
import type { ProfileRepository } from "./repository.contract";
import { ProfileRepositoryFactory } from "./repository.factory";
export interface AccountServiceContract {
  get(guestId: string): Promise<ProfileDto | undefined>;
  save(guestId: string, profile: ProfileDto): Promise<void>;
  remove(guestId: string): Promise<void>;
}
export class AccountService implements AccountServiceContract {
  constructor(private readonly repository: ProfileRepository) {}
  get(guestId: string) {
    return this.repository.get(guestId);
  }
  save(guestId: string, profile: ProfileDto) {
    return this.repository.save(guestId, profile);
  }
  remove(guestId: string) {
    return this.repository.remove(guestId);
  }
}
export const accountService: AccountServiceContract = new AccountService(
  ProfileRepositoryFactory.create(),
);
