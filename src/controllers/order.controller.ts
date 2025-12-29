import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
import { PaymentService } from '../services/payment.service';
import { PaymentMethod } from '@prisma/client';
// import { OrderStatus } from '@prisma/client';

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { id: string };
}

export class OrderController {
  private repo = new OrderRepository();
  private paymentService = new PaymentService();

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

  /** Filter and search orders */
  filterOrders = async (req: Request, res: Response): Promise<void> => {
    const { status, paymentStatus, search, page, limit } = req.query;

    try {
      const filters: any = {};
      if (status) filters.status = status;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (search) filters.search = search as string;

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllOrders(filters, pagination);

      const response: ApiResponse = {
        success: true,
        message: "Filtered orders fetched successfully",
        data: {
          orders: result.orders,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error filtering orders: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Problem filtering orders',
        error: (error as Error).message,
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

  // Customer-specific method to get order by ID
  getCustomerOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customerId = req.user?.id;
      
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Get the order and verify it belongs to the customer
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
      
      // Check if the order belongs to the authenticated customer
      if (order.customerId !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Unauthorized: This order does not belong to you',
          timestamp: new Date().toISOString(),
        };
        res.status(403).json(response);
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
        message: 'Order deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting order',
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

  // Analytics & Dashboard Methods

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
      const monthlyStats = await this.repo.getMonthlyOrderStats(
        months ? parseInt(months as string) : 6
      );
      const response: ApiResponse = {
        success: true,
        data: { stats: monthlyStats },
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

  getOrderCountByStatus = async (req: Request, res: Response): Promise<void> => {
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
      const stats = await this.repo.getRevenueStats(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
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

  // Customer-specific method to buy products (create order with payment)
  createCustomerOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.id;
      
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Prepare order data with customer ID
      const orderData = {
        ...req.body,
        customerId, // Ensure the order is linked to the authenticated customer
      };

      // Create the order
      const order = await this.repo.createOrder(orderData);
      
      // Process payment if payment information is provided
      const { paymentMethod, paymentDetails } = req.body;
      if (paymentMethod) {
        await this.createPayment(order.id, order.totalAmount, paymentMethod as PaymentMethod, {
          ...paymentDetails,
          customerId
        });
      }
      
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Helper method to create payment record
  private async createPayment(orderId: string, amount: any, method: PaymentMethod, details?: any): Promise<void> {
    // Use the PaymentService to process the payment
    const paymentRequest = {
      orderId,
      amount: Number(amount),
      paymentMethod: method,
      customerId: details?.customerId,
      razorpayPaymentId: details?.razorpayPaymentId,
      razorpayOrderId: details?.razorpayOrderId,
      razorpaySignature: details?.razorpaySignature,
    };
    
    await this.paymentService.processPayment(paymentRequest);
  }

  // Return Management Methods

  createReturnRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const returnData = req.body;
      
      // Validate required fields
      if (!returnData.orderId || !returnData.type || !returnData.reason) {
        const response: ApiResponse = {
          success: false,
          message: 'Order ID, type, and reason are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Generate return number
      const returnNumber = `RET-${Date.now()}`;
      
      // Create return with the generated return number and default status to REQUESTED
      const returnRequest = await this.repo.createReturn({
        ...returnData,
        returnNumber,
        status: 'REQUESTED', // Default to REQUESTED for customer-initiated returns
      });
      
      const response: ApiResponse = {
        success: true,
        data: { return: returnRequest },
        message: 'Return request created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Return creation error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating return request',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getReturnById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { returnId } = req.params;
      
      if (!returnId) {
        const response: ApiResponse = {
          success: false,
          message: 'Return ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const returnRequest = await this.repo.getReturnById(returnId);
      
      if (!returnRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Return request not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { return: returnRequest },
        message: 'Return request found',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Return fetch error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching return request',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getCustomerReturns = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.id;
      const {
        status,
        orderId,
        type,
        page,
        limit,
      } = req.query;

      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const filters: any = {
        orderId,
        type,
      };
      
      // Get all orders for this customer to filter returns
      const customerOrders = await this.repo.getAllOrders({ customerId }, { page: 1, limit: 1000 });
      const customerOrderIds = customerOrders.orders.map((order: any) => order.id);
      
      // Only allow returns from customer's orders
      filters.orderId = { in: customerOrderIds };
      if (status) filters.status = status;
      if (orderId) filters.orderId = orderId as string; // Override if specific order ID is provided

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllReturns(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: {
          returns: result.returns,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
        message: 'Customer returns fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Customer returns fetch error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching customer returns',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateReturnStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { returnId } = req.params;
      const { status, inspectionNotes, refundAmount, refundMethod } = req.body;

      if (!returnId) {
        const response: ApiResponse = {
          success: false,
          message: 'Return ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      if (!status) {
        const response: ApiResponse = {
          success: false,
          message: 'Status is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const returnRequest = await this.repo.updateReturnStatus(returnId, {
        status,
        inspectionNotes,
        refundAmount,
        refundMethod,
      });

      const response: ApiResponse = {
        success: true,
        data: { return: returnRequest },
        message: 'Return status updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Return status update error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating return status',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Customer & Vendor Specific Methods

  getCustomerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const customerId = req.user?.id;
      const { page, limit } = req.query;
      
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllOrders(
        { customerId },
        pagination
      );

      const response: ApiResponse = {
        success: true,
        data: {
          orders: result.orders,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
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

  getCustomerReturnById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Using 'id' to match the route parameter
      const customerId = req.user?.id;
      
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Return ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      if (!customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Get the return and verify it belongs to the customer's orders
      const returnRequest = await this.repo.getReturnById(id);
      
      if (!returnRequest) {
        const response: ApiResponse = {
          success: false,
          message: 'Return request not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Get the associated order to check if it belongs to the customer
      const order = await this.repo.getOrderById(returnRequest.orderId);
      
      if (!order || order.customerId !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Unauthorized: This return does not belong to you',
          timestamp: new Date().toISOString(),
        };
        res.status(403).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { return: returnRequest },
        message: 'Return request found',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Return fetch error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching return request',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getVendorOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vendorId } = req.params;
      const { page, limit } = req.query;

      if (!vendorId) {
        const response: ApiResponse = {
          success: false,
          message: 'Vendor ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllOrders(
        { vendorId },
        pagination
      );

      const response: ApiResponse = {
        success: true,
        data: {
          orders: result.orders,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
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

  // Admin method to get all returns (unrestricted)
  getAllReturns = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status,
        orderId,
        type,
        page,
        limit,
      } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (orderId) filters.orderId = orderId as string;
      if (type) filters.type = type as string;

      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };

      const result = await this.repo.getAllReturns(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: {
          returns: result.returns,
          total: result.total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
        message: 'Returns fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Returns fetch error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching returns',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}