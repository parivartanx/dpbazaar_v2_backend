// src/repositories/prisma/UserSubscriptionCardRepository.ts
import { PrismaClient, UserSubscriptionCard, CardSubscriptionStatus } from '@prisma/client';
import { IUserSubscriptionCardRepository } from '../interfaces/IUserSubscriptionCardRepository';

const prisma = new PrismaClient();

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
        card: true,
        referralCode: true
      }
    });
  }

  async findByCustomerIdAndStatus(customerId: string, status: CardSubscriptionStatus): Promise<UserSubscriptionCard | null> {
    return prisma.userSubscriptionCard.findUnique({ 
      where: { 
        customerId_status: {
          customerId,
          status
        }
      },
      include: {
        customer: true,
        card: true,
        referralCode: true
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
        card: true,
        referralCode: true
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
        card: true,
        referralCode: true
      }
    });
  }

  async delete(id: string): Promise<UserSubscriptionCard> {
    return prisma.userSubscriptionCard.delete({
      where: { id },
      include: {
        customer: true,
        card: true,
        referralCode: true
      }
    });
  }
}