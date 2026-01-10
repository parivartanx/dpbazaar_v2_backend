import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { NotificationRepository } from '../repositories/prisma/NotificationRepository';

const notificationRepository = new NotificationRepository();

export class NotificationController {
  getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, userId, type, isRead } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const filters: any = {
        page: pageNum,
        limit: limitNum,
        userId: userId as string,
        type: type as string,
        isRead: isRead !== undefined ? (isRead === 'true') : undefined,
      };

      const notifications = await notificationRepository.getAll(filters);
      const totalCount = await notificationRepository.countFiltered({
        userId: userId as string,
        type: type as string,
        isRead: filters.isRead,
      });
      
      const response: ApiResponse = {
        success: true,
        data: {
          notifications,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        message: 'Notifications retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllNotifications: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in fetching notifications',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getNotificationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Notification ID is required' });
         return;
      }

      const notification = await notificationRepository.getById(id);
      if (!notification) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { notification },
        message: 'Notification retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getNotificationById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching notification', error: (error as Error).message });
    }
  };

  createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const notification = await notificationRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { notification },
        message: 'Notification created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createNotification: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating notification', error: (error as Error).message });
    }
  };

  updateNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Notification ID is required' });
         return;
      }

      const notification = await notificationRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { notification },
        message: 'Notification updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateNotification: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating notification', error: (error as Error).message });
    }
  };

  deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Notification ID is required' });
         return;
      }

      await notificationRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Notification deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteNotification: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting notification', error: (error as Error).message });
    }
  };
}
