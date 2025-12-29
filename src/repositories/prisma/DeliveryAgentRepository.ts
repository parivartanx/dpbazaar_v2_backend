import { PrismaClient, DeliveryAgent } from '@prisma/client';
import { IDeliveryAgentRepository } from '../interfaces/IDeliveryAgentRepository';

const prisma = new PrismaClient();

export class DeliveryAgentRepository implements IDeliveryAgentRepository {
  async create(data: any): Promise<DeliveryAgent> {
    return prisma.deliveryAgent.create({ data });
  }

  async update(id: string, data: any): Promise<DeliveryAgent> {
    return prisma.deliveryAgent.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<DeliveryAgent> {
    return prisma.deliveryAgent.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<DeliveryAgent | null> {
    return prisma.deliveryAgent.findUnique({
      where: { id },
      include: {
        _count: {
          select: { deliveries: true }
        }
      }
    });
  }

  async getAll(filters?: any): Promise<DeliveryAgent[]> {
    const { page, limit, search, status, zone, isAvailable } = filters || {};
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { agentCode: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) where.status = status;
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (zone) where.zones = { has: zone };

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.deliveryAgent.findMany(query);
  }

  async findByCode(code: string): Promise<DeliveryAgent | null> {
    return prisma.deliveryAgent.findUnique({
      where: { agentCode: code }
    });
  }
}
