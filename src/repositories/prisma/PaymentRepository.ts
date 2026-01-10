import { Payment, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IPaymentRepository } from '../interfaces/IPaymentRepository';



export class PaymentRepository implements IPaymentRepository {
  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({ where: { id } });
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({ where: { orderId } });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return prisma.payment.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Payment> {
    return prisma.payment.delete({ where: { id } });
  }

  async list(filters?: { orderId?: string; status?: string; method?: string; page?: number; limit?: number }): Promise<Payment[]> {
    const { orderId, status, method, page = 1, limit = 10 } = filters || {};
    
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;
    if (method) where.method = method;

    return prisma.payment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countFiltered(filters?: { orderId?: string; status?: string; method?: string }): Promise<number> {
    const { orderId, status, method } = filters || {};
    
    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;
    if (method) where.method = method;

    return prisma.payment.count({ where });
  }
}