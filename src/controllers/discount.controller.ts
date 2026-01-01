import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { DiscountRepository } from '../repositories/prisma/DiscountRepository';
import { prisma } from '../config/prismaClient';

const discountRepository = new DiscountRepository();

export class DiscountController {
  // Get all discounts/offer API
  getDiscountOffers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get query parameters for filtering and pagination
      const {
        page = 1,
        limit = 20,
        search,
        isActive,
        type
      } = req.query;

      // Build filters for discounts
      const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      // Add search filter if provided
      if (search) {
        filters.search = search as string;
      }

      // Add active status filter if provided
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      // Add discount type filter if provided
      if (type) {
        filters.type = type as string;
      }

      // Use repository to get discounts
      const discounts = await discountRepository.getAll(filters);
      
      // Get total count (using prisma directly for now or add count method to repo)
      // Re-implementing count logic here as it was in the original controller
      const totalCount = await prisma.discount.count({
        where: {
          AND: [
            filters.search ? {
              OR: [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
              ]
            } : {},
            filters.isActive !== undefined ? { isActive: filters.isActive } : {},
            filters.type ? { type: filters.type } : {}
          ]
        }
      });

      // Enrich data (logic from original controller)
      const discountsWithDetails = await Promise.all(discounts.map(async (discount) => {
        const categories = discount.applicableCategories && discount.applicableCategories.length > 0
          ? await prisma.category.findMany({
              where: { id: { in: discount.applicableCategories } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        const products = discount.applicableProducts && discount.applicableProducts.length > 0
          ? await prisma.product.findMany({
              where: { id: { in: discount.applicableProducts } },
              select: { id: true, name: true, sku: true, slug: true }
            })
          : [];
        
        const brands = discount.applicableBrands && discount.applicableBrands.length > 0
          ? await prisma.brand.findMany({
              where: { id: { in: discount.applicableBrands } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        return {
          ...discount,
          applicableCategories: categories,
          applicableProducts: products,
          applicableBrands: brands
        };
      }));

      const response: ApiResponse = {
        success: true,
        data: {
          discounts: discountsWithDetails,
          pagination: {
            currentPage: filters.page,
            totalPages: Math.ceil(totalCount / filters.limit),
            totalCount,
            hasNextPage: filters.page < Math.ceil(totalCount / filters.limit),
            hasPrevPage: filters.page > 1
          }
        },
        message: 'Discounts retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDiscountOffers: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching discounts',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get discount by code API
  getDiscountOfferByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;

      if (!code) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount code is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const discount = await discountRepository.getByCode(code);

      if (!discount) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      // Check if discount is active and within valid date range
      const now = new Date();
      if (!discount.isActive || discount.validFrom > now || discount.validUntil < now) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount is not valid at this time',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Enrich data
      const categories = discount.applicableCategories && discount.applicableCategories.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: discount.applicableCategories } },
            select: { id: true, name: true, slug: true }
          })
        : [];
      
      const products = discount.applicableProducts && discount.applicableProducts.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: discount.applicableProducts } },
            select: { id: true, name: true, sku: true, slug: true }
          })
        : [];
      
      const brands = discount.applicableBrands && discount.applicableBrands.length > 0
        ? await prisma.brand.findMany({
            where: { id: { in: discount.applicableBrands } },
            select: { id: true, name: true, slug: true }
          })
        : [];
      
      const discountWithDetails = {
        ...discount,
        applicableCategories: categories,
        applicableProducts: products,
        applicableBrands: brands
      };

      const response: ApiResponse = {
        success: true,
        data: { discount: discountWithDetails },
        message: 'Discount retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDiscountOfferByCode: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching discount',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get discount by ID API (Admin)
  getDiscountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      const discount = await discountRepository.getById(id);

      if (!discount) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { discount },
        message: 'Discount retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDiscountById: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching discount',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Create discount API (Admin)
  createDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
      const discount = await discountRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { discount },
        message: 'Discount created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createDiscount: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating discount',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Update discount API (Admin)
  updateDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      const discount = await discountRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { discount },
        message: 'Discount updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateDiscount: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating discount',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Delete discount API (Admin)
  deleteDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Discount ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      await discountRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Discount deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteDiscount: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting discount',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
