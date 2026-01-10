// src/repositories/prisma/CardRepository.ts
import { SubscriptionCard } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ICardRepository } from '../interfaces/ICardRepository';



export class CardRepository implements ICardRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    visibility?: string;
  }): Promise<SubscriptionCard[]> {
    const { page = 1, limit = 20, search, status, visibility } = params || {};

    const where: any = { deletedAt: null };

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
    status?: string;
    visibility?: string;
  }): Promise<number> {
    const { search, status, visibility } = params || {};
    const where: any = { deletedAt: null };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    return prisma.subscriptionCard.count({ where });
  }
}
