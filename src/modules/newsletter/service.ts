import type { NewsletterRepository } from "./repository.contract";
import { NewsletterRepositoryFactory } from "./repository.factory";
export interface NewsletterServiceContract {
  subscribe(email: string): Promise<void>;
}
export class NewsletterService implements NewsletterServiceContract {
  constructor(private readonly repository: NewsletterRepository) {}
  subscribe(email: string) {
    return this.repository.subscribe(email.toLowerCase());
  }
}
export const newsletterService: NewsletterServiceContract =
  new NewsletterService(NewsletterRepositoryFactory.create());
