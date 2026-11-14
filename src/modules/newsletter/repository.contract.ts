export interface NewsletterRepository {
  subscribe(email: string): Promise<void>;
}
