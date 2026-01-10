import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { EmailTemplateRepository } from '../repositories/prisma/EmailTemplateRepository';

const emailTemplateRepository = new EmailTemplateRepository();

export class EmailTemplateController {
  getAllTemplates = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, isActive, search } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const filters: any = {
        page: pageNum,
        limit: limitNum,
        isActive: isActive !== undefined ? (isActive === 'true') : undefined,
        search: search as string,
      };

      const templates = await emailTemplateRepository.getAll(filters);
      const totalCount = await emailTemplateRepository.countFiltered({
        isActive: filters.isActive,
        search: search as string,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          templates,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        message: 'Email templates retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllTemplates: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in fetching email templates',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getTemplateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Template ID is required' });
         return;
      }

      const template = await emailTemplateRepository.getById(id);
      if (!template) {
        res.status(404).json({ success: false, message: 'Email template not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { template },
        message: 'Email template retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getTemplateById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching email template', error: (error as Error).message });
    }
  };

  createTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const template = await emailTemplateRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { template },
        message: 'Email template created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createTemplate: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating email template', error: (error as Error).message });
    }
  };

  updateTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Template ID is required' });
         return;
      }

      const template = await emailTemplateRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { template },
        message: 'Email template updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateTemplate: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating email template', error: (error as Error).message });
    }
  };

  deleteTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Template ID is required' });
         return;
      }

      await emailTemplateRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Email template deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteTemplate: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting email template', error: (error as Error).message });
    }
  };
}
