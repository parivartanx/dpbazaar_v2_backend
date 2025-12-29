import { Request, Response } from 'express';
import { StockMovementRepository } from '../repositories/prisma/StockMovementRepository';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

const stockMovementRepository = new StockMovementRepository();

export class StockMovementController {
  getAllMovements = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, type, inventoryId, warehouseId, startDate, endDate } = req.query;
      const filters = {
        type,
        inventoryId,
        warehouseId,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const result = await stockMovementRepository.getAll(filters, {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Stock movements retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllMovements: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching stock movements', error: (error as Error).message });
    }
  };

  getMovementById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Movement ID is required' });
        return;
      }

      const movement = await stockMovementRepository.findById(id);
      if (!movement) {
        res.status(404).json({ success: false, message: 'Stock movement not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { movement },
        message: 'Stock movement retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getMovementById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching stock movement', error: (error as Error).message });
    }
  };

  createMovement = async (req: Request, res: Response): Promise<void> => {
    try {
      // NOTE: In a real application, creating a stock movement should also update the inventory levels.
      // This logic should ideally be in a service transaction.
      // For this CRUD implementation, we just create the record.
      const movement = await stockMovementRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { movement },
        message: 'Stock movement created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createMovement: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating stock movement', error: (error as Error).message });
    }
  };
}
