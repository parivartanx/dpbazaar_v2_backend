// src/repositories/prisma/WalletRepository.ts
import { Wallet, WalletType } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IWalletRepository } from '../interfaces/IWalletRepository';



export class WalletRepository implements IWalletRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    type?: WalletType;
  }): Promise<Wallet[]> {
    const { page = 1, limit = 20, customerId, type } = params || {};

    const where: any = {};

    if (customerId) where.customerId = customerId;
    if (type) where.type = type;

    return prisma.wallet.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Wallet | null> {
    return prisma.wallet.findUnique({ where: { id } });
  }

  async findByCustomerIdAndType(customerId: string, type: WalletType): Promise<Wallet | null> {
    return prisma.wallet.findUnique({ 
      where: { 
        customerId_type: {
          customerId,
          type
        }
      } 
    });
  }

  async create(
    data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Wallet> {
    return prisma.wallet.create({ data });
  }

  async update(
    id: string,
    data: Partial<
      Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<Wallet> {
    return prisma.wallet.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Wallet> {
    return prisma.wallet.delete({
      where: { id },
    });
  }
}