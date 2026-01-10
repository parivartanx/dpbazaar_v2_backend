import { IBrandRepository } from '../interfaces/IBrandRepository';
import { Brand, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';



export class BrandRepository implements IBrandRepository {
  async create(data: Prisma.BrandCreateInput): Promise<Brand> {
    return prisma.brand.create({ data });
  }

  async findAll(): Promise<Brand[]> {
    return prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Brand | null> {
    return prisma.brand.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async update(id: string, data: Prisma.BrandUpdateInput): Promise<Brand> {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.brand.delete({ where: { id } });
  }

  async filterBrands(params: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Brand[]> {
    const { search, isActive, page = 1, limit = 20 } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.brand.findMany({
      where,
      include: {
        products: {
          select: { id: true, name: true },
          take: 5, // Limit products in response
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countFilteredBrands(params: {
    search?: string;
    isActive?: boolean;
  }): Promise<number> {
    const { search, isActive } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.brand.count({ where });
  }
}
