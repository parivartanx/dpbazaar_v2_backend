import { Request, Response } from 'express';
import { VendorPayoutRepository } from '../repositories/prisma/VendorPayoutRepository';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

const vendorPayoutRepository = new VendorPayoutRepository();

export class VendorPayoutController {
  getAllPayouts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, vendorId, startDate, endDate } = req.query;
      const filters = {
        status,
        vendorId,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };
      
      const result = await vendorPayoutRepository.getAll(filters, {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Vendor payouts retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllPayouts: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching vendor payouts', error: (error as Error).message });
    }
  };

  getPayoutById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Payout ID is required' });
        return;
      }
      
      const payout = await vendorPayoutRepository.findById(id);
      if (!payout) {
        res.status(404).json({ success: false, message: 'Vendor payout not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { payout },
        message: 'Vendor payout retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getPayoutById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching vendor payout', error: (error as Error).message });
    }
  };

  createPayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const payout = await vendorPayoutRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { payout },
        message: 'Vendor payout created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createPayout: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating vendor payout', error: (error as Error).message });
    }
  };

  updatePayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Payout ID is required' });
        return;
      }

      const payout = await vendorPayoutRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { payout },
        message: 'Vendor payout updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updatePayout: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating vendor payout', error: (error as Error).message });
    }
  };

  deletePayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Payout ID is required' });
        return;
      }

      const payout = await vendorPayoutRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        data: { payout },
        message: 'Vendor payout deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deletePayout: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting vendor payout', error: (error as Error).message });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!id) {
        res.status(400).json({ success: false, message: 'Payout ID is required' });
        return;
      }

      const payout = await vendorPayoutRepository.update(id, { status });
      const response: ApiResponse = {
        success: true,
        data: { payout },
        message: 'Vendor payout status updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateStatus: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating vendor payout status', error: (error as Error).message });
    }
  };
}
