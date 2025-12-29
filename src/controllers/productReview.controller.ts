import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductReviewController {
  // Create product review API
  createProductReview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, rating, title, comment, orderId } = req.body;
      const userId = (req as any).user?.id; // Assuming user ID is attached by authentication middleware

      if (!productId || !rating) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID and rating are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      if (rating < 1 || rating > 5) {
        const response: ApiResponse = {
          success: false,
          message: 'Rating must be between 1 and 5',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User authentication required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Check if user has purchased the product (if order ID is provided)
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        });

        if (!order || !order.items.some(item => item.productId === productId)) {
          const response: ApiResponse = {
            success: false,
            message: 'You can only review products you have purchased',
            timestamp: new Date().toISOString(),
          };
          res.status(403).json(response);
          return;
        }
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          productId,
          customerId: userId, // Use customerId as per schema
          orderId: orderId || null, // Use orderId if provided
          rating: Number(rating),
          title,
          comment,
          isVerifiedPurchase: !!orderId, // Mark as verified purchase if order ID is provided
          status: 'APPROVED', // Set to APPROVED by default
        },
      });

      // Update product's average rating
      await this.updateProductAverageRating(productId);

      const response: ApiResponse = {
        success: true,
        data: { review },
        message: 'Review created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createProductReview: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating review',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get product reviews API
  getProductReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // product id
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const filters: any = {
        productId: id,
        status: 'APPROVED', // Only return approved reviews
      };

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      };

      const reviews = await prisma.review.findMany({
        where: filters,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: {
          [sortBy as string]: sortOrder as 'asc' | 'desc',
        },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            }
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        }
      });

      const totalReviews = await prisma.review.count({
        where: filters,
      });

      const response: ApiResponse = {
        success: true,
        data: {
          reviews,
          pagination: {
            currentPage: pagination.page,
            totalPages: Math.ceil(totalReviews / pagination.limit),
            totalCount: totalReviews,
            hasNextPage: pagination.page < Math.ceil(totalReviews / pagination.limit),
            hasPrevPage: pagination.page > 1
          }
        },
        message: 'Reviews retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getProductReviews: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching reviews',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Helper method to update product's average rating
  private async updateProductAverageRating(productId: string): Promise<void> {
    try {
      // Calculate average rating for the product
      const aggregate = await prisma.review.aggregate({
        where: {
          productId,
          status: 'APPROVED',
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      const avgRating = aggregate._avg?.rating || 0;
      const totalReviews = aggregate._count?.rating || 0;

      // Update the product with the new average rating
      await prisma.product.update({
        where: { id: productId },
        data: {
          avgRating: Number(avgRating),
          totalReviews: totalReviews,
        },
      });
    } catch (error) {
      logger.error(`Error updating product average rating: ${error}`);
    }
  }
}