// src/controllers/ReferralHistoryController.ts
import { Request, Response } from 'express';
import { ReferralHistoryRepository } from '../repositories/prisma/ReferralHistoryRepository';
import { ReferralCodeRepository } from '../repositories/prisma/ReferralCodeRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { getCustomerIdFromUserId } from '../utils/customerHelper';

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string };
}

const referralHistoryRepo = new ReferralHistoryRepository();
const referralCodeRepo = new ReferralCodeRepository();

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

  getCustomerReferralHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Customer authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
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

  getReferredUserHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const referralHistory = await referralHistoryRepo.findByReferredUserId(customerId);
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

  // Use a referral code
  useReferralCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Customer authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const { code } = req.body;
      if (!code) {
        res.status(400).json({
          success: false,
          message: 'Referral code is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Find the referral code using ReferralCodeRepository
      const referralCode = await referralCodeRepo.findByCode(code);
      if (!referralCode || !referralCode.isActive) {
        res.status(404).json({
          success: false,
          message: 'Invalid or inactive referral code',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if this customer is the same as the referrer
      if (referralCode.customerId === customerId) {
        res.status(400).json({
          success: false,
          message: 'Cannot use your own referral code',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if this customer has already used a referral code
      const existingReferral = await referralHistoryRepo.findByReferredUserId(customerId);
      if (existingReferral) {
        res.status(400).json({
          success: false,
          message: 'Customer has already used a referral code',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Create referral history record with all required fields
      const referralHistory = await referralHistoryRepo.create({
        referralCodeId: referralCode.id,
        referrerId: referralCode.customerId, // The person who created the code
        referredUserId: customerId, // The person using the code
        referrerSubscriptionId: '', // Will be set when user subscribes
        triggeredCardId: '', // Will be set when user subscribes
        status: 'PENDING', // Initially pending
        rewardAmount: null, // Will be set when qualified
        rewardedAt: null, // Will be set when rewarded
        expiredAt: null, // Will be set when expired
      });

      res.status(200).json({
        success: true,
        message: 'Referral code applied successfully',
        data: { referralHistory },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error applying referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to apply referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}