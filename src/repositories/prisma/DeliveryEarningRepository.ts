import { PrismaClient, DeliveryEarning } from '@prisma/client';
import { IDeliveryEarningRepository } from '../interfaces/deliveryEarning.repository.interface';

const prisma = new PrismaClient();

export class DeliveryEarningRepository implements IDeliveryEarningRepository {
  async create(data: any): Promise<DeliveryEarning> {
    return prisma.deliveryEarning.create({ data });
  }

  async findById(id: string): Promise<DeliveryEarning | null> {
    return prisma.deliveryEarning.findUnique({
      where: { id },
      include: {
        agent: true,
      },
    });
  }

  async findAll(filters?: { agentId?: string; status?: string; type?: string; page?: number; limit?: number }): Promise<DeliveryEarning[]> {
    const { agentId, status, type, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (agentId) where.agentId = agentId;
    if (status) where.status = status;
    if (type) where.type = type;

    return prisma.deliveryEarning.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        agent: true,
      },
    });
  }

  async update(id: string, data: any): Promise<DeliveryEarning> {
    return prisma.deliveryEarning.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<DeliveryEarning> {
    return prisma.deliveryEarning.delete({
      where: { id },
    });
  }

  async count(filters?: { agentId?: string; status?: string; type?: string }): Promise<number> {
    const { agentId, status, type } = filters || {};
    const where: any = {};

    if (agentId) where.agentId = agentId;
    if (status) where.status = status;
    if (type) where.type = type;

    return prisma.deliveryEarning.count({ where });
  }
}
