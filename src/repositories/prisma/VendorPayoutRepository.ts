import { VendorPayout, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IVendorPayoutRepository } from '../interfaces/IVendorPayoutRepository';

export class VendorPayoutRepository implements IVendorPayoutRepository {
  async create(data: Prisma.VendorPayoutCreateInput): Promise<VendorPayout> {
    return await prisma.vendorPayout.create({
      data,
    });
  }

  async update(id: string, data: Prisma.VendorPayoutUpdateInput): Promise<VendorPayout> {
    return await prisma.vendorPayout.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<VendorPayout> {
    return await prisma.vendorPayout.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<VendorPayout | null> {
    return await prisma.vendorPayout.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            vendorCode: true,
          }
        }
      }
    });
  }

  async getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ payouts: VendorPayout[]; total: number }> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: Prisma.VendorPayoutWhereInput = {};

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.vendorId) {
        where.vendorId = filters.vendorId;
      }
      if (filters.startDate && filters.endDate) {
        where.periodStart = {
          gte: filters.startDate,
        };
        where.periodEnd = {
          lte: filters.endDate,
        };
      }
    }

    const [payouts, total] = await Promise.all([
      prisma.vendorPayout.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              id: true,
              businessName: true,
              vendorCode: true,
            }
          }
        }
      }),
      prisma.vendorPayout.count({ where }),
    ]);

    return { payouts, total };
  }

  async findByVendorId(vendorId: string): Promise<VendorPayout[]> {
    return await prisma.vendorPayout.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
