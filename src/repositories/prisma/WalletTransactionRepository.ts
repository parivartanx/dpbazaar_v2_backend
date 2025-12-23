// src/repositories/prisma/WalletTransactionRepository.ts
import { PrismaClient, WalletTransaction, TransactionType, TransactionReason, TransactionStatus } from '@prisma/client';
import { IWalletTransactionRepository } from '../interfaces/IWalletTransactionRepository';

const prisma = new PrismaClient();

export class WalletTransactionRepository implements IWalletTransactionRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    walletId?: string;
    customerId?: string;
    type?: TransactionType;
    reason?: TransactionReason;
    status?: TransactionStatus;
  }): Promise<WalletTransaction[]> {
    const { page = 1, limit = 20, walletId, customerId, type, reason, status } = params || {};

    const where: any = {};

    if (walletId) where.walletId = walletId;
    if (customerId) where.customerId = customerId;
    if (type) where.type = type;
    if (reason) where.reason = reason;
    if (status) where.status = status;

    return prisma.walletTransaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: true,
        customer: true
      }
    });
  }

  async findById(id: string): Promise<WalletTransaction | null> {
    return prisma.walletTransaction.findUnique({ 
      where: { id },
      include: {
        wallet: true,
        customer: true
      }
    });
  }

  async create(
    data: Omit<WalletTransaction, 'id' | 'createdAt'>
  ): Promise<WalletTransaction> {
    return prisma.walletTransaction.create({ 
      data,
      include: {
        wallet: true,
        customer: true
      }
    });
  }

  async update(
    id: string,
    data: Partial<
      Omit<WalletTransaction, 'id' | 'createdAt'>
    >
  ): Promise<WalletTransaction> {
    return prisma.walletTransaction.update({
      where: { id },
      data,
      include: {
        wallet: true,
        customer: true
      }
    });
  }

  async delete(id: string): Promise<WalletTransaction> {
    return prisma.walletTransaction.delete({
      where: { id },
      include: {
        wallet: true,
        customer: true
      }
    });
  }
}