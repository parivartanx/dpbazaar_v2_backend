import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { DeliveryRepository } from '../repositories/prisma/DeliveryRepository';

const deliveryRepository = new DeliveryRepository();

export class DeliveryController {
  getAllDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters: any = { ...req.query };
      if (filters.page) filters.page = Number(filters.page);
      if (filters.limit) filters.limit = Number(filters.limit);

      const deliveries = await deliveryRepository.getAll(filters);
      
      const response: ApiResponse = {
        success: true,
        data: { deliveries },
        message: 'Deliveries retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllDeliveries: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching deliveries', error: (error as Error).message });
    }
  };

  getDeliveryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery ID is required' });
         return;
      }

      const delivery = await deliveryRepository.getById(id);
      if (!delivery) {
        res.status(404).json({ success: false, message: 'Delivery record not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { delivery },
        message: 'Delivery retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDeliveryById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching delivery', error: (error as Error).message });
    }
  };

  createDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId } = req.body;
      
      // Check existing
      const existing = await deliveryRepository.findByOrderId(orderId);
      if (existing) {
        res.status(400).json({ success: false, message: 'Delivery record already exists for this order' });
        return;
      }

      const delivery = await deliveryRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { delivery },
        message: 'Delivery created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error: any) {
      logger.error(`Error in createDelivery: ${error}`);
      if (error.code === 'P2002') {
         const target = error.meta?.target;
         res.status(400).json({ success: false, message: `Unique constraint violation on field(s): ${target}` });
         return;
      }
      res.status(500).json({ success: false, message: 'Problem in creating delivery', error: error.message });
    }
  };

  updateDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery ID is required' });
         return;
      }

      const delivery = await deliveryRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { delivery },
        message: 'Delivery updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateDelivery: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating delivery', error: (error as Error).message });
    }
  };

  deleteDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Delivery ID is required' });
         return;
      }

      await deliveryRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Delivery deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteDelivery: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting delivery', error: (error as Error).message });
    }
  };
}
