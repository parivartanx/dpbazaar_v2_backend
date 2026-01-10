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
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - slug uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate category',
          message: `A category with this slug already exists. Field(s): ${target?.join(', ') || 'slug'}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle parent not found or other validation errors
      if (error.message.includes('not found') || error.message.includes('cannot')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: 'Problem in Creating Category',
          timestamp: new Date().toISOString(),
        });
      }

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
      const { search, isActive, isFeatured, parentId, level, page, limit, flat } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      const flatList = flat === 'true';

      // Build filter params - only include defined values
      const filterParams: any = {
        search: search as string,
        parentId: parentId as string,
        page: pageNum,
        limit: limitNum,
        flat: flatList,
      };

      if (isActive !== undefined) {
        filterParams.isActive = isActive === 'true';
      }

      if (isFeatured !== undefined) {
        filterParams.isFeatured = isFeatured === 'true';
      }

      if (level !== undefined) {
        filterParams.level = Number(level);
      }

      // Get filtered categories
      const categories = await this.categoryRepo.filterCategories(filterParams);

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

        if (cat.parent) {
          formatted.parent = {
            id: cat.parent.id,
            name: cat.parent.name,
            slug: cat.parent.slug,
            level: cat.parent.level,
            path: cat.parent.path,
          };
        }

        // Recursively format children (only if not flat list)
        if (!flatList && cat.children && cat.children.length > 0) {
          formatted.children = cat.children.map((child: any) => formatCategory(child));
        }

        return formatted;
      };

      // Build response - hierarchical or flat based on query param
      let formattedCategories;
      if (flatList) {
        // Return flat list with pagination
        formattedCategories = transformedCategories.map((cat: any) => formatCategory(cat));
      } else {
        // Build hierarchical structure: only include root categories (level 0) with nested children
        formattedCategories = transformedCategories
          .filter((cat: any) => cat.level === 0)
          .map((cat: any) => formatCategory(cat));
      }

      // Get total count for pagination metadata (only if flat list or filters applied)
      let totalCount: number | undefined;
      if (flatList || search || isActive !== undefined || isFeatured !== undefined || parentId || level !== undefined) {
        const countParams: any = {
          search: search as string,
          parentId: parentId as string,
        };

        if (isActive !== undefined) {
          countParams.isActive = isActive === 'true';
        }

        if (isFeatured !== undefined) {
          countParams.isFeatured = isFeatured === 'true';
        }

        if (level !== undefined) {
          countParams.level = Number(level);
        }

        totalCount = await this.categoryRepo.countFilteredCategories(countParams);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Categories fetched successfully',
        data: {
          categories: formattedCategories,
          ...(totalCount !== undefined && {
            pagination: {
              currentPage: pageNum,
              totalPages: Math.ceil(totalCount / limitNum),
              totalItems: totalCount,
              itemsPerPage: limitNum,
            },
          }),
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
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
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
          timestamp: new Date().toISOString(),
        });

      const category = await this.categoryRepo.findById(id);
      if (!category)
        return res.status(404).json({
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
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
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
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - slug uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate category',
          message: `A category with this slug already exists. Field(s): ${target?.join(', ') || 'slug'}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Handle not found or validation errors (from repository)
      if (error.message.includes('not found') || error.message.includes('cannot') || error.message.includes('circular')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: 'Problem in Updating Category',
          timestamp: new Date().toISOString(),
        });
      }

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
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
          timestamp: new Date().toISOString(),
        });

      // Check if category exists before deleting
      const existingCategory = await this.categoryRepo.findById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
          timestamp: new Date().toISOString(),
        });
      }

      await this.categoryRepo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle validation errors (children/products exist) - these are thrown by repository
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({
          success: false,
          error: error.message,
          message: 'Problem in Deleting Category',
          timestamp: new Date().toISOString(),
        });
      }

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
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
          timestamp: new Date().toISOString(),
        });
      
      if (typeof isFeatured !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isFeatured must be a boolean value',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if category exists before toggling
      const existingCategory = await this.categoryRepo.findById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
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
        message: 'Category feature flag updated successfully',
        data: { category: formattedCategory },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma not found error (P2025)
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          message: 'Problem in Toggle Feature',
          timestamp: new Date().toISOString(),
        });
      }

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
        return res.status(400).json({
          success: false,
          message: 'Category ID is required',
          timestamp: new Date().toISOString(),
        });
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if category exists before toggling
      const existingCategory = await this.categoryRepo.findById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
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
        message: 'Category active status updated successfully',
        data: { category: formattedCategory },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma not found error (P2025)
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
          message: 'Problem in Toggle Active',
          timestamp: new Date().toISOString(),
        });
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Toggle Active',
        timestamp: new Date().toISOString(),
      };

      return res.status(500).json(response);
    }
  };
}
