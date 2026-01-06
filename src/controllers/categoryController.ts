import { Request, Response } from 'express';
import { CategoryRepository } from '../repositories/prisma/CategoryRepository';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

export class CategoryController {
  private categoryRepo: CategoryRepository;
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryRepo.create(req.body);
      
      // Transform image keys to public URLs in the category response
      const transformedCategory = await this.imageUrlTransformer.transformCommonImageFields(category);
      
      // Format category with essential keys only
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };
      
      const formattedCategory = formatCategory(transformedCategory);
      
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category: formattedCategory },
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
      
      // Transform image keys to public URLs in the categories response
      const transformedCategories = await this.imageUrlTransformer.transformCommonImageFields(categories);
      
      // Format categories into hierarchical structure with only essential keys
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        // Recursively format children
        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };

      // Build hierarchical structure: only include root categories (level 0) with nested children
      const hierarchy = transformedCategories
        .filter((cat: any) => cat.level === 0)
        .map((cat: any) => formatCategory(cat));
      
      return res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
        data: {
          categories: hierarchy,
        },
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
            success: false,
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

      // Transform image keys to public URLs in the category response
      const transformedCategory = await this.imageUrlTransformer.transformCommonImageFields(category);
      
      // Format category with essential keys only
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };
      
      const formattedCategory = formatCategory(transformedCategory);
      
      return res.status(200).json({
        success: true,
        message: 'Category fetched successfully',
        data: { category: formattedCategory },
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
      
      // Transform image keys to public URLs in the category response
      const transformedCategory = await this.imageUrlTransformer.transformCommonImageFields(updated);
      
      // Format category with essential keys only
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };
      
      const formattedCategory = formatCategory(transformedCategory);
      
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: { category: formattedCategory },
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
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
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

      // Return 400 for validation errors (children/products exist), 500 for other errors
      const statusCode = (error as Error).message.includes('Cannot delete') ? 400 : 500;
      return res.status(statusCode).json(response);
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
      
      // Transform image keys to public URLs in the category response
      const transformedCategory = await this.imageUrlTransformer.transformCommonImageFields(category);
      
      // Format category with essential keys only
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };
      
      const formattedCategory = formatCategory(transformedCategory);
      
      return res.status(200).json({
        success: true,
        message: 'Category feature flag updated',
        data: { category: formattedCategory },
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
      
      // Transform image keys to public URLs in the category response
      const transformedCategory = await this.imageUrlTransformer.transformCommonImageFields(category);
      
      // Format category with essential keys only
      const formatCategory = (cat: any): any => {
        const formatted: any = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          level: cat.level,
          path: cat.path,
        };

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        if (cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };
      
      const formattedCategory = formatCategory(transformedCategory);
      
      return res.status(200).json({
        success: true,
        message: 'Category active status updated',
        data: { category: formattedCategory },
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
