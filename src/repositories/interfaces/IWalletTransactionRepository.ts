// src/repositories/interfaces/IWalletTransactionRepository.ts
import { WalletTransaction, TransactionType, TransactionReason, TransactionStatus } from '@prisma/client';

export interface IWalletTransactionRepository {
  list(params?: {
    page?: number;
    limit?: number;
    walletId?: string;
    customerId?: string;
    type?: TransactionType;
    reason?: TransactionReason;
    status?: TransactionStatus;
  }): Promise<WalletTransaction[]>;

  findById(id: string): Promise<WalletTransaction | null>;

  create(
    data: Omit<WalletTransaction, 'id' | 'createdAt'>
  ): Promise<WalletTransaction>;

  update(
    id: string,
    data: Partial<
      Omit<WalletTransaction, 'id' | 'createdAt'>
    >
  ): Promise<WalletTransaction>;

  delete(id: string): Promise<WalletTransaction>;
}