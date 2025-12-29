import { PrismaClient, Discount } from '@prisma/client';
import { IDiscountRepository } from '../interfaces/IDiscountRepository';

const prisma = new PrismaClient();

export class DiscountRepository implements IDiscountRepository {
  async getAll(filters?: any): Promise<Discount[]> {
    const { page, limit, search, isActive, type } = filters || {};
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }
    
    if (type) {
      whereClause.type = type;
    }

    // If pagination is not needed by the caller (or handled differently), we can adjust.
    // But typically repo returns list. The controller handled pagination logic with `skip/take`.
    // I'll support both basic findMany and paginated if needed, but for now strict implementation:
    
    const queryArgs: any = {
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
        queryArgs.skip = (page - 1) * limit;
        queryArgs.take = limit;
    }

    return prisma.discount.findMany(queryArgs);
  }

  async count(filters?: any): Promise<number> {
    const { search, isActive, type } = filters || {};
    const whereClause: any = {};
    if (search) {
        whereClause.OR = [
          { code: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
    }
    if (isActive !== undefined) whereClause.isActive = isActive;
    if (type) whereClause.type = type;
    
    return prisma.discount.count({ where: whereClause });
  }

  async getById(id: string): Promise<Discount | null> {
    return prisma.discount.findUnique({ where: { id } });
  }

  async getByCode(code: string): Promise<Discount | null> {
    return prisma.discount.findUnique({ where: { code } });
  }

  async create(data: any): Promise<Discount> {
    return prisma.discount.create({ data });
  }

  async update(id: string, data: any): Promise<Discount> {
    return prisma.discount.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.discount.delete({ where: { id } });
  }
}
