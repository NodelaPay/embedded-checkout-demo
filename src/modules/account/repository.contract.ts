import type { ProfileDto } from "./profile.dto";
export interface ProfileRepository {
  get(guestId: string): Promise<ProfileDto | undefined>;
  save(guestId: string, profile: ProfileDto): Promise<void>;
  remove(guestId: string): Promise<void>;
}
