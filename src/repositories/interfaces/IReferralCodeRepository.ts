// src/repositories/interfaces/IReferralCodeRepository.ts
import { ReferralCode } from '@prisma/client';

export interface IReferralCodeRepository {
  list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    isActive?: boolean;
  }): Promise<ReferralCode[]>;

  findById(id: string): Promise<ReferralCode | null>;

  findByCode(code: string): Promise<ReferralCode | null>;

  findByCustomerId(customerId: string): Promise<ReferralCode | null>;

  create(
    data: Omit<ReferralCode, 'id' | 'createdAt'>
  ): Promise<ReferralCode>;

  update(
    id: string,
    data: Partial<
      Omit<ReferralCode, 'id' | 'createdAt'>
    >
  ): Promise<ReferralCode>;

  delete(id: string): Promise<ReferralCode>;
  
  deactivate(id: string): Promise<ReferralCode>;
}