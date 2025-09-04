// src/repositories/prisma/CardRepository.ts
import { PrismaClient, CardManagement } from '@prisma/client';
import { ICardRepository } from '../interfaces/ICardRepository';

const prisma = new PrismaClient();

export class CardRepository implements ICardRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    visibility?: string;
  }): Promise<CardManagement[]> {
    const { page = 1, limit = 20, search, status, visibility } = params || {};

    const where: any = { deletedAt: null };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    return prisma.cardManagement.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<CardManagement | null> {
    return prisma.cardManagement.findUnique({ where: { id } });
  }

  async create(
    data: Omit<CardManagement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<CardManagement> {
    return prisma.cardManagement.create({ data });
  }

  async update(
    id: string,
    data: Partial<
      Omit<CardManagement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >
  ): Promise<CardManagement> {
    return prisma.cardManagement.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<CardManagement> {
    return prisma.cardManagement.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<CardManagement> {
    return prisma.cardManagement.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
