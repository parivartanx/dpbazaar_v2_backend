import { PrismaClient, Return } from '@prisma/client';
import { IReturnRepository } from '../interfaces/return.repository.interface';

const prisma = new PrismaClient();

export class ReturnRepository implements IReturnRepository {
  async create(data: any): Promise<Return> {
    return prisma.return.create({ data });
  }

  async findById(id: string): Promise<Return | null> {
    return prisma.return.findUnique({
      where: { id },
      include: {
        order: true,
        items: true,
        refunds: true,
      },
    });
  }

  async findAll(filters?: { status?: string; orderId?: string; returnNumber?: string; page?: number; limit?: number }): Promise<Return[]> {
    const { status, orderId, returnNumber, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (orderId) where.orderId = orderId;
    if (returnNumber) where.returnNumber = { contains: returnNumber, mode: 'insensitive' };

    return prisma.return.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        order: true,
        items: true,
      },
    });
  }

  async update(id: string, data: any): Promise<Return> {
    return prisma.return.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Return> {
    return prisma.return.delete({
      where: { id },
    });
  }

  async count(filters?: { status?: string; orderId?: string; returnNumber?: string }): Promise<number> {
    const { status, orderId, returnNumber } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (orderId) where.orderId = orderId;
    if (returnNumber) where.returnNumber = { contains: returnNumber, mode: 'insensitive' };

    return prisma.return.count({ where });
  }
}
