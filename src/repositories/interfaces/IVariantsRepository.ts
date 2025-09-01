import { ProductVariant } from '@prisma/client';

export interface IVariantRepository {
  getByProduct(productId: string): Promise<ProductVariant[]>;
  getById(id: string): Promise<ProductVariant | null>;
  create(productId: string, data: any): Promise<ProductVariant>;
  update(id: string, data: any): Promise<ProductVariant>;
  delete(id: string): Promise<void>;
  toggleActive(id: string, isActive: boolean): Promise<ProductVariant>;
}
