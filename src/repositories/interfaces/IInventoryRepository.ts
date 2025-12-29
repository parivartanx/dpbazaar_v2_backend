import { Inventory } from '@prisma/client';

export interface IInventoryRepository {
  create(data: any): Promise<Inventory>;
  update(id: string, data: any): Promise<Inventory>;
  delete(id: string): Promise<Inventory>;
  getById(id: string): Promise<Inventory | null>;
  getAll(filters?: any): Promise<Inventory[]>;
  findByProductAndWarehouse(productId: string, warehouseId: string, variantId?: string): Promise<Inventory | null>;
}
