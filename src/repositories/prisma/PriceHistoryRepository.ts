import { PrismaClient, PriceHistory } from '@prisma/client';
import { IPriceHistoryRepository } from '../interfaces/priceHistory.repository.interface';

const prisma = new PrismaClient();

export class PriceHistoryRepository implements IPriceHistoryRepository {
  async findById(id: string): Promise<PriceHistory | null> {
    return prisma.priceHistory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });
  }

  async findAll(filters?: { productId?: string; page?: number; limit?: number }): Promise<PriceHistory[]> {
    const { productId, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (productId) where.productId = productId;

    return prisma.priceHistory.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });
  }

  async count(filters?: { productId?: string }): Promise<number> {
    const { productId } = filters || {};
    const where: any = {};

    if (productId) where.productId = productId;

    return prisma.priceHistory.count({ where });
  }
}
