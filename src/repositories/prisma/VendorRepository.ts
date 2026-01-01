import { Vendor } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IVendorRepository } from '../interfaces/IVendorRepository';



export class VendorRepository implements IVendorRepository {
  async getAll(filters?: any): Promise<Vendor[]> {
    const { page, limit, search, status } = filters || {};
    
    const whereClause: any = {
      deletedAt: null
    };

    if (search) {
      whereClause.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { vendorCode: { contains: search, mode: 'insensitive' } },
        { businessEmail: { contains: search, mode: 'insensitive' } },
        { gstNumber: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const queryArgs: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    };

    if (page && limit) {
      queryArgs.skip = (page - 1) * limit;
      queryArgs.take = limit;
    }

    return prisma.vendor.findMany(queryArgs);
  }

  async getById(id: string): Promise<Vendor | null> {
    return prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });
  }

  async create(data: any): Promise<Vendor> {
    return prisma.vendor.create({
      data
    });
  }

  async update(id: string, data: any): Promise<Vendor> {
    return prisma.vendor.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    // Soft delete
    await prisma.vendor.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async updateStatus(id: string, status: string): Promise<Vendor> {
    const updateData: any = { status };
    if (status === 'ACTIVE') {
      updateData.verifiedAt = new Date();
    }
    return prisma.vendor.update({
      where: { id },
      data: updateData
    });
  }
}
