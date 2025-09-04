import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { UserRepository } from '../repositories/prisma/UserRepository';

const userRepo = new UserRepository();

export class UserController {
  /**
   * ADMIN END
   */

  listUsers = async (req: Request, res: Response): Promise<void> => {
    const { role, status, page, limit } = req.query;
    try {
      const users = await userRepo.list({
        role: role as any,
        status: status as any,
        page: Number(page) || 1,
        limit: Number(limit) || 20,
      });

      const response: ApiResponse = {
        success: true,
        message: 'User List',
        data: { users },
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

      const response: ApiResponse = {
        success: true,
        message: 'User Found',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User created successfully',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User updated successfully',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User restored successfully',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User locked successfully',
        data: { user },
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
      const response: ApiResponse = {
        success: true,
        message: 'User unlocked successfully',
        data: { user },
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

// /**
//  * USER END
//  */

// // import { Request, Response } from 'express';
// // import { UserRepository } from '../repositories/UserRepository';

// // const userRepo = new UserRepository();

// // export class AccountController {
// //   // Get own profile
// //   getProfile = async (req: Request, res: Response): Promise<void> => {
// //     const userId = req.user?.id; // Assume you set req.user after JWT auth
// //     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

// //     const user = await userRepo.findById(userId);
// //     if (!user) return res.status(404).json({ message: 'User not found' });
// //     res.json(user);
// //   };

// //   // Update own profile
// //   updateProfile = async (req: Request, res: Response): Promise<void> => {
// //     const userId = req.user?.id;
// //     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

// //     const updatedUser = await userRepo.update(userId, req.body);
// //     res.json(updatedUser);
// //   };

// //   // Change password
// //   changePassword = async (req: Request, res: Response): Promise<void> => {
// //     const userId = req.user?.id;
// //     const { oldPassword, newPassword } = req.body;

// //     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

// //     const user = await userRepo.findById(userId);
// //     if (!user) return res.status(404).json({ message: 'User not found' });

// //     // Verify old password
// //     if (user.password !== oldPassword) // Ideally hash & compare
// //       return res.status(400).json({ message: 'Old password is incorrect' });

// //     await userRepo.updatePassword(userId, newPassword);
// //     res.json({ success: true, message: 'Password changed successfully' });
// //   };

// //   // Deactivate own account (soft delete)
// //   deactivateAccount = async (req: Request, res: Response): Promise<void> => {
// //     const userId = req.user?.id;
// //     if (!userId) return res.status(401).json({ message: 'Unauthorized' });

// //     await userRepo.delete(userId);
// //     res.json({ success: true, message: 'Account deactivated' });
// //   };
// // }
