// src/repositories/prisma/SubscriptionCardRepository.ts
import { SubscriptionCard, CardStatus, Visibility } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ISubscriptionCardRepository } from '../interfaces/ISubscriptionCardRepository';



export class SubscriptionCardRepository implements ISubscriptionCardRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: CardStatus;
    visibility?: Visibility;
  }): Promise<SubscriptionCard[]> {
    const { page = 1, limit = 20, search, status, visibility } = params || {};

    const where: any = { status: { not: 'DELETED' } };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    return prisma.subscriptionCard.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<SubscriptionCard | null> {
    return prisma.subscriptionCard.findUnique({ where: { id } });
  }

  async create(
    data: Omit<SubscriptionCard, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SubscriptionCard> {
    return prisma.subscriptionCard.create({ data });
  }

  async update(
    id: string,
    data: Partial<
      Omit<SubscriptionCard, 'id' | 'createdAt' | 'updatedAt'>
    >
  ): Promise<SubscriptionCard> {
    return prisma.subscriptionCard.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<SubscriptionCard> {
    return prisma.subscriptionCard.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  async restore(id: string): Promise<SubscriptionCard> {
    return prisma.subscriptionCard.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async countFiltered(params?: {
    search?: string;
    status?: CardStatus;
    visibility?: Visibility;
  }): Promise<number> {
    const { search, status, visibility } = params || {};
    const where: any = { status: { not: 'DELETED' } };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    return prisma.subscriptionCard.count({ where });
  }
}