import { IBrandRepository } from '../interfaces/IBrandRepository';
import { PrismaClient, Brand, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class BrandRepository implements IBrandRepository {
  async create(data: Prisma.BrandCreateInput): Promise<Brand> {
    return prisma.brand.create({ data });
  }

  async findAll(): Promise<Brand[]> {
    return prisma.brand.findMany({
      include: { products: true },
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
}
