import { Refund } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IRefundRepository } from '../interfaces/refund.repository.interface';



export class RefundRepository implements IRefundRepository {
  async create(data: any): Promise<Refund> {
    return prisma.refund.create({ data });
  }

  async findById(id: string): Promise<Refund | null> {
    return prisma.refund.findUnique({
      where: { id },
      include: {
        payment: true,
        return: true,
      },
    });
  }

  async findAll(filters?: { status?: string; paymentId?: string; page?: number; limit?: number }): Promise<Refund[]> {
    const { status, paymentId, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (paymentId) where.paymentId = paymentId;

    return prisma.refund.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true,
        return: true,
      },
    });
  }

  async update(id: string, data: any): Promise<Refund> {
    return prisma.refund.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Refund> {
    return prisma.refund.delete({
      where: { id },
    });
  }

  async count(filters?: { status?: string; paymentId?: string }): Promise<number> {
    const { status, paymentId } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (paymentId) where.paymentId = paymentId;

    return prisma.refund.count({ where });
  }
}
