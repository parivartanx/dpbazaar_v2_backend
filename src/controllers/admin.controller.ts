// import { Request, Response } from 'express';
// import { AdminService } from '../services/admin.services';
// import { logger } from '../utils/logger';
// import { ApiResponse } from '../types/common';
// import { AdminRepository } from '../repositories/prisma/AdminRepository';

// export class AdminController {
//   private adminService: AdminService;

//   constructor() {
//     this.adminService = new AdminService(new AdminRepository());
//   }

//   // =====================================================
//   // USER MANAGEMENT
//   // =====================================================

//   public getAllUsers = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { page, limit, search, role, status } = req.query;

//       const result = await this.adminService.getAllUsers({
//         page: page ? parseInt(page as string, 10) : 1,
//         limit: limit ? parseInt(limit as string, 10) : 10,
//         search: (search as string) || '',
//         role: (role as string) || '',
//         status: (status as string) || '',
//       });

//       const response: ApiResponse = {
//         success: true,
//         data: result,
//         message: 'Users retrieved successfully',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Get all users error: ${error}`);

//       const response: ApiResponse = {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'Failed to retrieve users',
//         message: 'Failed to retrieve users',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(500).json(response);
//     }
//   };

//   public getUserById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { id } = req.params as { id: string };

//       const result = await this.adminService.getUserById(id);

//       const response: ApiResponse = {
//         success: true,
//         data: result,
//         message: 'User retrieved successfully',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Get user by id error: ${error}`);

//       const response: ApiResponse = {
//         success: false,
//         error:
//           error instanceof Error ? error.message : 'Failed to retrieve user',
//         message: 'Failed to retrieve user',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(404).json(response);
//     }
//   };

//   public updateUserStatus = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const { id } = req.params as { id: string };
//       const { status } = req.body as { status?: string };

//       if (!status) {
//         throw new Error('Status is required');
//       }

//       const result = await this.adminService.updateUserStatus(id, status);

//       const response: ApiResponse = {
//         success: true,
//         data: result,
//         message: 'User status updated successfully',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Update user status error: ${error}`);

//       const response: ApiResponse = {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : 'Failed to update user status',
//         message: 'Failed to update user status',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(400).json(response);
//     }
//   };

//   public deleteUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { id } = req.params as { id: string };

//       await this.adminService.deleteUser(id);

//       const response: ApiResponse = {
//         success: true,
//         message: 'User deleted successfully',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Delete user error: ${error}`);

//       const response: ApiResponse = {
//         success: false,
//         error: error instanceof Error ? error.message : 'Failed to delete user',
//         message: 'Failed to delete user',
//         timestamp: new Date().toISOString(),
//       };

//       res.status(400).json(response);
//     }
//   };
// }
