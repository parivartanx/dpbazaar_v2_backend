import { Request, Response } from 'express';
import { JobExecutionRepository } from '../repositories/prisma/JobExecutionRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

const jobExecutionRepository = new JobExecutionRepository();

export class JobExecutionController {
  getAllJobExecutions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, jobName } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        jobName: jobName as string,
      };

      const jobs = await jobExecutionRepository.findAll(filters);
      const total = await jobExecutionRepository.count(filters);

      const response: ApiResponse = {
        success: true,
        data: { jobs, total, page: filters.page, limit: filters.limit },
        message: 'Job executions retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllJobExecutions: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving job executions', error: (error as Error).message });
    }
  };

  getJobExecutionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Job ID is required' });
         return;
      }
      const job = await jobExecutionRepository.findById(id);

      if (!job) {
        res.status(404).json({ success: false, message: 'Job execution not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { job },
        message: 'Job execution retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getJobExecutionById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving job execution', error: (error as Error).message });
    }
  };
}
