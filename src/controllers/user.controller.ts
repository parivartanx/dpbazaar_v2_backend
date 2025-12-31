import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

const userRepo = new UserRepository();
const r2Service = new R2Service();
const imageUrlTransformer = new ImageUrlTransformer({ r2Service });

export class UserController {
  /**
   * ADMIN END
   */

/** User Count for user management dashboard */
  getUserCounts = async (req: Request, res: Response): Promise<void> => {
    try {
      const counts = await userRepo.getUserCounts();

      // Transform image keys to public URLs in the counts response
      const transformedCounts = imageUrlTransformer.transformCommonImageFields(counts);
      
      const response: ApiResponse = {
        success: true,
        message: "User counts fetched successfully",
        data: transformedCounts,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching user counts: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem fetching user counts',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

/** Filter and search users */
  filterUsers = async (req: Request, res: Response): Promise<void> => {
    const { gender, status, search, page, limit } = req.query;

    try {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;
      
      // Get filtered users
      const users = await userRepo.filterUsers({
        gender: gender as string,
        status: status as any,
        search: search as string,
        page: pageNum,
        limit: limitNum,
      });
      
      // Get total count for pagination metadata
      const total = await userRepo.countFilteredUsers({
        gender: gender as string,
        status: status as any,
        search: search as string,
      });

      // Transform image keys to public URLs in the users response
      const transformedUsers = imageUrlTransformer.transformCommonImageFields(users);
      
      const response: ApiResponse = {
        success: true,
        message: "Filtered users fetched successfully",
        data: { 
          users: transformedUsers,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum
          }
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error filtering users: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem filtering users',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };


  listUsers = async (req: Request, res: Response): Promise<void> => {
    const { role, status, page, limit } = req.query;
    try {
      const users = await userRepo.list({
        role: role as any,
        status: status as any,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      // Transform image keys to public URLs in the users response
      const transformedUsers = imageUrlTransformer.transformCommonImageFields(users);
      
      const response: ApiResponse = {
        success: true,
        message: 'User List',
        data: { users: transformedUsers },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching user list: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in fetching user list',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.findById(id);
      if (!user) {
        const response: ApiResponse = {
          success: false,
          message: 'User not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User Found',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in fetching user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userRepo.create(req.body);
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User created successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in creating user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.update(id, req.body);
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User updated successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in updating user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.delete(id);
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in deleting user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  restoreUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.restore(id);
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User restored successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error restoring user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in restoring user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  lockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { lockedUntil } = req.body;
    try {
      if (!id || !lockedUntil) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID and lockedUntil are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.lockUser(id, new Date(lockedUntil));
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User locked successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error locking user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in locking user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  unlockUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const user = await userRepo.unlockUser(id);
      
      // Transform image keys to public URLs in the user response
      const transformedUser = imageUrlTransformer.transformCommonImageFields(user);
      
      const response: ApiResponse = {
        success: true,
        message: 'User unlocked successfully',
        data: { user: transformedUser },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error unlocking user: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in unlocking user',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { password } = req.body;
    try {
      if (!id || !password) {
        const response: ApiResponse = {
          success: false,
          message: 'User ID and password are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      await userRepo.updatePassword(id, password);
      const response: ApiResponse = {
        success: true,
        message: 'Password reset successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error resetting password: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem in resetting password',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
