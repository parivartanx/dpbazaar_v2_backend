// src/controllers/CardController.ts
import { Request, Response } from 'express';
import { CardRepository } from '../repositories/prisma/CardRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const cardRepo = new CardRepository();

export class CardController {
  /** ----------------- ADMIN END ----------------- */

  listCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, search, status, visibility } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const cards = await cardRepo.list({
        page: pageNum,
        limit: limitNum,
        search: search as string,
        status: status as string,
        visibility: visibility as string,
      });

      const totalCount = await cardRepo.countFiltered({
        search: search as string,
        status: status as string,
        visibility: visibility as string,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Cards fetched successfully',
        data: {
          cards,
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
      logger.error(`Error listing cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch cards',
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
      const card = await cardRepo.findById(id);
      if (!card) {
        res.status(404).json({
          success: false,
          message: 'Card not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Card fetched successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  createCard = async (req: Request, res: Response): Promise<void> => {
    try {
      const card = await cardRepo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Card created successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error creating card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create card',
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
      const card = await cardRepo.update(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Card updated successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error updating card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update card',
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
      const card = await cardRepo.softDelete(id);
      res.status(200).json({
        success: true,
        message: 'Card deleted successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete card',
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
      const card = await cardRepo.restore(id);
      res.status(200).json({
        success: true,
        message: 'Card restored successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error restoring card: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to restore card',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  listVisibleCards = async (req: Request, res: Response): Promise<void> => {
    try {
      const cards = await cardRepo.list({
        page: 1,
        limit: 50,
        visibility: 'PUBLIC',
      });

      res.status(200).json({
        success: true,
        message: 'Cards available for customers',
        data: { cards },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error listing visible cards: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch visible cards',
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
      const card = await cardRepo.findById(id);
      if (!card || card.visibility !== 'PUBLIC') {
        res.status(404).json({
          success: false,
          message: 'Card not found or not available',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Card details fetched successfully',
        data: { card },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching card details: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch card details',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}
