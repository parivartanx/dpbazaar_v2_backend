import { Request, Response } from 'express';
import { AuditLogRepository } from '../repositories/prisma/AuditLogRepository';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

const auditLogRepository = new AuditLogRepository();

export class AuditLogController {
  getAllLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, userId, action, entityType, entityId, startDate, endDate } = req.query;
      const filters = {
        userId,
        action,
        entityType,
        entityId,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const result = await auditLogRepository.getAll(filters, {
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Audit logs retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllLogs: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching audit logs', error: (error as Error).message });
    }
  };

  getLogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Log ID is required' });
        return;
      }

      const log = await auditLogRepository.findById(id);
      if (!log) {
        res.status(404).json({ success: false, message: 'Audit log not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { log },
        message: 'Audit log retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getLogById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching audit log', error: (error as Error).message });
    }
  };

  getLogsByEntity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { entityType, entityId } = req.params;
      if (!entityType || !entityId) {
        res.status(400).json({ success: false, message: 'Entity Type and Entity ID are required' });
        return;
      }

      const logs = await auditLogRepository.findByEntity(entityType, entityId);
      const response: ApiResponse = {
        success: true,
        data: { logs },
        message: 'Entity audit logs retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getLogsByEntity: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching entity audit logs', error: (error as Error).message });
    }
  };
}
