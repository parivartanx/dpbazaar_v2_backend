import { Review } from '@prisma/client';

export interface IReviewRepository {
  getAll(filters?: any): Promise<Review[]>;
  getById(id: string): Promise<Review | null>;
  create(data: any): Promise<Review>;
  approve(id: string, approvedBy: string): Promise<Review>;
  reject(id: string): Promise<Review>;
  delete(id: string): Promise<void>;
  reply(id: string, reply: string): Promise<Review>;
  countFiltered(filters?: any): Promise<number>;
}
