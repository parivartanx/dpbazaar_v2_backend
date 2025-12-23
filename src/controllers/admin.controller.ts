import { Request, Response } from "express";
import { AdminRepository } from "../repositories/prisma/AdminRepository";
import { ApiResponse } from "../types/common";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/prisma/UserRepository";

export class AdminController {
  private repo: AdminRepository;
  private authService: AuthService;

  constructor() {
    this.repo = new AdminRepository();
    this.authService = new AuthService(new UserRepository());
  }

  public adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Check if user exists and has ADMIN or SUPER_ADMIN role
      const user = await this.authService.login({ email, password, role: 'ADMIN' as any });
      
      // Verify that the user has ADMIN or SUPER_ADMIN role
      if (user.user.role !== 'ADMIN' && user.user.role !== 'SUPER_ADMIN') {
        throw new Error('Access denied. Admin login only for ADMIN or SUPER_ADMIN users');
      }
      
      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Admin login successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Admin login failed',
        message: 'Admin login failed',
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
    }
  };

  public getDashboard = async (_: Request, res: Response): Promise<void> => {
    try {
      const [
        revenue,
        totalOrders,
        totalCustomers,
        weeklySales,
        salesByCategory,
        recentOrders
      ] = await Promise.all([
        this.repo.getTotalRevenue(),
        this.repo.getTotalOrders(),
        this.repo.getTotalCustomers(),
        this.repo.getWeeklySales(),
        this.repo.getSalesByCategory(),
        this.repo.getRecentOrders()
      ]);

      const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0;

      const response: ApiResponse = {
        success: true,
        message: "Admin dashboard data fetched successfully",
        data: {
          revenue,
          totalOrders,
          totalCustomers,
          avgOrderValue,
          weeklySales,
          salesByCategory,
          recentOrders
        },
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);

    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  };
}