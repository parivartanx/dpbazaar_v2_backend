import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { WarehouseRepository } from '../repositories/prisma/WarehouseRepository';

const warehouseRepository = new WarehouseRepository();

export class WarehouseController {
  getAllWarehouses = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, search, type, isActive } = req.query;
      
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const filters: any = {
        page: pageNum,
        limit: limitNum,
        search: search as string,
        type: type as string,
        isActive: isActive !== undefined ? (isActive === 'true') : undefined,
      };

      const warehouses = await warehouseRepository.getAll(filters);
      const totalCount = await warehouseRepository.countFiltered({
        search: search as string,
        type: type as string,
        isActive: filters.isActive,
      });
      
      const response: ApiResponse = {
        success: true,
        data: {
          warehouses,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        message: 'Warehouses retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllWarehouses: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in fetching warehouses',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
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
