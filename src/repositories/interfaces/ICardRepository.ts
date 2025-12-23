// src/interfaces/ICardRepository.ts
import { SubscriptionCard } from '@prisma/client';

export interface ICardRepository {
  list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    visibility?: string;
  }): Promise<SubscriptionCard[]>;

  findById(id: string): Promise<SubscriptionCard | null>;

  create(
    data: Omit<SubscriptionCard, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SubscriptionCard>;

  update(
    id: string,
    data: Partial<
      Omit<SubscriptionCard, 'id' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<SubscriptionCard>;

  softDelete(id: string): Promise<SubscriptionCard>;

  restore(id: string): Promise<SubscriptionCard>;
}
