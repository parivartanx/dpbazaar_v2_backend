import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { InventoryRepository } from '../repositories/prisma/InventoryRepository';

const inventoryRepository = new InventoryRepository();

export class InventoryController {
  getAllInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        warehouseId: req.query.warehouseId as string,
        productId: req.query.productId as string,
        variantId: req.query.variantId as string,
      };

      const inventory = await inventoryRepository.getAll(filters);
      const response: ApiResponse = {
        success: true,
        data: { inventory },
        message: 'Inventory records retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllInventory: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching inventory', error: (error as Error).message });
    }
  };

  getInventoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Inventory ID is required' });
         return;
      }

      const inventory = await inventoryRepository.getById(id);
      if (!inventory) {
        res.status(404).json({ success: false, message: 'Inventory record not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { inventory },
        message: 'Inventory record retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getInventoryById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching inventory record', error: (error as Error).message });
    }
  };

  createInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check if inventory already exists for this product/variant in this warehouse
      const { productId, variantId, warehouseId } = req.body;
      const existing = await inventoryRepository.findByProductAndWarehouse(productId, warehouseId, variantId);
      
      if (existing) {
        res.status(409).json({ success: false, message: 'Inventory record already exists for this product/variant in the specified warehouse' });
        return;
      }

      const inventory = await inventoryRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { inventory },
        message: 'Inventory record created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createInventory: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating inventory record', error: (error as Error).message });
    }
  };

  updateInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Inventory ID is required' });
         return;
      }

      const inventory = await inventoryRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { inventory },
        message: 'Inventory record updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateInventory: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating inventory record', error: (error as Error).message });
    }
  };

  deleteInventory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Inventory ID is required' });
         return;
      }

      await inventoryRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Inventory record deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteInventory: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting inventory record', error: (error as Error).message });
    }
  };
}
