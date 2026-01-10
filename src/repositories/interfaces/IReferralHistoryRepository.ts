// src/repositories/interfaces/IReferralHistoryRepository.ts
import { ReferralHistory, ReferralStatus } from '@prisma/client';

export interface IReferralHistoryRepository {
  list(params?: {
    page?: number;
    limit?: number;
    referrerId?: string;
    referredUserId?: string;
    status?: ReferralStatus;
  }): Promise<ReferralHistory[]>;

  findById(id: string): Promise<ReferralHistory | null>;

  findByReferredUserId(referredUserId: string): Promise<ReferralHistory | null>;

  create(
    data: Omit<ReferralHistory, 'id' | 'createdAt'>
  ): Promise<ReferralHistory>;

  update(
    id: string,
    data: Partial<
      Omit<ReferralHistory, 'id' | 'createdAt'>
    >
  ): Promise<ReferralHistory>;

  delete(id: string): Promise<ReferralHistory>;
  
  countFiltered(params?: {
    referrerId?: string;
    referredUserId?: string;
    status?: ReferralStatus;
  }): Promise<number>;
}