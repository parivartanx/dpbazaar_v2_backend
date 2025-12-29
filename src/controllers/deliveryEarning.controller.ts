import { Request, Response } from 'express';
import { DeliveryEarningRepository } from '../repositories/prisma/DeliveryEarningRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

const deliveryEarningRepository = new DeliveryEarningRepository();

export class DeliveryEarningController {
  createEarning = async (req: Request, res: Response): Promise<void> => {
    try {
      const earning = await deliveryEarningRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { earning },
        message: 'Delivery earning created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createEarning: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating delivery earning', error: (error as Error).message });
    }
  };

  getAllEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, agentId, status, type } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        agentId: agentId as string,
        status: status as string,
        type: type as string,
      };

      const earnings = await deliveryEarningRepository.findAll(filters);
      const total = await deliveryEarningRepository.count(filters);

      const response: ApiResponse = {
        success: true,
        data: { earnings, total, page: filters.page, limit: filters.limit },
        message: 'Delivery earnings retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllEarnings: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving delivery earnings', error: (error as Error).message });
    }
  };

  getEarningById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Earning ID is required' });
         return;
      }
      const earning = await deliveryEarningRepository.findById(id);

      if (!earning) {
        res.status(404).json({ success: false, message: 'Delivery earning not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { earning },
        message: 'Delivery earning retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getEarningById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving delivery earning', error: (error as Error).message });
    }
  };

  updateEarning = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Earning ID is required' });
         return;
      }
      const earning = await deliveryEarningRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { earning },
        message: 'Delivery earning updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateEarning: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating delivery earning', error: (error as Error).message });
    }
  };

  deleteEarning = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Earning ID is required' });
         return;
      }
      await deliveryEarningRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Delivery earning deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteEarning: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting delivery earning', error: (error as Error).message });
    }
  };
}
