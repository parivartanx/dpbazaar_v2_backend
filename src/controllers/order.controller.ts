import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
// import { OrderStatus } from '@prisma/client';

/**
 * Shared param types
 */
// type IdParam = { id: string };

export class OrderController {
  private repo = new OrderRepository();

  // CRUD Operations

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.repo.createOrder(req.body);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Order creation error: ${error}`);
      
      // Better error messages
      const errorMessage = (error as Error).message;
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        message: errorMessage.includes('not found') || 
                 errorMessage.includes('out of stock') ||
                 errorMessage.includes('not active') ||
                 errorMessage.includes('required')
          ? errorMessage
          : 'Problem in creating order',
        timestamp: new Date().toISOString(),
      };
      
      // Return 400 for validation errors, 500 for server errors
      const statusCode = errorMessage.includes('not found') || 
                        errorMessage.includes('out of stock') ||
                        errorMessage.includes('not active') ||
                        errorMessage.includes('required')
        ? 400
        : 500;
      
      res.status(statusCode).json(response);
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status,
        paymentStatus,
        startDate,
        endDate,
        search,
        customerId,
        vendorId,
        page,
        limit,
      } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (search) filters.search = search as string;
      if (customerId) filters.customerId = customerId as string;
      if (vendorId) filters.vendorId = vendorId as string;

      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllOrders(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: {
          orders: result.orders,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
        message: 'Orders fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching orders',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.getOrderById(id);
      if (!order) {
        const response: ApiResponse = {
          success: false,
          message: 'Order not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order found',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.updateOrder(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      if (!status) {
        const response: ApiResponse = {
          success: false,
          message: 'Order status is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.updateOrderStatus(id, status);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order status updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating order status',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.deleteOrder(id);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order cancelled successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in cancelling order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  restoreOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.restoreOrder(id);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order restored successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in restoring order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.cancelOrder(id, reason);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order cancelled successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in cancelling order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  confirmOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.repo.confirmOrder(id);
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order confirmed successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in confirming order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Dashboard and Analytics APIs

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.repo.getDashboardStats();
      const response: ApiResponse = {
        success: true,
        data: { stats },
        message: 'Dashboard stats fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching dashboard stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getMonthlyStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { months } = req.query;
      const monthsCount = months ? parseInt(months as string) : 6;

      const stats = await this.repo.getMonthlyOrderStats(monthsCount);
      const response: ApiResponse = {
        success: true,
        data: { stats },
        message: 'Monthly stats fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching monthly stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getOrderCountByStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const stats = await this.repo.getOrderCountByStatus();
      const response: ApiResponse = {
        success: true,
        data: { stats },
        message: 'Order count by status fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching order count by status',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getRevenueStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      const stats = await this.repo.getRevenueStats(start, end);
      const response: ApiResponse = {
        success: true,
        data: { stats },
        message: 'Revenue stats fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching revenue stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getCustomerOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = req.params;
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const orders = await this.repo.getOrdersByCustomer(customerId);
      const response: ApiResponse = {
        success: true,
        data: { orders },
        message: 'Customer orders fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching customer orders',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getVendorOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vendorId } = req.params;
      if (!vendorId) {
        const response: ApiResponse = {
          success: false,
          message: 'Vendor ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const orders = await this.repo.getOrdersByVendor(vendorId);
      const response: ApiResponse = {
        success: true,
        data: { orders },
        message: 'Vendor orders fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching vendor orders',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
