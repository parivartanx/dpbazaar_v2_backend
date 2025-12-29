import { Request, Response } from 'express';
import { PriceHistoryRepository } from '../repositories/prisma/PriceHistoryRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

const priceHistoryRepository = new PriceHistoryRepository();

export class PriceHistoryController {
  getAllPriceHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, productId } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        productId: productId as string,
      };

      const history = await priceHistoryRepository.findAll(filters);
      const total = await priceHistoryRepository.count(filters);

      const response: ApiResponse = {
        success: true,
        data: { history, total, page: filters.page, limit: filters.limit },
        message: 'Price history retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllPriceHistory: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving price history', error: (error as Error).message });
    }
  };

  getPriceHistoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'History ID is required' });
         return;
      }
      const history = await priceHistoryRepository.findById(id);

      if (!history) {
        res.status(404).json({ success: false, message: 'Price history not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { history },
        message: 'Price history retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getPriceHistoryById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving price history', error: (error as Error).message });
    }
  };
}
