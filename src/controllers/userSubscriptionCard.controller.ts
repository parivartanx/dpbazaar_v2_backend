// src/controllers/UserSubscriptionCardController.ts
import { Request, Response } from 'express';
import { UserSubscriptionCardRepository } from '../repositories/prisma/UserSubscriptionCardRepository';
import { ReferralCodeRepository } from '../repositories/prisma/ReferralCodeRepository';
import { SubscriptionCardRepository } from '../repositories/prisma/SubscriptionCardRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { ReferralStatus, TransactionType, TransactionReason, TransactionStatus, CardSubscriptionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentService } from '../services/payment.service';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';
import { prisma } from '../config/prismaClient';

const userSubscriptionCardRepo = new UserSubscriptionCardRepository();
const referralCodeRepo = new ReferralCodeRepository();
const subscriptionCardRepo = new SubscriptionCardRepository();



export class UserSubscriptionCardController {
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });
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
      // Transform image keys to public URLs in the user card response
      const transformedUserCard = await this.imageUrlTransformer.transformCommonImageFields(userCard);
      
      res.status(200).json({
        success: true,
        message: 'User subscription card fetched successfully',
        data: { userCard: transformedUserCard },
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
      // Transform image keys to public URLs in the user card response
      const transformedUserCard = await this.imageUrlTransformer.transformCommonImageFields(userCard);
      
      res.status(201).json({
        success: true,
        message: 'User subscription card created successfully',
        data: { userCard: transformedUserCard },
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
      // Transform image keys to public URLs in the user card response
      const transformedUserCard = await this.imageUrlTransformer.transformCommonImageFields(userCard);
      
      res.status(200).json({
        success: true,
        message: 'User subscription card updated successfully',
        data: { userCard: transformedUserCard },
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

  /**
   * Purchase subscription card with optional referral code
   */
  purchaseSubscriptionCard = async (req: Request, res: Response): Promise<void> => {
    const customerId = (req as any).user?.userId || (req as any).user?.id;
    
    if (!customerId) {
      res.status(401).json({
        success: false,
        message: 'Customer ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    const { cardId, referralCode, paymentMethod, paymentDetails } = req.body;
    
    if (!cardId) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    try {
      // Get the subscription card details
      const subscriptionCard = await subscriptionCardRepo.findById(cardId);
      if (!subscriptionCard) {
        res.status(404).json({
          success: false,
          message: 'Subscription card not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      // Validate that the card is available for purchase
      if (subscriptionCard.status !== 'ACTIVE' || subscriptionCard.visibility !== 'PUBLIC') {
        res.status(400).json({
          success: false,
          message: 'Subscription card is not available for purchase',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      // Check if customer already has an active subscription card
      const existingActiveCard = await userSubscriptionCardRepo.findByCustomerIdAndStatus(
        customerId, 
        'ACTIVE' as CardSubscriptionStatus
      );
      
      if (existingActiveCard) {
        res.status(400).json({
          success: false,
          message: 'Customer already has an active subscription card',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      // Process referral code if provided
      let referralCodeId: string | null = null;
      let referrerCustomerId: string | null = null;
      let referralRewardAmount = 0;
      
      if (referralCode) {
        // Find the referral code
        const referral = await referralCodeRepo.findByCode(referralCode);
        if (!referral || !referral.isActive) {
          res.status(400).json({
            success: false,
            message: 'Invalid or inactive referral code',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        // Ensure customer is not using their own referral code
        if (referral.customerId === customerId) {
          res.status(400).json({
            success: false,
            message: 'Cannot use your own referral code',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        referralCodeId = referral.id;
        referrerCustomerId = referral.customerId;
        
        // Calculate referral reward if available
        if (subscriptionCard.referralRewardPercent) {
          referralRewardAmount = Number(subscriptionCard.price) * Number(subscriptionCard.referralRewardPercent) / 100;
        } else if (subscriptionCard.referralRewardAmount) {
          referralRewardAmount = Number(subscriptionCard.referralRewardAmount);
        }
      }
      
      // Process payment if payment method is provided
      if (!paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Payment method is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }
            
      // Process payment directly without creating an order
      const paymentService = new PaymentService();
            
      // Create a temporary order ID for payment tracking (we'll use the subscription card ID as a reference)
      const tempOrderId = `SUBS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
      const paymentRequest = {
        orderId: tempOrderId, // Use temporary order ID for payment tracking
        amount: Number(subscriptionCard.price),
        paymentMethod: paymentMethod,
        customerId: customerId,
        ...(paymentDetails || {})
      };
            
      // Process the payment
      const paymentResult = await paymentService.processPayment(paymentRequest);
      
      // Start transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Create the user subscription card
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + subscriptionCard.validityDays);
        
        const userSubscriptionCard = await tx.userSubscriptionCard.create({
          data: {
            customerId,
            cardId,
            referralCodeId,
            status: 'ACTIVE' as CardSubscriptionStatus,
            startDate,
            endDate,
            purchasedAt: new Date(),
            activatedAt: new Date(),
            expiredAt: endDate,
            currentAmount: 0,
          },
          include: {
            customer: true,
            card: true
          }
        });
        
        // Process referral reward if applicable
        if (referralCodeId && referrerCustomerId && referralRewardAmount > 0) {
          // Create referral history record
          const referralHistory = await tx.referralHistory.create({
            data: {
              referralCodeId,
              referrerId: referrerCustomerId,
              referredUserId: customerId,
              referrerSubscriptionId: userSubscriptionCard.id, // This will be the new subscription ID
              triggeredCardId: cardId,
              status: 'PENDING' as ReferralStatus,
              rewardAmount: new Decimal(referralRewardAmount),
              createdAt: new Date(),
            },
            include: {
              referrer: true,
              referredUser: true
            }
          });
          
          // Update the referrer's wallet with the referral reward
          const referrerWallet = await tx.wallet.findFirst({
            where: {
              customerId: referrerCustomerId,
              type: 'SHOPPING'
            }
          });
          
          if (referrerWallet) {
            const newBalance = Number(referrerWallet.balance) + referralRewardAmount;
            
            // Update wallet balance
            await tx.wallet.update({
              where: { id: referrerWallet.id },
              data: { balance: new Decimal(newBalance) }
            });
            
            // Create wallet transaction for referral reward
            await tx.walletTransaction.create({
              data: {
                walletId: referrerWallet.id,
                customerId: referrerCustomerId,
                type: 'CREDIT' as TransactionType,
                reason: 'REFERRAL_REWARD' as TransactionReason,
                status: 'SUCCESS' as TransactionStatus,
                amount: new Decimal(referralRewardAmount),
                balanceBefore: referrerWallet.balance,
                balanceAfter: new Decimal(newBalance),
                referralId: referralHistory.id,
                createdAt: new Date(),
              }
            });
            
            // Update referral history status to completed
            await tx.referralHistory.update({
              where: { id: referralHistory.id },
              data: {
                status: 'COMPLETED' as ReferralStatus,
                rewardedAt: new Date(),
              }
            });
          }
        }
        
        return userSubscriptionCard;
      });
      
      // Transform image keys to public URLs in the user subscription card response
      const transformedResult = await this.imageUrlTransformer.transformCommonImageFields(result);
      
      res.status(201).json({
        success: true,
        message: 'Subscription card purchased successfully',
        data: { 
          userSubscriptionCard: transformedResult,
          payment: {
            id: paymentResult.paymentId,
            status: paymentResult.paymentStatus,
            orderId: paymentResult.orderId
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error purchasing subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to purchase subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getCustomerCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId || (req as any).user?.id;
      
      if (!customerId) {
        res.status(401).json({
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const userCards = await userSubscriptionCardRepo.list({
        customerId,
      });

      // Transform image keys to public URLs in the user cards response
      const transformedUserCards = await this.imageUrlTransformer.transformCommonImageFields(userCards);
      
      res.status(200).json({
        success: true,
        message: 'Customer subscription cards fetched successfully',
        data: { userCards: transformedUserCards },
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

  getCustomerCardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId || (req as any).user?.id;
      const cardId = req.params.id as string;
      
      if (!customerId) {
        res.status(401).json({
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      if (!cardId) {
        res.status(400).json({
          success: false,
          message: 'Card ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Fetch the specific user subscription card by ID
      const userCard = await userSubscriptionCardRepo.findById(cardId);
      
      if (!userCard) {
        res.status(404).json({
          success: false,
          message: 'Subscription card not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      // Ensure the card belongs to the authenticated customer
      if (userCard.customerId !== customerId) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Card does not belong to customer',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Transform image keys to public URLs in the user card response
      const transformedUserCard = await this.imageUrlTransformer.transformCommonImageFields(userCard);
      
      res.status(200).json({
        success: true,
        message: 'Customer subscription card fetched successfully',
        data: { userCard: transformedUserCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching customer subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}