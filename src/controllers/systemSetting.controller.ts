import { Request, Response } from 'express';
import { SystemSettingRepository } from '../repositories/prisma/SystemSettingRepository';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

const systemSettingRepository = new SystemSettingRepository();

export class SystemSettingController {
  getAllSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const settings = await systemSettingRepository.getAll();
      const response: ApiResponse = {
        success: true,
        data: { settings },
        message: 'System settings retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllSettings: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching system settings', error: (error as Error).message });
    }
  };

  getSettingByKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      if (!key) {
        res.status(400).json({ success: false, message: 'Setting Key is required' });
        return;
      }

      const setting = await systemSettingRepository.findByKey(key);
      if (!setting) {
        res.status(404).json({ success: false, message: 'System setting not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { setting },
        message: 'System setting retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getSettingByKey: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching system setting', error: (error as Error).message });
    }
  };

  createSetting = async (req: Request, res: Response): Promise<void> => {
    try {
      const setting = await systemSettingRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { setting },
        message: 'System setting created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createSetting: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating system setting', error: (error as Error).message });
    }
  };

  updateSetting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      if (!key) {
        res.status(400).json({ success: false, message: 'Setting Key is required' });
        return;
      }

      const setting = await systemSettingRepository.update(key, req.body);
      const response: ApiResponse = {
        success: true,
        data: { setting },
        message: 'System setting updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateSetting: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating system setting', error: (error as Error).message });
    }
  };

  deleteSetting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;
      if (!key) {
        res.status(400).json({ success: false, message: 'Setting Key is required' });
        return;
      }

      const setting = await systemSettingRepository.delete(key);
      const response: ApiResponse = {
        success: true,
        data: { setting },
        message: 'System setting deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteSetting: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting system setting', error: (error as Error).message });
    }
  };
}
