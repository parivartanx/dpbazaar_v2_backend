import { ProductRelation } from '@prisma/client';

export interface IRelationRepository {
  getByProduct(productId: string): Promise<ProductRelation[]>;
  create(productId: string, data: any): Promise<ProductRelation>;
  delete(id: string): Promise<void>;
}
