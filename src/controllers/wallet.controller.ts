// src/controllers/WalletController.ts
import { Request, Response } from 'express';
import { WalletRepository } from '../repositories/prisma/WalletRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const walletRepo = new WalletRepository();

export class WalletController {
  /** ----------------- ADMIN END ----------------- */

  listWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, customerId, type } = req.query;
      const wallets = await walletRepo.list({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        customerId: customerId as string,
        type: type as any,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Wallets fetched successfully',
        data: { wallets },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing wallets: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallets',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getWallet = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Wallet ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const wallet = await walletRepo.findById(id);
      if (!wallet) {
        res.status(404).json({
          success: false,
          message: 'Wallet not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Wallet fetched successfully',
        data: { wallet },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching wallet: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallet',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const wallet = await walletRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Wallet created successfully',
        data: { wallet },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating wallet: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create wallet',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateWallet = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Wallet ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const wallet = await walletRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Wallet updated successfully',
        data: { wallet },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating wallet: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update wallet',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteWallet = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Wallet ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const wallet = await walletRepo.delete(id);
      res.status(200).json({
        success: true,
        message: 'Wallet deleted successfully',
        data: { wallet },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting wallet: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete wallet',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getCustomerWallets = async (req: Request, res: Response): Promise<void> => {
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

      const wallets = await walletRepo.list({
        customerId,
      });

      res.status(200).json({
        success: true,
        message: 'Customer wallets fetched successfully',
        data: { wallets },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer wallets: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer wallets',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}