import { Request, Response } from 'express';
import { RefundRepository } from '../repositories/prisma/RefundRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

const refundRepository = new RefundRepository();

export class RefundController {
  createRefund = async (req: Request, res: Response): Promise<void> => {
    try {
      const refund = await refundRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { refund },
        message: 'Refund created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createRefund: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating refund', error: (error as Error).message });
    }
  };

  getAllRefunds = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, paymentId } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        paymentId: paymentId as string,
      };

      const refunds = await refundRepository.findAll(filters);
      const total = await refundRepository.count(filters);

      const response: ApiResponse = {
        success: true,
        data: { refunds, total, page: filters.page, limit: filters.limit },
        message: 'Refunds retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllRefunds: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving refunds', error: (error as Error).message });
    }
  };

  getRefundById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Refund ID is required' });
         return;
      }
      const refund = await refundRepository.findById(id);

      if (!refund) {
        res.status(404).json({ success: false, message: 'Refund not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { refund },
        message: 'Refund retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getRefundById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving refund', error: (error as Error).message });
    }
  };

  updateRefund = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Refund ID is required' });
         return;
      }
      const refund = await refundRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { refund },
        message: 'Refund updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateRefund: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating refund', error: (error as Error).message });
    }
  };
}
