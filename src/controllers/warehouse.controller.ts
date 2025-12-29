import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { WarehouseRepository } from '../repositories/prisma/WarehouseRepository';

const warehouseRepository = new WarehouseRepository();

export class WarehouseController {
  getAllWarehouses = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = { ...req.query };
      if (filters.page) filters.page = Number(filters.page);
      if (filters.limit) filters.limit = Number(filters.limit);

      const warehouses = await warehouseRepository.getAll(filters);
      
      const response: ApiResponse = {
        success: true,
        data: { warehouses },
        message: 'Warehouses retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllWarehouses: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching warehouses', error: (error as Error).message });
    }
  };

  getWarehouseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Warehouse ID is required' });
         return;
      }

      const warehouse = await warehouseRepository.getById(id);
      if (!warehouse) {
        res.status(404).json({ success: false, message: 'Warehouse not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { warehouse },
        message: 'Warehouse retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getWarehouseById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching warehouse', error: (error as Error).message });
    }
  };

  createWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const warehouse = await warehouseRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { warehouse },
        message: 'Warehouse created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createWarehouse: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating warehouse', error: (error as Error).message });
    }
  };

  updateWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Warehouse ID is required' });
         return;
      }

      const warehouse = await warehouseRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { warehouse },
        message: 'Warehouse updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateWarehouse: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating warehouse', error: (error as Error).message });
    }
  };

  deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Warehouse ID is required' });
         return;
      }

      await warehouseRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Warehouse deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteWarehouse: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting warehouse', error: (error as Error).message });
    }
  };
}
