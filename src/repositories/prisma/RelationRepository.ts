import { ProductRelation } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IRelationRepository } from '../interfaces/IProductRelationRepository';



export class RelationRepository implements IRelationRepository {
  async getByProduct(productId: string): Promise<ProductRelation[]> {
    return prisma.productRelation.findMany({
      where: { productId },
      include: { relatedProduct: true },
    });
  }

  async create(productId: string, data: any): Promise<ProductRelation> {
    return prisma.productRelation.create({
      data: { ...data, productId },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.productRelation.delete({ where: { id } });
  }
}
