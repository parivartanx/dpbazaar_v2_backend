import { BrandRepository } from '../repositories/prisma/BrandRepository';
import { Request, Response } from 'express';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';
import { ApiResponse } from '../types/common';
import { logger } from '../utils/logger';

export class BrandController {
  private brandRepo: BrandRepository;
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  constructor() {
    this.brandRepo = new BrandRepository();
  }

  createBrand = async (req: Request, res: Response) => {
    try {
      const brand = await this.brandRepo.create(req.body);
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = await this.imageUrlTransformer.transformCommonImageFields(brand);
      
      return res.status(201).json({
        success: true,
        message: 'Brand created successfully',
        data: { brand: transformedBrand },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - name/slug uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate brand',
          message: `A brand with this ${target?.includes('name') ? 'name' : 'slug'} already exists. Field(s): ${target?.join(', ') || 'name, slug'}`,
          timestamp: new Date().toISOString(),
        });
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Brand',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getAllBrands = async (req: Request, res: Response) => {
    try {
      const { search, isActive, page, limit } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      // Build filter params - only include defined values
      const filterParams: any = {
        search: search as string,
        page: pageNum,
        limit: limitNum,
      };

      if (isActive !== undefined) {
        filterParams.isActive = isActive === 'true';
      }

      // Get filtered brands
      const brands = await this.brandRepo.filterBrands(filterParams);

      // Transform image keys to public URLs in the brands response
      const transformedBrands = await this.imageUrlTransformer.transformCommonImageFields(brands);

      // Get total count for pagination metadata
      const countParams: any = {
        search: search as string,
      };

      if (isActive !== undefined) {
        countParams.isActive = isActive === 'true';
      }

      const totalCount = await this.brandRepo.countFilteredBrands(countParams);

      const response: ApiResponse = {
        success: true,
        message: 'Brands fetched successfully',
        data: {
          brands: transformedBrands,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Brands',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getBrandById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Brand ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      const brand = await this.brandRepo.findById(id);
      if (!brand) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found',
          timestamp: new Date().toISOString(),
        });
      }
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = await this.imageUrlTransformer.transformCommonImageFields(brand);
      
      return res.status(200).json({
        success: true,
        message: 'Brand fetched successfully',
        data: { brand: transformedBrand },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Brand',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  updateBrand = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Brand ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if brand exists
      const existingBrand = await this.brandRepo.findById(id);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found',
          timestamp: new Date().toISOString(),
        });
      }

      const updated = await this.brandRepo.update(id, req.body);
      
      // Transform image keys to public URLs in the brand response
      const transformedBrand = await this.imageUrlTransformer.transformCommonImageFields(updated);
      
      return res.status(200).json({
        success: true,
        message: 'Brand updated successfully',
        data: { brand: transformedBrand },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - name/slug uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate brand',
          message: `A brand with this ${target?.includes('name') ? 'name' : 'slug'} already exists. Field(s): ${target?.join(', ') || 'name, slug'}`,
          timestamp: new Date().toISOString(),
        });
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Brand',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  deleteBrand = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Brand ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if brand exists before deleting
      const existingBrand = await this.brandRepo.findById(id);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found',
          timestamp: new Date().toISOString(),
        });
      }

      await this.brandRepo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Brand deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma foreign key constraint (brand has products)
      if (error.code === 'P2003') {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete brand',
          message: 'Brand cannot be deleted because it has associated products. Please remove or reassign products first.',
          timestamp: new Date().toISOString(),
        });
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Brand',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };
}
