import { PrismaClient, StockMovement, Prisma } from '@prisma/client';
import { IStockMovementRepository } from '../interfaces/IStockMovementRepository';

const prisma = new PrismaClient();

export class StockMovementRepository implements IStockMovementRepository {
  async create(data: Prisma.StockMovementCreateInput): Promise<StockMovement> {
    // When creating a movement, we should also update the inventory
    // This transaction logic might be better placed in a service, but for simple CRUD, repository handling is okay or controller.
    // However, Prisma repositories usually just handle data access.
    // For now, simple create. The actual stock update logic should be in the service layer or handled via specific actions.
    return await prisma.stockMovement.create({
      data,
    });
  }

  async getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ movements: StockMovement[]; total: number }> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: Prisma.StockMovementWhereInput = {};

    if (filters) {
      if (filters.inventoryId) {
        where.inventoryId = filters.inventoryId;
      }
      if (filters.warehouseId) {
        where.warehouseId = filters.warehouseId;
      }
      if (filters.type) {
        where.type = filters.type;
      }
      if (filters.startDate && filters.endDate) {
        where.performedAt = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { performedAt: 'desc' },
        include: {
          inventory: {
            include: {
              product: { select: { name: true, sku: true } },
              variant: { select: { variantName: true, variantSku: true } },
            }
          },
          warehouse: { select: { name: true } }
        }
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { movements, total };
  }

  async findById(id: string): Promise<StockMovement | null> {
    return await prisma.stockMovement.findUnique({
      where: { id },
      include: {
        inventory: {
          include: {
            product: { select: { name: true, sku: true } },
            variant: { select: { variantName: true, variantSku: true } },
          }
        },
        warehouse: { select: { name: true } }
      }
    });
  }

  async findByInventoryId(inventoryId: string): Promise<StockMovement[]> {
    return await prisma.stockMovement.findMany({
      where: { inventoryId },
      orderBy: { performedAt: 'desc' },
    });
  }

  async findByWarehouseId(warehouseId: string): Promise<StockMovement[]> {
    return await prisma.stockMovement.findMany({
      where: { warehouseId },
      orderBy: { performedAt: 'desc' },
    });
  }
}
