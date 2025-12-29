import { Request, Response } from 'express';
import { EmployeeActivityRepository } from '../repositories/prisma/EmployeeActivityRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

const employeeActivityRepository = new EmployeeActivityRepository();

export class EmployeeActivityController {
  getAllActivities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, employeeId, action } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        employeeId: employeeId as string,
        action: action as string,
      };

      const activities = await employeeActivityRepository.findAll(filters);
      const total = await employeeActivityRepository.count(filters);

      const response: ApiResponse = {
        success: true,
        data: { activities, total, page: filters.page, limit: filters.limit },
        message: 'Employee activities retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllActivities: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving employee activities', error: (error as Error).message });
    }
  };

  getActivityById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Activity ID is required' });
         return;
      }
      const activity = await employeeActivityRepository.findById(id);

      if (!activity) {
        res.status(404).json({ success: false, message: 'Employee activity not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { activity },
        message: 'Employee activity retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getActivityById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving employee activity', error: (error as Error).message });
    }
  };
}
