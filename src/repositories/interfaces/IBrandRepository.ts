import { Brand, Prisma } from '@prisma/client';

export interface IBrandRepository {
  create(data: Prisma.BrandCreateInput): Promise<Brand>;
  findAll(): Promise<Brand[]>;
  findById(id: string): Promise<Brand | null>;
  update(id: string, data: Prisma.BrandUpdateInput): Promise<Brand>;
  delete(id: string): Promise<void>;
}
