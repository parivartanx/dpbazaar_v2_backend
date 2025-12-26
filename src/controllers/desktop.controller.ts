import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { ProductRepository } from '../repositories/prisma/ProductRepository';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { AuthService } from '../services/auth.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class DesktopController {
  private productRepo = new ProductRepository();
  private orderRepo = new OrderRepository();
  private userRepo = new UserRepository();
  private authService = new AuthService(this.userRepo);

  // Product search API with infinite scroll
  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        barcode,
        category
        // sortBy and sortOrder are not used in this implementation
      } = req.query;

      // Build search filters
      const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      // Add search term if provided
      if (search) {
        filters.search = search as string;
      }

      // Add category filter if provided
      if (category) {
        filters.category = category as string;
      }

      // Add barcode search if provided
      if (barcode) {
        // For barcode search, we'll search in the barcode field specifically
        filters.barcode = barcode as string;
      }

      const { products, totalCount } = await this.productRepo.getAllWithFilters(filters);

      const response: ApiResponse = {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: filters.page,
            totalPages: Math.ceil(totalCount / filters.limit),
            totalCount,
            hasNextPage: filters.page < Math.ceil(totalCount / filters.limit),
            hasPrevPage: filters.page > 1
          }
        },
        message: 'Products retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in searchProducts: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching products',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Bill history API with infinite scroll
  getBillHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        userId,
        startDate,
        endDate
        // sortBy and sortOrder are not used in this implementation
      } = req.query;

      // Build filters for orders
      const filters: any = {
        source: 'SYSTEM' // Only system-generated bills for desktop app
      };

      // Add date filters if provided
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }

      // Add search term if provided
      if (search) {
        filters.search = search as string;
      }

      // If userId is provided, filter by createdBy (the user who created the order)
      if (userId) {
        filters.createdBy = userId as string;
      }

      const pagination = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      const result = await this.orderRepo.getAllOrders(filters, pagination);

      // Transform orders to include only essential fields for desktop bill history
      const simplifiedBills = result.orders.map(order => {
        // Type assertion to handle the limited fields from the repository
        const typedOrder: any = order;
        
        // Calculate item count from the items array
        const itemCount = Array.isArray(typedOrder.items) ? typedOrder.items.length : 0;
        
        // Try to determine payment method from the order data
        // Since we don't have direct payment method in the limited order, 
        // we can infer it from the source (SYSTEM orders are typically cash)
        const paymentMethod = typedOrder.source === 'SYSTEM' ? 'CASH' : 'OTHER';
        
        return {
          id: typedOrder.id,
          orderNumber: typedOrder.orderNumber,
          customerId: typedOrder.customerId,
          customerName: typedOrder.customerName,
          customerPhone: typedOrder.customerPhone,
          itemsTotal: typedOrder.itemsTotal,
          taxAmount: typedOrder.taxAmount,
          shippingCharges: typedOrder.shippingCharges,
          discount: typedOrder.discount,
          totalAmount: typedOrder.totalAmount,
          status: typedOrder.status,
          paymentStatus: typedOrder.paymentStatus,
          paymentMethod: paymentMethod, // Add payment method
          source: typedOrder.source,
          createdAt: typedOrder.createdAt,
          updatedAt: typedOrder.updatedAt,
          itemCount: itemCount, // Just the count instead of full items array
          // Remove the nested customer object since we already have the details at the main level
        };
      });

      const response: ApiResponse = {
        success: true,
        data: {
          bills: simplifiedBills,
          pagination: {
            currentPage: pagination.page,
            totalPages: Math.ceil(result.total / pagination.limit),
            totalCount: result.total,
            hasNextPage: pagination.page < Math.ceil(result.total / pagination.limit),
            hasPrevPage: pagination.page > 1
          }
        },
        message: 'Bill history retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getBillHistory: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching bill history',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Dashboard data API
  getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, userId } = req.query;

      // Parse dates
      const start = startDate ? new Date(startDate as string) : new Date();
      start.setDate(start.getDate() - 30); // Default to last 30 days
      const end = endDate ? new Date(endDate as string) : new Date();

      // Build filters for orders
      const filters: any = {
        source: 'SYSTEM',
        startDate: start,
        endDate: end
      };

      // If userId is provided, filter by createdBy
      if (userId) {
        filters.createdBy = userId as string;
      }

      // Get orders for the date range
      const orderResult = await this.orderRepo.getAllOrders(filters);

      // Calculate dashboard metrics
      let totalSales = 0;
      let totalBills = 0;
      let itemsSold = 0;
      let cashPayments = 0;
      let onlinePayments = 0;
      let walletPayments = 0;
      let totalReturns = 0;
      let totalReturnAmount = 0;

      // Process orders to calculate metrics
      orderResult.orders.forEach(order => {
        totalSales += Number(order.totalAmount);
        totalBills += 1;
        
        // Sum items sold (if items are included)
        if (Array.isArray((order as any).items)) {
          (order as any).items.forEach((item: any) => {
            itemsSold += item.quantity;
          });
        }
        
        // Payment method distribution (simplified)
        // In a real implementation, you would check actual payment records
        if (order.source === 'SYSTEM') {
          cashPayments += 1; // Simplified assumption
        } else {
          onlinePayments += 1;
        }
      });

      // Calculate average bill value
      const avgBillValue = totalBills > 0 ? totalSales / totalBills : 0;

      const response: ApiResponse = {
        success: true,
        data: {
          kpis: {
            totalSales,
            totalBills,
            avgBillValue,
            itemsSold,
            cashPayments,
            onlinePayments,
            walletPayments,
            totalReturns,
            totalReturnAmount
          },
          dateRange: {
            startDate: start.toISOString(),
            endDate: end.toISOString()
          }
        },
        message: 'Dashboard data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDashboardData: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching dashboard data',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Daily sales graph API (last week)
  getDailySales = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.query;

      // Get last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

      // Build filters
      const filters: any = {
        source: 'SYSTEM',
        startDate,
        endDate
      };

      // If userId is provided, filter by createdBy
      if (userId) {
        filters.createdBy = userId as string;
      }

      // Get orders for the date range
      const result = await this.orderRepo.getAllOrders(filters);

      // Group by day
      const dailySales: { [key: string]: { date: string; sales: number; orders: number } } = {};

      // Initialize all days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (dateStr) {
          dailySales[dateStr] = { date: dateStr, sales: 0, orders: 0 };
        }
      }

      // Aggregate data
      result.orders.forEach(order => {
        const dateStr = order.createdAt.toISOString().split('T')[0];
        if (dateStr && dailySales[dateStr]) {
          dailySales[dateStr].sales += Number(order.totalAmount);
          dailySales[dateStr].orders += 1;
        }
      });

      // Convert to array and sort
      const salesData = Object.values(dailySales).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const response: ApiResponse = {
        success: true,
        data: {
          dailySales: salesData
        },
        message: 'Daily sales data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getDailySales: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching daily sales data',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Payment methods distribution API
  getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.query;

      // Build filters
      const filters: any = {
        source: 'SYSTEM'
      };

      // If userId is provided, filter by createdBy
      if (userId) {
        filters.createdBy = userId as string;
      }

      // Get all orders with payment information
      const result = await this.orderRepo.getAllOrders(filters);

      // Count payment methods
      const paymentMethods: Record<string, { count: number; amount: number }> = {
        CASH: { count: 0, amount: 0 },
        ONLINE: { count: 0, amount: 0 },
        WALLET: { count: 0, amount: 0 }
      };

      result.orders.forEach(order => {
        // For simplicity, we're assuming SYSTEM source means CASH
        // In a real implementation, you would check actual payment records
        const method = order.source === 'SYSTEM' ? 'CASH' : 'ONLINE';
        
        if (!paymentMethods[method]) {
          paymentMethods[method] = { count: 0, amount: 0 };
        }
        
        paymentMethods[method].count += 1;
        paymentMethods[method].amount += Number(order.totalAmount);
      });

      const response: ApiResponse = {
        success: true,
        data: {
          paymentMethods
        },
        message: 'Payment methods distribution retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getPaymentMethods: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching payment methods distribution',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get bill by order number API
  getBillByOrderNumber = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderNumber } = req.params;

      if (!orderNumber) {
        const response: ApiResponse = {
          success: false,
          error: 'Order number is required',
          message: 'Order number parameter is missing',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const order = await this.orderRepo.getOrderByOrderNumber(orderNumber);

      if (!order) {
        const response: ApiResponse = {
          success: false,
          error: 'Order not found',
          message: 'No order found with the provided order number',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { bill: order },
        message: 'Bill retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getBillByOrderNumber: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching bill by order number',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Monthly trend API
  getMonthlyTrend = async (req: Request, res: Response): Promise<void> => {
    try {
      // const { userId } = req.query; // Not used in this implementation

      // Get last 12 months of data
      const months = 12;
      const monthlyStats = await this.orderRepo.getMonthlyOrderStats(months);

      // If userId is provided, we would need to filter by createdBy
      // This would require modifying the repository method to accept filters
      // For now, we'll return all data

      const response: ApiResponse = {
        success: true,
        data: {
          monthlyTrend: monthlyStats
        },
        message: 'Monthly trend data retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getMonthlyTrend: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching monthly trend data',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Create order API for desktop sales
  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId, items, shippingAddressId, billingAddressId, customerNotes, discountCode, paymentMethod, paymentDetails, customerName, customerPhone } = req.body;

      // Counter sale: if no customerId provided, create customer based on phone number
      let finalCustomerId = customerId;
      if (!customerId && customerPhone) {
        finalCustomerId = await this.createOrGetCustomer(customerPhone, customerName);
      }

      // Validate required fields
      if (!finalCustomerId || !items || !Array.isArray(items) || items.length === 0) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required fields',
          message: 'customerId (or customerPhone) and items are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Validate item structure
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          const response: ApiResponse = {
            success: false,
            error: 'Invalid item structure',
            message: 'Each item must have a valid productId and quantity',
            timestamp: new Date().toISOString(),
          };
          res.status(400).json(response);
          return;
        }
      }

      // Get the user who is creating the order (from authentication middleware)
      const createdBy = (req as any).user?.userId || null;

      // Prepare order data
      const orderData = {
        customerId: finalCustomerId,
        items,
        shippingAddressId: shippingAddressId || undefined, // Optional for SYSTEM orders
        billingAddressId: billingAddressId || undefined, // Optional for SYSTEM orders
        customerNotes,
        discountCode,
        source: 'SYSTEM' as const, // Set source as SYSTEM for desktop orders
        deviceInfo: {
          platform: 'desktop',
          userAgent: req.get('User-Agent'),
        },
        ...(createdBy && { createdBy }), // Add createdBy if user is authenticated
      };

      // Create the order
      const order = await this.orderRepo.createOrder(orderData);
      
      // Create payment record if payment method is provided
      if (paymentMethod) {
        await this.createPayment(order.id, order.totalAmount, paymentMethod, paymentDetails);
      }

      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createOrder: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating order',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Helper method to create or get customer by phone number
  private async createOrGetCustomer(phone: string, name?: string): Promise<string> {
    // Try to find existing customer by phone
    const existingUsers = await prisma.user.findMany({
      where: { phone },
      include: { customer: true }
    });
    
    const existingCustomer = existingUsers.find(user => user.customer);
    
    if (existingCustomer && existingCustomer.customer) {
      return existingCustomer.customer.id;
    }
    
    // If customer doesn't exist, create a new counter customer
    const counterCustomerName = name || `CounterUser${Date.now()}`;
    
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        firstName: counterCustomerName,
        lastName: '',
        email: `counteruser${Date.now()}@example.com`,
        phone,
        password: await bcrypt.hash('defaultPassword123', 10),
        role: 'CUSTOMER',
      }
    });
    
    // Create customer record
    const customer = await prisma.customer.create({
      data: {
        userId: newUser.id,
        customerCode: `CUST${Date.now()}`,
        firstName: counterCustomerName,
        lastName: '',
      }
    });
    
    return customer.id;
  }
  
  // Helper method to create payment record
  private async createPayment(orderId: string, amount: any, method: string, details?: any): Promise<void> {
    // Verify that the order exists before creating payment
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });
    
    if (!order) {
      throw new Error(`Order with ID ${orderId} does not exist when creating payment`);
    }
    
    await prisma.payment.create({
      data: {
        order: {
          connect: { id: orderId }
        },
        amount: Number(amount),
        cash: Number(details?.cash) || 0,
        online: Number(details?.online) || 0,
        method: method as any, // Type assertion for payment method
        status: 'SUCCESS',
        gatewayName: details?.gatewayName || 'CASH',
        gatewayPaymentId: details?.gatewayPaymentId || null,
        currency: 'INR',
        paidAt: new Date(),
      }
    });
    
    // Update order payment status
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');
  }
  
  // Top selling products API
  getTopSellingProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get top 10 products by sales count
      const topProducts = await this.productRepo.getBestSellers();

      // Limit to 10 products
      const limitedProducts = topProducts.slice(0, 10);

      const response: ApiResponse = {
        success: true,
        data: {
          topProducts: limitedProducts
        },
        message: 'Top selling products retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getTopSellingProducts: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching top selling products',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Authentication APIs
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        throw new Error('Email, password and role are required');
      }

      const result = await this.authService.login({ email, password, role });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Login error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        message: 'Login failed',
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Implementation for logout
      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Logout error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: 'Logout failed',
        message: 'Logout failed',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const refreshToken = authHeader && authHeader.split(' ')[1];

      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }

      const result = await this.authService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Token refreshed successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Token refresh error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
        message: 'Token refresh failed',
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
    }
  };
}