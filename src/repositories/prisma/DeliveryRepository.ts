import { Delivery } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IDeliveryRepository } from '../interfaces/IDeliveryRepository';



export class DeliveryRepository implements IDeliveryRepository {
  async create(data: any): Promise<Delivery> {
    return prisma.delivery.create({ data });
  }

  async update(id: string, data: any): Promise<Delivery> {
    return prisma.delivery.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Delivery> {
    return prisma.delivery.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          select: { orderNumber: true, status: true, customerName: true, customerPhone: true }
        },
        agent: {
          select: { firstName: true, lastName: true, phone: true, agentCode: true }
        },
        tracking: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }

  async getAll(filters?: any): Promise<Delivery[]> {
    const { page, limit, status, agentId, startDate, endDate, search } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (agentId) where.deliveryAgentId = agentId;
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    if (search) {
      where.OR = [
        { trackingId: { contains: search, mode: 'insensitive' } },
        { receiverName: { contains: search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const query: any = {
      where,
      include: {
        order: {
          select: { orderNumber: true }
        },
        agent: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.delivery.findMany(query);
  }

  async findByOrderId(orderId: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({
      where: { orderId }
    });
  }

  async findByAgentId(agentId: string): Promise<Delivery[]> {
    return prisma.delivery.findMany({
      where: { deliveryAgentId: agentId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
