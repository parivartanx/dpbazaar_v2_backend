import { Prisma, Category } from '@prisma/client';

export interface ICategoryRepository {
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
  delete(id: string): Promise<void>;
  toggleFeature(id: string, isFeatured: boolean): Promise<Category>;
  toggleActive(id: string, isActive: boolean): Promise<Category>;
  filterCategories(params: {
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    parentId?: string;
    level?: number;
    page?: number;
    limit?: number;
    flat?: boolean; // If true, return flat list; if false, return hierarchical
  }): Promise<Category[]>;
  countFilteredCategories(params: {
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    parentId?: string;
    level?: number;
  }): Promise<number>;
}
