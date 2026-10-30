import type { Review, ReviewInput } from '@/features/reviews/model/review';

/** Public read side (no login) and admin write side of customer reviews. */
export interface ReviewRepository {
  /** Newest first, no login needed. */
  listPublic(): Promise<Review[]>;
  /** Admin only. */
  list(): Promise<Review[]>;
  create(input: ReviewInput): Promise<Review>;
  update(id: number, input: ReviewInput): Promise<Review>;
  remove(id: number): Promise<void>;
}
