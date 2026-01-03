import { Warehouse } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IWarehouseRepository } from '../interfaces/IWarehouseRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class WarehouseRepository implements IWarehouseRepository {
  async create(data: any): Promise<Warehouse> {
    return prisma.warehouse.create({ data });
  }

  async update(id: string, data: any): Promise<Warehouse> {
    return prisma.warehouse.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Warehouse> {
    return prisma.warehouse.delete({ where: { id } });
  }

  async getById(id: string): Promise<Warehouse | null> {
    return prisma.warehouse.findUnique({ 
      where: { id }, 
      include: {
        manager: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      },
    });
  }

  async getAll(filters?: any): Promise<Warehouse[]> {
    const { page, limit, search, type, isActive } = filters || {};
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const query: any = {
      where,
      include: {
        manager: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.warehouse.findMany(query);
  }

  async getByCode(code: string): Promise<Warehouse | null> {
    return prisma.warehouse.findUnique({ where: { code } });
  }
}
