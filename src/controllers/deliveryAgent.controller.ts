import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { DeliveryAgentRepository } from '../repositories/prisma/DeliveryAgentRepository';

const deliveryAgentRepository = new DeliveryAgentRepository();

export class DeliveryAgentController {
  getAllDeliveryAgents = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = { ...req.query };
      if (filters.page) filters.page = Number(filters.page);
      if (filters.limit) filters.limit = Number(filters.limit);

      const agents = await deliveryAgentRepository.getAll(filters);
      
      const response: ApiResponse = {
        success: true,
        data: { agents },
        message: 'Delivery agents retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllDeliveryAgents: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching delivery agents', error: (error as Error).message });
    }
  };

  getDeliveryAgentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      const agent = await deliveryAgentRepository.getById(id);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Delivery agent not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { agent },
        message: 'Delivery agent retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDeliveryAgentById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching delivery agent', error: (error as Error).message });
    }
  };

  createDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check for duplicate agent code explicitly if needed, but DB will catch it.
      // Let's rely on DB constraint for atomicity.
      
      const agent = await deliveryAgentRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { agent },
        message: 'Delivery agent created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error: any) {
      logger.error(`Error in createDeliveryAgent: ${error}`);
      if (error.code === 'P2002') {
         const target = error.meta?.target;
         res.status(400).json({ success: false, message: `Unique constraint violation on field(s): ${target}` });
         return;
      }
      res.status(500).json({ success: false, message: 'Problem in creating delivery agent', error: error.message });
    }
  };

  updateDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      const agent = await deliveryAgentRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { agent },
        message: 'Delivery agent updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error: any) {
      logger.error(`Error in updateDeliveryAgent: ${error}`);
      if (error.code === 'P2002') {
         const target = error.meta?.target;
         res.status(400).json({ success: false, message: `Unique constraint violation on field(s): ${target}` });
         return;
      }
      res.status(500).json({ success: false, message: 'Problem in updating delivery agent', error: error.message });
    }
  };

  deleteDeliveryAgent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery Agent ID is required' });
         return;
      }

      await deliveryAgentRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Delivery agent deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteDeliveryAgent: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting delivery agent', error: (error as Error).message });
    }
  };
}
