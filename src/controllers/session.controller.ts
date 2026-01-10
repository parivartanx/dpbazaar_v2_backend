import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { SessionRepository } from '../repositories/prisma/SessionRepository';

const sessionRepo = new SessionRepository();

export class SessionController {
  listSessions = async (req: Request, res: Response): Promise<void> => {
    const { userId, page, limit } = req.query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    try {
      const sessions = await sessionRepo.getAll({
        userId: userId as string,
        page: pageNum,
        limit: limitNum,
      });
      const totalCount = await sessionRepo.countFiltered({
        userId: userId as string,
      });
      const response: ApiResponse = {
        success: true,
        message: 'Sessions retrieved successfully',
        data: {
          sessions,
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
      logger.error(`Error fetching sessions: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem fetching sessions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getSession = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Session ID required',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const session = await sessionRepo.getById(id);
      if (!session) {
        res.status(404).json({
          success: false,
          message: 'Session not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Session found',
        data: { session },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error fetching session: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Problem fetching session',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteSession = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Session ID required',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const session = await sessionRepo.deleteById(id);
      res.status(200).json({
        success: true,
        message: 'Session deleted successfully',
        data: { session },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting session: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Problem deleting session',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };

  deleteUserSessions = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'User ID required',
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const count = await sessionRepo.deleteByUserId(userId);
      res.status(200).json({
        success: true,
        message: `${count} sessions deleted`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error deleting user sessions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Problem deleting user sessions',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  };
}
