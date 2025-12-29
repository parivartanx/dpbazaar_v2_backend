import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

      // Fetch discounts from the database
      const discounts = await prisma.discount.findMany({
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
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' }
      });

      // Since Prisma doesn't directly support filtering by array values in include,
      // we need to fetch related data separately and attach it to each discount
      const discountsWithDetails = await Promise.all(discounts.map(async (discount) => {
        // Get detailed information for applicable categories
        const categories = discount.applicableCategories && discount.applicableCategories.length > 0
          ? await prisma.category.findMany({
              where: { id: { in: discount.applicableCategories } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        // Get detailed information for applicable products
        const products = discount.applicableProducts && discount.applicableProducts.length > 0
          ? await prisma.product.findMany({
              where: { id: { in: discount.applicableProducts } },
              select: { id: true, name: true, sku: true, slug: true }
            })
          : [];
        
        // Get detailed information for applicable brands
        const brands = discount.applicableBrands && discount.applicableBrands.length > 0
          ? await prisma.brand.findMany({
              where: { id: { in: discount.applicableBrands } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        // Return discount with detailed applicable information
        return {
          ...discount,
          applicableCategories: categories, // Replace IDs with full category objects
          applicableProducts: products,     // Replace IDs with full product objects
          applicableBrands: brands          // Replace IDs with full brand objects
        };
      }));

      // Get total count for pagination
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

      // Fetch discount from the database by code
      const discount = await prisma.discount.findUnique({
        where: { code: code.toUpperCase() },
      });

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

      // Get detailed information for applicable categories
      const categories = discount.applicableCategories && discount.applicableCategories.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: discount.applicableCategories } },
            select: { id: true, name: true, slug: true }
          })
        : [];
      
      // Get detailed information for applicable products
      const products = discount.applicableProducts && discount.applicableProducts.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: discount.applicableProducts } },
            select: { id: true, name: true, sku: true, slug: true }
          })
        : [];
      
      // Get detailed information for applicable brands
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
}