// src/controllers/UserSubscriptionCardController.ts
import { Request, Response } from 'express';
import { UserSubscriptionCardRepository } from '../repositories/prisma/UserSubscriptionCardRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const userSubscriptionCardRepo = new UserSubscriptionCardRepository();

export class UserSubscriptionCardController {
  /** ----------------- ADMIN END ----------------- */

  listUserCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, customerId, status } = req.query;
      const userCards = await userSubscriptionCardRepo.list({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        customerId: customerId as string,
        status: status as any,
      });

      const response: ApiResponse = {
        success: true,
        message: 'User subscription cards fetched successfully',
        data: { userCards },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing user subscription cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user subscription cards',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getUserCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User subscription card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const userCard = await userSubscriptionCardRepo.findById(id);
      if (!userCard) {
        res.status(404).json({
          success: false,
          message: 'User subscription card not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'User subscription card fetched successfully',
        data: { userCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching user subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createUserCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userCard = await userSubscriptionCardRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'User subscription card created successfully',
        data: { userCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating user subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create user subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateUserCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User subscription card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const userCard = await userSubscriptionCardRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'User subscription card updated successfully',
        data: { userCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating user subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update user subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteUserCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'User subscription card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const userCard = await userSubscriptionCardRepo.delete(id);
      res.status(200).json({
        success: true,
        message: 'User subscription card deleted successfully',
        data: { userCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting user subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getCustomerCards = async (req: Request, res: Response): Promise<void> => {
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

      const userCards = await userSubscriptionCardRepo.list({
        customerId,
      });

      res.status(200).json({
        success: true,
        message: 'Customer subscription cards fetched successfully',
        data: { userCards },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer subscription cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer subscription cards',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}