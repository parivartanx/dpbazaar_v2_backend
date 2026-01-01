// src/repositories/prisma/UserSubscriptionCardRepository.ts
import { UserSubscriptionCard, CardSubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IUserSubscriptionCardRepository } from '../interfaces/IUserSubscriptionCardRepository';

export class UserSubscriptionCardRepository implements IUserSubscriptionCardRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    status?: CardSubscriptionStatus;
  }): Promise<UserSubscriptionCard[]> {
    const { page = 1, limit = 20, customerId, status } = params || {};

    const where: any = {};

    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    return prisma.userSubscriptionCard.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async findById(id: string): Promise<UserSubscriptionCard | null> {
    return prisma.userSubscriptionCard.findUnique({ 
      where: { id },
      include: {
        customer: true,
        card: true
      }
    });
  }

  async findByCustomerIdAndStatus(customerId: string, status: CardSubscriptionStatus): Promise<UserSubscriptionCard | null> {
    return prisma.userSubscriptionCard.findFirst({ 
      where: { 
        customerId,
        status
      },
      include: {
        customer: true,
        card: true
      }
    });
  }

  async create(
    data: Omit<UserSubscriptionCard, 'id' | 'purchasedAt'>
  ): Promise<UserSubscriptionCard> {
    return prisma.userSubscriptionCard.create({ 
      data,
      include: {
        customer: true,
        card: true
      }
    });
  }

  async update(
    id: string,
    data: Partial<
      Omit<UserSubscriptionCard, 'id' | 'purchasedAt'>
    >
  ): Promise<UserSubscriptionCard> {
    return prisma.userSubscriptionCard.update({
      where: { id },
      data,
      include: {
        customer: true,
        card: true
      }
    });
  }

  async delete(id: string): Promise<UserSubscriptionCard> {
    return prisma.userSubscriptionCard.delete({
      where: { id },
      include: {
        customer: true,
        card: true
      }
    });
  }
}