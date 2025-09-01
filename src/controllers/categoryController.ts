import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/prisma/CategoryRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

export class CategoryController {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryRepo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Category',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryRepo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: { categories },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Categories',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            succcess: false,
            message: 'Id is required',
            timestamp: new Date().toISOString(),
          });

      const category = await this.categoryRepo.findById(id);
      if (!category)
        return res
          .status(404)
          .json({
            success: false,
            message: 'Category not found',
            timestamp: new Date().toISOString(),
          });

      return res.status(200).json({
        success: true,
        message: 'Category fetched successfully',
        data: { category },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Category',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id is required',
            timestamp: new Date().toISOString(),
          });

      const updated = await this.categoryRepo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { updated },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Category',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id is required',
            timestamp: new Date().toISOString(),
          });

      await this.categoryRepo.delete(id);
      return res.status(20).json({
        success: true,
        message: 'Category deleted',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Category',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  toggleFeature = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;

      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id is required',
            timestamp: new Date().toISOString(),
          });
      if (typeof isFeatured !== 'boolean') {
        return res
          .status(400)
          .json({
            success: false,
            message: 'isFeatured must be boolean',
            timestamp: new Date().toISOString(),
          });
      }

      const category = await this.categoryRepo.toggleFeature(id, isFeatured);
      return res.status(200).json({
        success: true,
        message: 'Category feature flag updated',
        data: { category },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Toggle Feature',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };

  toggleActive = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id is required',
            timestamp: new Date().toISOString(),
          });
      if (typeof isActive !== 'boolean') {
        return res
          .status(400)
          .json({
            success: false,
            message: 'isActive must be boolean',
            timestamp: new Date().toISOString(),
          });
      }

      const category = await this.categoryRepo.toggleActive(id, isActive);
      return res.status(200).json({
        success: true,
        message: 'Category active status updated',
        data: { category },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Toggle Active Button',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };
}
