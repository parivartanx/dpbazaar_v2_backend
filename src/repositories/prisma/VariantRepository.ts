import { ProductVariant } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IVariantRepository } from '../interfaces/IVariantsRepository';


export class VariantRepository implements IVariantRepository {
  async getByProduct(productId: string): Promise<ProductVariant[]> {
    return prisma.productVariant.findMany({ where: { productId } });
  }

  async getById(id: string): Promise<ProductVariant | null> {
    return prisma.productVariant.findUnique({ where: { id } });
  }

  async create(productId: string, data: any): Promise<ProductVariant> {
    return prisma.productVariant.create({ data: { ...data, productId } });
  }

  async update(id: string, data: any): Promise<ProductVariant> {
    return prisma.productVariant.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.productVariant.delete({ where: { id } });
  }

  async toggleActive(id: string, isActive: boolean): Promise<ProductVariant> {
    return prisma.productVariant.update({ where: { id }, data: { isActive } });
  }
}
