import { StockMovement, Prisma } from '@prisma/client';

export interface IStockMovementRepository {
  create(data: Prisma.StockMovementCreateInput): Promise<StockMovement>;
  getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ movements: StockMovement[]; total: number }>;
  findById(id: string): Promise<StockMovement | null>;
  findByInventoryId(inventoryId: string): Promise<StockMovement[]>;
  findByWarehouseId(warehouseId: string): Promise<StockMovement[]>;
}
