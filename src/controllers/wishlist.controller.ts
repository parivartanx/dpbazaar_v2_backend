import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { WishlistRepository } from '../repositories/prisma/WishlistRepository';

export class WishlistController {
  private repo = new WishlistRepository();

  // Get customer's wishlists
  getCustomerWishlists = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const wishlists = await this.repo.getCustomerWishlists(customerId);
      
      res.status(200).json({
        success: true,
        message: 'Wishlists retrieved successfully',
        data: { wishlists },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching customer wishlists',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get customer's default wishlist
  getDefaultWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const wishlist = await this.repo.getDefaultWishlist(customerId);
      if (!wishlist) {
        const response: ApiResponse = {
          success: false,
          message: 'Default wishlist not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Default wishlist retrieved successfully',
        data: { wishlist },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching default wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Create a new wishlist
  createWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { name, isPublic } = req.body;
      
      if (!name) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist name is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const wishlist = await this.repo.createWishlist({
        customerId,
        name,
        isPublic: isPublic || false,
        isDefault: false, // Only one can be default, so new ones are not default
      });
      
      res.status(201).json({
        success: true,
        message: 'Wishlist created successfully',
        data: { wishlist },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Update a wishlist
  updateWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { id } = req.params;
      const { name, isDefault, isPublic } = req.body;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Update the wishlist
      const updatedWishlist = await this.repo.updateWishlist(id, {
        name,
        isDefault,
        isPublic,
      });
      
      if (!updatedWishlist) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Wishlist updated successfully',
        data: { wishlist: updatedWishlist },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Delete a wishlist
  deleteWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { id } = req.params;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      await this.repo.deleteWishlist(id);
      
      res.status(200).json({
        success: true,
        message: 'Wishlist deleted successfully',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Add product to wishlist
  addToWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { wishlistId } = req.params;
      const { productId, priority, notes } = req.body;

      if (!productId) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // If no wishlistId is provided, use the default wishlist
      let targetWishlistId = wishlistId;
      if (!targetWishlistId) {
        const defaultWishlist = await this.repo.getDefaultWishlist(customerId);
        if (!defaultWishlist) {
          // Create a default wishlist if one doesn't exist
          const newWishlist = await this.repo.createWishlist({
            customerId,
            name: 'My Wishlist',
            isPublic: false,
            isDefault: true,
          });
          targetWishlistId = newWishlist.id;
        } else {
          targetWishlistId = defaultWishlist.id;
        }
      }

      const wishlistItem = await this.repo.addProductToWishlist({
        wishlistId: targetWishlistId,
        productId,
        priority: priority || 0,
        notes,
      });
      
      res.status(200).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: { wishlistItem },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in adding product to wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Remove product from wishlist
  removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { wishlistId, productId } = req.params;

      if (!wishlistId || !productId) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist ID and Product ID are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      await this.repo.removeProductFromWishlist(wishlistId, productId);
      
      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist successfully',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in removing product from wishlist',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get wishlist items
  getWishlistItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = (req as any).user?.userId;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const { wishlistId } = req.params;

      if (!wishlistId) {
        const response: ApiResponse = {
          success: false,
          message: 'Wishlist ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const wishlistItems = await this.repo.getWishlistItems(wishlistId);
      
      res.status(200).json({
        success: true,
        message: 'Wishlist items retrieved successfully',
        data: { wishlistItems },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching wishlist items',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}