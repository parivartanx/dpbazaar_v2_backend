// src/repositories/interfaces/IUserSubscriptionCardRepository.ts
import { UserSubscriptionCard, CardSubscriptionStatus } from '@prisma/client';

export interface IUserSubscriptionCardRepository {
  list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    status?: CardSubscriptionStatus;
  }): Promise<UserSubscriptionCard[]>;

  findById(id: string): Promise<UserSubscriptionCard | null>;

  findByCustomerIdAndStatus(customerId: string, status: CardSubscriptionStatus): Promise<UserSubscriptionCard | null>;

  create(
    data: Omit<UserSubscriptionCard, 'id' | 'purchasedAt'>
  ): Promise<UserSubscriptionCard>;

  update(
    id: string,
    data: Partial<
      Omit<UserSubscriptionCard, 'id' | 'purchasedAt'>
    >
  ): Promise<UserSubscriptionCard>;
  delete(id: string): Promise<UserSubscriptionCard>;
  countFiltered(params?: {
    customerId?: string;
    status?: CardSubscriptionStatus;
  }): Promise<number>;
}