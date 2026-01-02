// src/controllers/ReferralCodeController.ts
import { Request, Response } from 'express';
import { ReferralCodeRepository } from '../repositories/prisma/ReferralCodeRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string };
}

const referralCodeRepo = new ReferralCodeRepository();

export class ReferralCodeController {
  /** ----------------- ADMIN END ----------------- */

  listReferralCodes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, customerId, isActive } = req.query;
      
      const params: any = {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        customerId: customerId as string,
      };
      
      if (isActive !== undefined) {
        params.isActive = isActive === 'true';
      }
      
      const referralCodes = await referralCodeRepo.list(params);

      const response: ApiResponse = {
        success: true,
        message: 'Referral codes fetched successfully',
        data: { referralCodes },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing referral codes: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referral codes',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getReferralCode = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral code ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralCode = await referralCodeRepo.findById(id);
      if (!referralCode) {
        res.status(404).json({
          success: false,
          message: 'Referral code not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Referral code fetched successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getReferralCodeByCode = async (req: Request, res: Response): Promise<void> => {
    const code = req.params.code as string;
    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Referral code is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralCode = await referralCodeRepo.findByCode(code);
      if (!referralCode) {
        res.status(404).json({
          success: false,
          message: 'Referral code not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Referral code fetched successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createReferralCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const referralCode = await referralCodeRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Referral code created successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateReferralCode = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral code ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralCode = await referralCodeRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Referral code updated successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteReferralCode = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral code ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralCode = await referralCodeRepo.delete(id);
      res.status(200).json({
        success: true,
        message: 'Referral code deleted successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deactivateReferralCode = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Referral code ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const referralCode = await referralCodeRepo.deactivate(id);
      res.status(200).json({
        success: true,
        message: 'Referral code deactivated successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deactivating referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to deactivate referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  // Create a referral code for the authenticated customer
  createCustomerReferralCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        res.status(401).json({
          success: false,
          message: 'Customer authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if customer already has a referral code
      const existingReferralCode = await referralCodeRepo.findByCustomerId(customerId);
      if (existingReferralCode) {
        res.status(400).json({
          success: false,
          message: 'Customer already has a referral code',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Create a unique referral code
      const referralCode = `REF${customerId.substring(0, 8).toUpperCase()}`;

      // Create the referral code record
      const newReferralCode = await referralCodeRepo.create({
        code: referralCode,
        customerId: customerId,
        isActive: true,
        deactivatedAt: null,
      });

      res.status(201).json({
        success: true,
        message: 'Referral code created successfully',
        data: { referralCode: newReferralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating customer referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getCustomerReferralCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.userId;
      if (!customerId) {
        res.status(401).json({
          success: false,
          message: 'Customer authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const referralCode = await referralCodeRepo.findByCustomerId(customerId);
      if (!referralCode) {
        res.status(404).json({
          success: false,
          message: 'Referral code not found for this customer',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Customer referral code fetched successfully',
        data: { referralCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer referral code: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer referral code',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}