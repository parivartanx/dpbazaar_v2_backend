import { Inventory } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IInventoryRepository } from '../interfaces/IInventoryRepository';


export class InventoryRepository implements IInventoryRepository {
  async create(data: any): Promise<Inventory> {
    return prisma.inventory.create({ data });
  }

  async update(id: string, data: any): Promise<Inventory> {
    return prisma.inventory.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Inventory> {
    return prisma.inventory.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<Inventory | null> {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        product: {
          select: { name: true, sku: true }
        },
        variant: {
          select: { variantName: true, variantSku: true }
        },
        warehouse: {
          select: { name: true, code: true }
        }
      }
    });
  }

  async getAll(filters?: any): Promise<Inventory[]> {
    const { page, limit, warehouseId, productId, variantId, search } = filters || {};
    const where: any = {};

    if (warehouseId) where.warehouseId = warehouseId;
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    // Add search capability
    if (search) {
      where.OR = [
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
        { warehouse: { name: { contains: search, mode: 'insensitive' } } },
        { warehouse: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const query: any = {
      where,
      include: {
        product: {
          select: { name: true, sku: true }
        },
        variant: {
          select: { variantName: true, variantSku: true }
        },
        warehouse: {
          select: { name: true, code: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.inventory.findMany(query);
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string, variantId?: string): Promise<Inventory | null> {
    return prisma.inventory.findFirst({
      where: {
        productId,
        warehouseId,
        variantId: variantId || null
      }
    });
  }

  async countFiltered(filters?: any): Promise<number> {
    const { warehouseId, productId, variantId, search } = filters || {};
    const where: any = {};

    if (warehouseId) where.warehouseId = warehouseId;
    if (productId) where.productId = productId;
    if (variantId) where.variantId = variantId;

    // Add search capability if needed - search in related product/warehouse names
    if (search) {
      where.OR = [
        { product: { name: { contains: search, mode: 'insensitive' } } },
        { product: { sku: { contains: search, mode: 'insensitive' } } },
        { warehouse: { name: { contains: search, mode: 'insensitive' } } },
        { warehouse: { code: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return prisma.inventory.count({ where });
  }
}
