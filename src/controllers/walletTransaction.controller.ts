// src/controllers/WalletTransactionController.ts
import { Request, Response } from 'express';
import { WalletTransactionRepository } from '../repositories/prisma/WalletTransactionRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const walletTransactionRepo = new WalletTransactionRepository();

export class WalletTransactionController {
  /** ----------------- ADMIN END ----------------- */

  listTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, walletId, customerId, type, reason, status } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const transactions = await walletTransactionRepo.list({
        page: pageNum,
        limit: limitNum,
        walletId: walletId as string,
        customerId: customerId as string,
        type: type as any,
        reason: reason as any,
        status: status as any,
      });

      const totalCount = await walletTransactionRepo.countFiltered({
        walletId: walletId as string,
        customerId: customerId as string,
        type: type as any,
        reason: reason as any,
        status: status as any,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Wallet transactions fetched successfully',
        data: {
          transactions,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing wallet transactions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallet transactions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getTransaction = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const transaction = await walletTransactionRepo.findById(id);
      if (!transaction) {
        res.status(404).json({
          success: false,
          message: 'Wallet transaction not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Wallet transaction fetched successfully',
        data: { transaction },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching wallet transaction: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallet transaction',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await walletTransactionRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Wallet transaction created successfully',
        data: { transaction },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating wallet transaction: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create wallet transaction',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateTransaction = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const transaction = await walletTransactionRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Wallet transaction updated successfully',
        data: { transaction },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating wallet transaction: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update wallet transaction',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const transaction = await walletTransactionRepo.delete(id);
      res.status(200).json({
        success: true,
        message: 'Wallet transaction deleted successfully',
        data: { transaction },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting wallet transaction: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete wallet transaction',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getWalletTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const walletId = req.params.walletId as string;
      if (!walletId) {
        res.status(400).json({
          success: false,
          message: 'Wallet ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const transactions = await walletTransactionRepo.list({
        walletId,
      });

      res.status(200).json({
        success: true,
        message: 'Wallet transactions fetched successfully',
        data: { transactions },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching wallet transactions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch wallet transactions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getCustomerTransactions = async (req: Request, res: Response): Promise<void> => {
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

      const transactions = await walletTransactionRepo.list({
        customerId,
      });

      res.status(200).json({
        success: true,
        message: 'Customer transactions fetched successfully',
        data: { transactions },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer transactions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer transactions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}