// src/repositories/interfaces/ISubscriptionCardRepository.ts
import { SubscriptionCard, CardStatus, Visibility } from '@prisma/client';

export interface ISubscriptionCardRepository {
  list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: CardStatus;
    visibility?: Visibility;
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

  countFiltered(params?: {
    search?: string;
    status?: CardStatus;
    visibility?: Visibility;
  }): Promise<number>;
}