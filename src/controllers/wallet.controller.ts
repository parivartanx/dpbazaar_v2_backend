// src/controllers/WalletController.ts
import { Request, Response } from 'express';
import { WalletRepository } from '../repositories/prisma/WalletRepository';
import { WalletTransactionRepository } from '../repositories/prisma/WalletTransactionRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { prisma } from '../config/prismaClient';

const walletRepo = new WalletRepository();
const walletTransactionRepo = new WalletTransactionRepository();

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

  getCustomerWalletTransactions = async (req: Request, res: Response): Promise<void> => {
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

      const { page, limit } = req.query;
      const transactions = await walletTransactionRepo.list({
        customerId,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      res.status(200).json({
        success: true,
        message: 'Customer wallet transactions fetched successfully',
        data: { transactions },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer wallet transactions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer wallet transactions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  transferBetweenWallets = async (req: Request, res: Response): Promise<void> => {
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

      const { fromWalletType, toWalletType, amount, description } = req.body;

      if (!fromWalletType || !toWalletType || !amount) {
        res.status(400).json({
          success: false,
          message: 'fromWalletType, toWalletType, and amount are required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Only allow transfers from WITHDRAWABLE to SHOPPING
      if (fromWalletType !== 'WITHDRAWABLE' || toWalletType !== 'SHOPPING') {
        res.status(400).json({
          success: false,
          message: 'Only transfers from WITHDRAWABLE to SHOPPING wallets are allowed',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get both wallets
      const fromWallet = await walletRepo.findByCustomerIdAndType(customerId, fromWalletType as any);
      const toWallet = await walletRepo.findByCustomerIdAndType(customerId, toWalletType as any);

      if (!fromWallet) {
        res.status(404).json({
          success: false,
          message: `Source wallet of type ${fromWalletType} not found`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!toWallet) {
        res.status(404).json({
          success: false,
          message: `Destination wallet of type ${toWalletType} not found`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if source wallet has sufficient balance
      if (Number(fromWallet.balance) < Number(amount)) {
        res.status(400).json({
          success: false,
          message: 'Insufficient balance in source wallet',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Perform the transfer in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct from source wallet
        const updatedFromWallet = await tx.wallet.update({
          where: { id: fromWallet.id },
          data: {
            balance: {
              decrement: Number(amount)
            }
          }
        });

        // Add to destination wallet
        const updatedToWallet = await tx.wallet.update({
          where: { id: toWallet.id },
          data: {
            balance: {
              increment: Number(amount)
            }
          }
        });

        // Create transaction records for both wallets
        const fromTransaction = await tx.walletTransaction.create({
          data: {
            walletId: fromWallet.id,
            customerId,
            type: 'DEBIT',
            amount: Number(amount),
            reason: 'TRANSFER',
            status: 'SUCCESS',
            balanceBefore: Number(fromWallet.balance),
            balanceAfter: Number(updatedFromWallet.balance),
            metadata: {
              description: description || `Transfer to ${toWalletType} wallet`,
              toWalletType,
              fromWalletType,
            },
          }
        });

        const toTransaction = await tx.walletTransaction.create({
          data: {
            walletId: toWallet.id,
            customerId,
            type: 'CREDIT',
            amount: Number(amount),
            reason: 'TRANSFER',
            status: 'SUCCESS',
            balanceBefore: Number(toWallet.balance),
            balanceAfter: Number(updatedToWallet.balance),
            metadata: {
              description: description || `Transfer from ${fromWalletType} wallet`,
              toWalletType,
              fromWalletType,
            },
          }
        });

        return {
          fromWallet: updatedFromWallet,
          toWallet: updatedToWallet,
          fromTransaction,
          toTransaction
        };
      });

      res.status(200).json({
        success: true,
        message: 'Transfer completed successfully',
        data: {
          fromWallet: result.fromWallet,
          toWallet: result.toWallet,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error transferring between wallets: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to transfer between wallets',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  withdrawFromWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId; // Assuming user ID is attached by authentication middleware
      if (!customerId) {
        res.status(401).json({
          success: false,
          message: 'Customer authentication required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { walletType, amount, accountNumber, ifscCode, accountHolderName, upiId, bankName, description } = req.body;

      if (!walletType || !amount || (!accountNumber && !upiId)) {
        res.status(400).json({
          success: false,
          message: 'walletType, amount, and either accountNumber/IFSC or UPI ID are required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Only allow withdrawals from WITHDRAWABLE wallet
      if (walletType !== 'WITHDRAWABLE') {
        res.status(400).json({
          success: false,
          message: 'Only WITHDRAWABLE wallets support withdrawals',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Get the wallet
      const wallet = await walletRepo.findByCustomerIdAndType(customerId, walletType as any);

      if (!wallet) {
        res.status(404).json({
          success: false,
          message: `Wallet of type ${walletType} not found`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if wallet has sufficient balance
      if (Number(wallet.balance) < Number(amount)) {
        res.status(400).json({
          success: false,
          message: 'Insufficient balance in wallet',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Perform the withdrawal in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Deduct from wallet
        const updatedWallet = await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: {
              decrement: Number(amount)
            }
          }
        });

        // Create transaction record
        const transaction = await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            customerId,
            type: 'DEBIT',
            amount: Number(amount),
            reason: 'WITHDRAWAL',
            status: 'PENDING', // Initially set to PENDING until payment gateway confirms
            balanceBefore: Number(wallet.balance),
            balanceAfter: Number(updatedWallet.balance),
            metadata: {
              description: description || 'Wallet withdrawal',
              accountDetails: {
                accountNumber: accountNumber ? '****' + accountNumber.slice(-4) : null, // Only store last 4 digits
                ifscCode: ifscCode || null,
                accountHolderName: accountHolderName || null,
                upiId: upiId || null,
                bankName: bankName || null,
              },
            },
          }
        });

        return {
          wallet: updatedWallet,
          transaction
        };
      });

      // Here you would integrate with a payment gateway (like Razorpay, Stripe, etc.)
      // to actually transfer the money to the customer's account/UPId
      // For now, this is a placeholder for the actual payment gateway integration
      
      // Example of what would happen next:
      // 1. Call payment gateway API to initiate transfer
      // 2. Update transaction status based on gateway response
      // 3. Handle success/error scenarios
      
      // For now, returning the initiated withdrawal
      res.status(200).json({
        success: true,
        message: 'Withdrawal initiated successfully. Processing through payment gateway.',
        data: {
          wallet: result.wallet,
          transaction: result.transaction
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error withdrawing from wallet: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to withdraw from wallet',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}