import { Request, Response } from 'express';
import { BannerRepository } from '../repositories/prisma/BannerRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

const bannerRepo = new BannerRepository();
const r2Service = new R2Service();
const imageUrlTransformer = new ImageUrlTransformer({ r2Service });

export class BannerController {
  /**
   * Create a new banner
   */
  createBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const bannerData = req.body;

      // Validate required fields
      if (!bannerData.title || !bannerData.type || !bannerData.status || !bannerData.placement) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: title, type, status, placement',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.create(bannerData);
      
      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Banner created successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating banner: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };

  /**
   * Get banner by ID
   */
  getBannerById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Banner ID is required',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.findById(id);

      if (!banner) {
        res.status(404).json({
          success: false,
          message: 'Banner not found',
        } as ApiResponse);
        return;
      }

      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Banner retrieved successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error retrieving banner: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };

  /**
   * Get all banners with optional filters
   */
  getAllBanners = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        placement,
        search,
      } = req.query;

      const filters = {
        status: status as string,
        type: type as string,
        placement: placement as string,
        search: search as string,
      };

      const result = await bannerRepo.findAll(
        filters,
        { page: Number(page), limit: Number(limit) }
      );
      
      // Transform image keys to public URLs in the banners response
      const transformedBanners = imageUrlTransformer.transformCommonImageFields(result.data);
      
      const response: ApiResponse = {
        success: true,
        message: 'Banners retrieved successfully',
        data: {
          banners: transformedBanners,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
          },
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error retrieving banners: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };

  /**
   * Update banner by ID
   */
  updateBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Banner ID is required',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.update(id, updateData);
      
      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Banner updated successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating banner: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };
  /**
   * Delete banner by ID
   */
  deleteBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Banner ID is required',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.delete(id);
      
      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Banner deleted successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting banner: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };


  /**
   * Get active banners
   */
  getActiveBanners = async (req: Request, res: Response): Promise<void> => {
    try {
      const banners = await bannerRepo.getActiveBanners();
      
      // Transform image keys to public URLs in the banners response
      const transformedBanners = imageUrlTransformer.transformCommonImageFields(banners);
      
      const response: ApiResponse = {
        success: true,
        message: 'Active banners retrieved successfully',
        data: transformedBanners,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error retrieving active banners: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };

  /**
   * Increment banner impressions
   */
  incrementImpressions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Banner ID is required',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.incrementImpressions(id);
      
      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Impressions incremented successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error incrementing banner impressions: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };

  /**
   * Increment banner clicks
   */
  incrementClicks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Banner ID is required',
        } as ApiResponse);
        return;
      }

      const banner = await bannerRepo.incrementClicks(id);
      
      // Transform image keys to public URLs in the banner response
      const transformedBanner = imageUrlTransformer.transformCommonImageFields(banner);
      
      const response: ApiResponse = {
        success: true,
        message: 'Clicks incremented successfully',
        data: transformedBanner,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error incrementing banner clicks: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as ApiResponse);
    }
  };
}