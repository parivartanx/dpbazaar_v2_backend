import { Request, Response } from "express";
import { AdminRepository } from "../repositories/prisma/AdminRepository";
import { ApiResponse } from "../types/common";

export class AdminController {
  private repo: AdminRepository;

  constructor() {
    this.repo = new AdminRepository();
  }

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