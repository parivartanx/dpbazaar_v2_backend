// src/controllers/SubscriptionCardController.ts
import { Request, Response } from 'express';
import { SubscriptionCardRepository } from '../repositories/prisma/SubscriptionCardRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

const subscriptionCardRepo = new SubscriptionCardRepository();

export class SubscriptionCardController {
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });
  /** ----------------- ADMIN END ----------------- */

  listCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, search, status, visibility } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const cards = await subscriptionCardRepo.list({
        page: pageNum,
        limit: limitNum,
        search: search as string,
        status: status as any,
        visibility: visibility as any,
      });

      const totalCount = await subscriptionCardRepo.countFiltered({
        search: search as string,
        status: status as any,
        visibility: visibility as any,
      });

      // Transform image keys to public URLs in the cards response
      const transformedCards = await this.imageUrlTransformer.transformCommonImageFields(cards);
      
      const response: ApiResponse = {
        success: true,
        message: 'Subscription cards fetched successfully',
        data: {
          cards: transformedCards,
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
      logger.error(`Error listing subscription cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription cards',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const card = await subscriptionCardRepo.findById(id);
      if (!card) {
        res.status(404).json({
          success: false,
          message: 'Subscription card not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      // Transform image keys to public URLs in the card response
      const transformedCard = await this.imageUrlTransformer.transformCommonImageFields(card);
      
      res.status(200).json({
        success: true,
        message: 'Subscription card fetched successfully',
        data: { card: transformedCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const card = await subscriptionCardRepo.create(req.body);
      // Transform image keys to public URLs in the card response
      const transformedCard = await this.imageUrlTransformer.transformCommonImageFields(card);
      
      res.status(201).json({
        success: true,
        message: 'Subscription card created successfully',
        data: { card: transformedCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  updateCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const card = await subscriptionCardRepo.update(id, req.body);
      // Transform image keys to public URLs in the card response
      const transformedCard = await this.imageUrlTransformer.transformCommonImageFields(card);
      
      res.status(200).json({
        success: true,
        message: 'Subscription card updated successfully',
        data: { card: transformedCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const card = await subscriptionCardRepo.softDelete(id);
      res.status(200).json({
        success: true,
        message: 'Subscription card deleted successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  restoreCard = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const card = await subscriptionCardRepo.restore(id);
      // Transform image keys to public URLs in the card response
      const transformedCard = await this.imageUrlTransformer.transformCommonImageFields(card);
      
      res.status(200).json({
        success: true,
        message: 'Subscription card restored successfully',
        data: { card: transformedCard },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error restoring subscription card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to restore subscription card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  listVisibleCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const cards = await subscriptionCardRepo.list({
        page: 1,
        limit: 50,
        visibility: 'PUBLIC' as any,
      });

      res.status(200).json({
        success: true,
        message: 'Subscription cards available for customers',
        data: { cards },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error listing visible subscription cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch visible subscription cards',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  getCardDetails = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const card = await subscriptionCardRepo.findById(id);
      if (!card || (card.visibility as any) !== 'PUBLIC') {
        res.status(404).json({
          success: false,
          message: 'Subscription card not found or not available',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Subscription card details fetched successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching subscription card details: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch subscription card details',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}