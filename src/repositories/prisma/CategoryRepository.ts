import { Prisma, Category } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';



export class CategoryRepository implements ICategoryRepository {
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { displayOrder: 'asc' } });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async toggleFeature(id: string, isFeatured: boolean): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isFeatured },
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive },
    });
  }
}
