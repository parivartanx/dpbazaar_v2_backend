import { Request, Response } from 'express';
import { ReturnRepository } from '../repositories/prisma/ReturnRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

const returnRepository = new ReturnRepository();

export class ReturnController {
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });
  createReturn = async (req: Request, res: Response): Promise<void> => {
    try {
      // Logic for creating return usually involves checking order, etc.
      // For admin manual creation, we assume valid input or basic validation
      const returnRequest = await returnRepository.create(req.body);
      
      // Transform image keys to public URLs in the return response
      const transformedReturn = this.imageUrlTransformer.transformCommonImageFields(returnRequest);
      
      const response: ApiResponse = {
        success: true,
        data: { return: transformedReturn },
        message: 'Return request created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createReturn: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating return request', error: (error as Error).message });
    }
  };

  getAllReturns = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, orderId, returnNumber } = req.query;
      const filters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        status: status as string,
        orderId: orderId as string,
        returnNumber: returnNumber as string,
      };

      const returns = await returnRepository.findAll(filters);
      const total = await returnRepository.count(filters);

      // Transform image keys to public URLs in the returns response
      const transformedReturns = this.imageUrlTransformer.transformCommonImageFields(returns);
      
      const response: ApiResponse = {
        success: true,
        data: { returns: transformedReturns, total, page: filters.page, limit: filters.limit },
        message: 'Returns retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllReturns: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving returns', error: (error as Error).message });
    }
  };

  getReturnById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Return ID is required' });
         return;
      }
      const returnRequest = await returnRepository.findById(id);

      if (!returnRequest) {
        res.status(404).json({ success: false, message: 'Return request not found' });
        return;
      }

      // Transform image keys to public URLs in the return response
      const transformedReturn = this.imageUrlTransformer.transformCommonImageFields(returnRequest);
      
      const response: ApiResponse = {
        success: true,
        data: { return: transformedReturn },
        message: 'Return request retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getReturnById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in retrieving return request', error: (error as Error).message });
    }
  };

  updateReturn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Return ID is required' });
         return;
      }
      const returnRequest = await returnRepository.update(id, req.body);
      
      // Transform image keys to public URLs in the return response
      const transformedReturn = this.imageUrlTransformer.transformCommonImageFields(returnRequest);
      
      const response: ApiResponse = {
        success: true,
        data: { return: transformedReturn },
        message: 'Return request updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateReturn: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating return request', error: (error as Error).message });
    }
  };

  deleteReturn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
         res.status(400).json({ success: false, message: 'Return ID is required' });
         return;
      }
      await returnRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Return request deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteReturn: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting return request', error: (error as Error).message });
    }
  };
}
