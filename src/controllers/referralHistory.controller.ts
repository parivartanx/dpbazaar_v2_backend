// src/controllers/ReferralHistoryController.ts
import { Request, Response } from 'express';
import { ReferralHistoryRepository } from '../repositories/prisma/ReferralHistoryRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const referralHistoryRepo = new ReferralHistoryRepository();

export class ReferralHistoryController {
  /** ----------------- ADMIN END ----------------- */

  listReferralHistories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, referrerId, referredUserId, status } = req.query;
      const referralHistories = await referralHistoryRepo.list({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        referrerId: referrerId as string,
        referredUserId: referredUserId as string,
        status: status as any,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Referral histories fetched successfully',
        data: { referralHistories },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing referral histories: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referral histories',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getReferralHistory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral history ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralHistory = await referralHistoryRepo.findById(id);
      if (!referralHistory) {
        res.status(404).json({
          success: false,
          message: 'Referral history not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Referral history fetched successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching referral history: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referral history',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createReferralHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const referralHistory = await referralHistoryRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Referral history created successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating referral history: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create referral history',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateReferralHistory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral history ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralHistory = await referralHistoryRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Referral history updated successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating referral history: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update referral history',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteReferralHistory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral history ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralHistory = await referralHistoryRepo.delete(id);
      res.status(200).json({
        success: true,
        message: 'Referral history deleted successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting referral history: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete referral history',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getCustomerReferralHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = req.params.customerId as string;
      if (!customerId) {
        res.status(400).json({
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const referralHistories = await referralHistoryRepo.list({
        referrerId: customerId,
      });

      res.status(200).json({
        success: true,
        message: 'Customer referral histories fetched successfully',
        data: { referralHistories },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer referral histories: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer referral histories',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getReferredUserHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const referralHistory = await referralHistoryRepo.findByReferredUserId(userId);
      if (!referralHistory) {
        res.status(404).json({
          success: false,
          message: 'Referral history not found for this user',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Referred user history fetched successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching referred user history: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referred user history',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}