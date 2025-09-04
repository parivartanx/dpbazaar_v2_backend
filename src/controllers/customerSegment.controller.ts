import { Request, Response } from 'express';
import { CustomerSegmentRepository } from '../repositories/prisma/CustomerSegmentRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const segmentRepo = new CustomerSegmentRepository();

export class CustomerSegmentController {
  listByCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = req.params;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const segments = await segmentRepo.listByCustomer(customerId);
      const response: ApiResponse = {
        success: true,
        message: 'Segments fetched successfully',
        data: { segments },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing segments: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch segments',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createSegment = async (req: Request, res: Response): Promise<void> => {
    try {
      const segment = await segmentRepo.create(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Segment created successfully',
        data: { segment },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating segment: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create segment',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateSegment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Segment ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const segment = await segmentRepo.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Segment updated successfully',
        data: { segment },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating segment: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update segment',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteSegment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Segment ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      await segmentRepo.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Segment deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting segment: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete segment',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
