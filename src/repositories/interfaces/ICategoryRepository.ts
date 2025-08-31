import { Prisma, Category } from '@prisma/client';

export interface ICategoryRepository {
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
  delete(id: string): Promise<void>;
  toggleFeature(id: string, isFeatured: boolean): Promise<Category>;
  toggleActive(id: string, isActive: boolean): Promise<Category>;
}
