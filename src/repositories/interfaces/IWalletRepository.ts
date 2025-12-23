// src/repositories/interfaces/IWalletRepository.ts
import { Wallet, WalletType } from '@prisma/client';

export interface IWalletRepository {
  list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    type?: WalletType;
  }): Promise<Wallet[]>;

  findById(id: string): Promise<Wallet | null>;

  findByCustomerIdAndType(customerId: string, type: WalletType): Promise<Wallet | null>;

  create(
    data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Wallet>;

  update(
    id: string,
    data: Partial<
      Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<Wallet>;

  delete(id: string): Promise<Wallet>;
}