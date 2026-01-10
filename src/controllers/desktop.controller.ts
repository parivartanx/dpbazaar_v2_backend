import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { ProductRepository } from '../repositories/prisma/ProductRepository';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { AuthService } from '../services/auth.service';
import { PaymentService } from '../services/payment.service';
import { prisma } from '../config/prismaClient';
import bcrypt from 'bcryptjs';
import { smsService } from '../services/sms.service';
import { USER_FIELDS_SELECT } from '../repositories/constants';

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
        
        // Get payment method from payments array (most recent payment)
        let paymentMethod = 'CASH'; // Default to CASH for SYSTEM orders
        if (typedOrder.payments && Array.isArray(typedOrder.payments) && typedOrder.payments.length > 0) {
          const latestPayment = typedOrder.payments[0]; // Already ordered by createdAt desc
          paymentMethod = latestPayment.method || 'CASH';
        }
        
        // Extract creator information
        let creator = null;
        if (typedOrder.creator) {
          creator = {
            id: typedOrder.creator.id,
            name: `${typedOrder.creator.firstName || ''} ${typedOrder.creator.lastName || ''}`.trim(),
            email: typedOrder.creator.email,
            role: typedOrder.creator.role,
          };
        }
        
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
          paymentMethod: paymentMethod,
          source: typedOrder.source,
          createdAt: typedOrder.createdAt,
          updatedAt: typedOrder.updatedAt,
          itemCount: itemCount,
          createdBy: typedOrder.createdBy,
          creator: creator,
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
  
  // Bill history Excel export API
  getBillHistoryExcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        search,
        userId,
        startDate,
        endDate
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
      
      // Get all bills without pagination for Excel export
      const pagination = {
        page: 1,
        limit: 10000, // Large limit for export
      };
      
      const result = await this.orderRepo.getAllOrders(filters, pagination);
      
      // Transform orders to include only essential fields for desktop bill history
      const simplifiedBills = result.orders.map(order => {
        // Type assertion to handle the limited fields from the repository
        const typedOrder: any = order;
        
        // Calculate item count from the items array
        const itemCount = Array.isArray(typedOrder.items) ? typedOrder.items.length : 0;
        
        // Get payment method from payments array (most recent payment)
        let paymentMethod = 'CASH'; // Default to CASH for SYSTEM orders
        if (typedOrder.payments && Array.isArray(typedOrder.payments) && typedOrder.payments.length > 0) {
          const latestPayment = typedOrder.payments[0]; // Already ordered by createdAt desc
          paymentMethod = latestPayment.method || 'CASH';
        }
        
        // Extract creator information
        let creatorName = '';
        let creatorEmail = '';
        let creatorRole = '';
        if (typedOrder.creator) {
          creatorName = `${typedOrder.creator.firstName || ''} ${typedOrder.creator.lastName || ''}`.trim();
          creatorEmail = typedOrder.creator.email || '';
          creatorRole = typedOrder.creator.role || '';
        }
        
        return {
          id: typedOrder.id,
          orderNumber: typedOrder.orderNumber,
          customerName: typedOrder.customerName,
          customerPhone: typedOrder.customerPhone,
          itemsTotal: typedOrder.itemsTotal,
          taxAmount: typedOrder.taxAmount,
          shippingCharges: typedOrder.shippingCharges,
          discount: typedOrder.discount,
          totalAmount: typedOrder.totalAmount,
          status: typedOrder.status,
          paymentStatus: typedOrder.paymentStatus,
          paymentMethod: paymentMethod,
          itemCount: itemCount,
          createdAt: typedOrder.createdAt,
          updatedAt: typedOrder.updatedAt,
          creatorName: creatorName,
          creatorEmail: creatorEmail,
          creatorRole: creatorRole,
        };
      });
      
      // Format dates to IST
      const formatISTDate = (date: Date | string | null | undefined) => {
        if (!date) return '';
        const d = new Date(date);
        // Convert to IST (GMT+5:30)
        const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
        return istDate.toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
      };
      
      // Prepare Excel data
      const excelData = simplifiedBills.map(bill => [
        bill.orderNumber,
        bill.customerName,
        bill.customerPhone,
        bill.itemsTotal,
        bill.taxAmount,
        bill.shippingCharges,
        bill.discount,
        bill.totalAmount,
        bill.status,
        bill.paymentStatus,
        bill.paymentMethod,
        bill.itemCount,
        bill.creatorName,
        bill.creatorEmail,
        bill.creatorRole,
        formatISTDate(bill.createdAt),
        formatISTDate(bill.updatedAt),
      ]);
      
      // Define headers for CSV
      const headers = [
        'Order Number',
        'Customer Name',
        'Customer Phone',
        'Items Total',
        'Tax Amount',
        'Shipping Charges',
        'Discount',
        'Total Amount',
        'Status',
        'Payment Status',
        'Payment Method',
        'Item Count',
        'Created By Name',
        'Created By Email',
        'Created By Role',
        'Created At',
        'Updated At'
      ];
      
      // Convert to CSV format for Excel
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => row.map(value => {
          if (value === null || value === undefined) {
            value = '';
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(','))
      ].join('\n');
      
      // Set response headers for Excel download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bill-history.csv');
      
      res.status(200).send(csvContent);
    } catch (error) {
      logger.error(`Error in getBillHistoryExcel: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in exporting bill history to Excel',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Helper function to round to 2 decimal places
  private roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };

  // Dashboard data API
  getDashboardData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, userId } = req.query;

      // Parse dates
      const start = startDate ? new Date(startDate as string) : new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 30); // Default to last 30 days
      const end = endDate ? new Date(endDate as string) : new Date();
      end.setHours(23, 59, 59, 999);

      // Calculate previous period for percentage changes
      const periodDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - periodDays);
      const prevEnd = new Date(start);
      prevEnd.setTime(prevEnd.getTime() - 1);

      // Build where clause for orders
      const whereClause: any = {
        source: 'SYSTEM',
        createdAt: {
          gte: start,
          lte: end
        }
      };

      if (userId) {
        whereClause.createdBy = userId as string;
      }

      // Build where clause for previous period
      const prevWhereClause: any = {
        source: 'SYSTEM',
        createdAt: {
          gte: prevStart,
          lte: prevEnd
        }
      };

      if (userId) {
        prevWhereClause.createdBy = userId as string;
      }

      // Fetch orders with payments and items for current period
      const [orders, prevOrders, returns] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          include: {
            items: {
              select: {
                quantity: true,
                productName: true,
                productId: true,
                sellingPrice: true
              }
            },
            payments: {
              where: {
                status: 'SUCCESS'
              },
              select: {
                amount: true,
                cash: true,
                online: true,
                method: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.order.findMany({
          where: prevWhereClause,
          include: {
            payments: {
              where: {
                status: 'SUCCESS'
              },
              select: {
                amount: true
              }
            }
          }
        }),
        prisma.return.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end
            },
            order: {
              source: 'SYSTEM',
              ...(userId ? {
                createdBy: userId as string
              } : {})
            }
          },
          select: {
            refundAmount: true,
            status: true
          }
        })
      ]);

      // Calculate KPIs for current period
      let totalSales = 0;
      let totalBills = orders.length;
      let itemsSold = 0;
      let cashPayments = 0;
      let onlinePayments = 0;
      let walletPayments = 0;

      // Process orders to calculate metrics
      orders.forEach(order => {
        totalSales += Number(order.totalAmount);
        
        // Sum items sold
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            itemsSold += item.quantity || 0;
          });
        }
        
        // Calculate payment breakdown
        if (order.payments && order.payments.length > 0) {
          order.payments.forEach((payment: any) => {
            const amount = Number(payment.amount);
            const cash = Number(payment.cash || 0);
            const online = Number(payment.online || 0);

            // Check payment method
            if (payment.method === 'CASH' || payment.method === 'COD') {
              cashPayments += amount;
            } else if (payment.method === 'WALLET') {
              walletPayments += amount;
            } else {
              // ONLINE payment methods (CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, etc.)
              onlinePayments += amount;
            }

            // Also check cash/online fields if method is SPLIT
            if (payment.method === 'SPLIT') {
              if (cash > 0) cashPayments += cash;
              if (online > 0) onlinePayments += online;
            }
          });
        } else {
          // If no payment record, assume cash for SYSTEM orders
          cashPayments += Number(order.totalAmount);
        }
      });

      // Calculate returns
      const totalReturns = returns.length;
      const totalReturnAmount = returns.reduce((sum, ret) => {
        return sum + Number(ret.refundAmount || 0);
      }, 0);

      // Calculate previous period KPIs for percentage changes
      const prevTotalSales = prevOrders.reduce((sum, order) => {
        return sum + Number(order.totalAmount);
      }, 0);
      const prevTotalBills = prevOrders.length;

      // Calculate percentage changes
      const salesChangePercent = prevTotalSales > 0 
        ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 
        : 0;
      const billsChangePercent = prevTotalBills > 0 
        ? ((totalBills - prevTotalBills) / prevTotalBills) * 100 
        : 0;

      // Calculate average bill value
      const avgBillValue = totalBills > 0 ? totalSales / totalBills : 0;

      // Generate daily sales data (last 7 days including today)
      const dailySales: { day: string; sales: number }[] = [];
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(end);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const daySales = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= date && orderDate < nextDate;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount), 0);

        dailySales.push({
          day: daysOfWeek[date.getDay()] || 'Sun',
          sales: this.roundToTwoDecimals(daySales)
        });
      }

      // Generate monthly trend data (last 12 months)
      const monthlyTrend: { month: string; sales: number }[] = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(end);
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setMonth(nextDate.getMonth() + 1);

        const monthSales = orders
          .filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= date && orderDate < nextDate;
          })
          .reduce((sum, order) => sum + Number(order.totalAmount), 0);

        monthlyTrend.push({
          month: `${monthNames[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`,
          sales: this.roundToTwoDecimals(monthSales)
        });
      }

      // Calculate top selling products from order items in the date range
      const productSalesMap: { [key: string]: { name: string; quantity: number; price: number } } = {};
      
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productId = item.productId;
            if (!productSalesMap[productId]) {
              productSalesMap[productId] = {
                name: item.productName || 'Unknown Product',
                quantity: 0,
                price: Number(item.sellingPrice || 0)
              };
            }
            productSalesMap[productId].quantity += item.quantity || 0;
          });
        }
      });

      // Convert to array, sort by quantity, and take top 10
      const topSellingProducts = Object.entries(productSalesMap)
        .map(([productId, data]) => ({
          id: productId,
          name: data.name,
          quantity: data.quantity,
          price: this.roundToTwoDecimals(data.price)
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      // Payment methods breakdown for donut chart
      const paymentMethodsBreakdown = [
        {
          method: 'Cash',
          amount: this.roundToTwoDecimals(cashPayments),
          percentage: this.roundToTwoDecimals(totalSales > 0 ? (cashPayments / totalSales) * 100 : 0)
        },
        {
          method: 'Online',
          amount: this.roundToTwoDecimals(onlinePayments),
          percentage: this.roundToTwoDecimals(totalSales > 0 ? (onlinePayments / totalSales) * 100 : 0)
        },
        {
          method: 'Wallet',
          amount: this.roundToTwoDecimals(walletPayments),
          percentage: this.roundToTwoDecimals(totalSales > 0 ? (walletPayments / totalSales) * 100 : 0)
        }
      ].filter(pm => pm.amount > 0); // Only include methods with payments

      const response: ApiResponse = {
        success: true,
        data: {
          kpis: {
            totalSales: this.roundToTwoDecimals(totalSales),
            totalBills,
            avgBillValue: this.roundToTwoDecimals(avgBillValue),
            itemsSold,
            salesChangePercent: this.roundToTwoDecimals(salesChangePercent),
            billsChangePercent: this.roundToTwoDecimals(billsChangePercent)
          },
          paymentBreakdown: {
            cashPayments: this.roundToTwoDecimals(cashPayments),
            onlinePayments: this.roundToTwoDecimals(onlinePayments),
            walletPayments: this.roundToTwoDecimals(walletPayments),
            totalReturns,
            totalReturnAmount: this.roundToTwoDecimals(totalReturnAmount)
          },
          dailySales,
          monthlyTrend,
          topSellingProducts,
          paymentMethods: paymentMethodsBreakdown,
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

      // Transform the order data to avoid duplicate/unnecessary information
      const orderWithIncludes = order as any;
      
      // Transform items to include only necessary fields and add return status
      const transformedItems = orderWithIncludes.items.map((item: any) => {
        // Calculate total quantity already returned for this order item
        let totalReturnedQuantity = item.refundedQuantity || 0; // Use the refundedQuantity from the order item
        
        // Calculate available quantity for return
        const availableForReturn = item.quantity - totalReturnedQuantity;
        
        // Determine if this item can be returned
        const canReturn = availableForReturn > 0;
        
        // Create a simplified item with only necessary fields
        return {
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          variantId: item.variantId,
          productName: item.productName,
          productSku: item.productSku,
          variantName: item.variantName,
          productImage: item.productImage,
          mrp: item.mrp,
          sellingPrice: item.sellingPrice,
          quantity: item.quantity,
          discount: item.discount,
          taxRate: item.taxRate,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount,
          status: item.status,
          refundedQuantity: item.refundedQuantity,
          isReturned: item.isReturned,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          returnStatus: {
            totalOrdered: item.quantity,
            totalReturned: totalReturnedQuantity,
            availableForReturn: availableForReturn,
            canReturn: canReturn,
          }
        };
      });
      
      // Transform returns to include only necessary fields
      const transformedReturns = (orderWithIncludes.returns || []).map((ret: any) => ({
        id: ret.id,
        orderId: ret.orderId,
        returnNumber: ret.returnNumber,
        type: ret.type,
        reason: ret.reason,
        detailedReason: ret.detailedReason,
        status: ret.status,
        customerComments: ret.customerComments,
        images: ret.images,
        pickupAddress: ret.pickupAddress,
        pickupScheduledDate: ret.pickupScheduledDate,
        pickupCompletedAt: ret.pickupCompletedAt,
        inspectionNotes: ret.inspectionNotes,
        inspectionCompletedAt: ret.inspectionCompletedAt,
        inspectedBy: ret.inspectedBy,
        refundAmount: ret.refundAmount,
        refundMethod: ret.refundMethod,
        exchangeOrderId: ret.exchangeOrderId,
        approvedAt: ret.approvedAt,
        rejectedAt: ret.rejectedAt,
        processedAt: ret.processedAt,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
        source: ret.source,
        createdBy: ret.createdBy
      }));
      
      // Get payment method from payments array (most recent payment)
      let paymentMethod = 'CASH'; // Default to CASH for SYSTEM orders
      if (orderWithIncludes.payments && Array.isArray(orderWithIncludes.payments) && orderWithIncludes.payments.length > 0) {
        // Payments are already ordered by createdAt desc from repository
        const latestPayment = orderWithIncludes.payments[0];
        paymentMethod = latestPayment.method || 'CASH';
      }
      
      // Extract creator information
      let creator = null;
      if (orderWithIncludes.creator) {
        creator = {
          id: orderWithIncludes.creator.id,
          name: `${orderWithIncludes.creator.firstName || ''} ${orderWithIncludes.creator.lastName || ''}`.trim(),
          email: orderWithIncludes.creator.email,
          role: orderWithIncludes.creator.role,
        };
      }
      
      const orderWithReturnStatus = {
        id: orderWithIncludes.id,
        orderNumber: orderWithIncludes.orderNumber,
        customerId: orderWithIncludes.customerId,
        vendorId: orderWithIncludes.vendorId,
        itemsTotal: orderWithIncludes.itemsTotal,
        taxAmount: orderWithIncludes.taxAmount,
        shippingCharges: orderWithIncludes.shippingCharges,
        codCharges: orderWithIncludes.codCharges,
        discount: orderWithIncludes.discount,
        totalAmount: orderWithIncludes.totalAmount,
        status: orderWithIncludes.status,
        paymentStatus: orderWithIncludes.paymentStatus,
        paymentMethod: paymentMethod,
        shippingAddress: orderWithIncludes.shippingAddress,
        billingAddress: orderWithIncludes.billingAddress,
        customerName: orderWithIncludes.customerName,
        customerEmail: orderWithIncludes.customerEmail,
        customerPhone: orderWithIncludes.customerPhone,
        customerNotes: orderWithIncludes.customerNotes,
        adminNotes: orderWithIncludes.adminNotes,
        trackingNumber: orderWithIncludes.trackingNumber,
        courierPartner: orderWithIncludes.courierPartner,
        confirmedAt: orderWithIncludes.confirmedAt,
        packedAt: orderWithIncludes.packedAt,
        shippedAt: orderWithIncludes.shippedAt,
        deliveredAt: orderWithIncludes.deliveredAt,
        cancelledAt: orderWithIncludes.cancelledAt,
        returnRequestedAt: orderWithIncludes.returnRequestedAt,
        createdBy: orderWithIncludes.createdBy,
        creator: creator,
        source: orderWithIncludes.source,
        deviceInfo: orderWithIncludes.deviceInfo,
        metadata: orderWithIncludes.metadata,
        createdAt: orderWithIncludes.createdAt,
        updatedAt: orderWithIncludes.updatedAt,
        items: transformedItems,

        // Include the actual returns array for frontend access
        returns: transformedReturns
      };

      const response: ApiResponse = {
        success: true,
        data: { bill: orderWithReturnStatus },
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
        // For wallet payments, we need to verify the customer first
        if (paymentMethod === 'WALLET' && customerPhone) {
          // Verify customer exists and has sufficient wallet balance
          const user = await prisma.user.findFirst({
            where: { phone: customerPhone },
            include: {
              customer: {
                include: {
                  user: {
                    select: USER_FIELDS_SELECT,
                  },
                },
              },
            },
          });
          
          if (!user || !user.customer) {
            const response: ApiResponse = {
              success: false,
              error: 'Customer not found',
              message: 'Customer not found for wallet payment',
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
          
          // Check if customer has sufficient wallet balance
          const wallet = await prisma.wallet.findFirst({
            where: { customerId: user.customer.id }
          });
          
          if (!wallet || Number(wallet.balance) < Number(order.totalAmount)) {
            const response: ApiResponse = {
              success: false,
              error: 'Insufficient wallet balance',
              message: 'Customer does not have sufficient balance in wallet',
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
          
          // Process wallet payment using the payment service
          const paymentService = new PaymentService();
          try {
            await paymentService.processPayment({
              orderId: order.id,
              amount: Number(order.totalAmount),
              paymentMethod: 'WALLET',
              customerId: user.customer.id,
            });
          } catch (paymentError) {
            const response: ApiResponse = {
              success: false,
              error: (paymentError as Error).message,
              message: 'Failed to process wallet payment',
              timestamp: new Date().toISOString(),
            };
            res.status(500).json(response);
            return;
          }
        } else {
          // For other payment methods, use the existing createPayment method
          await this.createPayment(order.id, order.totalAmount, paymentMethod, paymentDetails);
        }
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
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
                phone: true,
                username: true,
                role: true,
                status: true,
                isEmailVerified: true,
                isPhoneVerified: true,
                isTwoFactorEnabled: true,
                dateOfBirth: true,
                gender: true,
                avatar: true,
                bio: true,
                lastLoginAt: true,
                lastLoginIp: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
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
    
    // Create customer record (firstName/lastName are now in User, not Customer)
    const customer = await prisma.customer.create({
      data: {
        userId: newUser.id,
        customerCode: `CUST${Date.now()}`,
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
    
    // Update order status to CONFIRMED
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');
    
    // Update order's payment status to SUCCESS
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'SUCCESS' },
    });
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

  // Get all discounts API
  getAllDiscounts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get query parameters for filtering and pagination
      const {
        page = 1,
        limit = 20,
        search,
        isActive,
        type
      } = req.query;

      // Build filters for discounts
      const filters: any = {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      };

      // Add search filter if provided
      if (search) {
        filters.search = search as string;
      }

      // Add active status filter if provided
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }

      // Add discount type filter if provided
      if (type) {
        filters.type = type as string;
      }

      // Fetch discounts from the database
      const discounts = await prisma.discount.findMany({
        where: {
          AND: [
            filters.search ? {
              OR: [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
              ]
            } : {},
            filters.isActive !== undefined ? { isActive: filters.isActive } : {},
            filters.type ? { type: filters.type } : {}
          ]
        },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'desc' }
      });

      // Since Prisma doesn't directly support filtering by array values in include,
      // we need to fetch related data separately and attach it to each discount
      const discountsWithDetails = await Promise.all(discounts.map(async (discount) => {
        // Get detailed information for applicable categories
        const categories = discount.applicableCategories && discount.applicableCategories.length > 0
          ? await prisma.category.findMany({
              where: { id: { in: discount.applicableCategories } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        // Get detailed information for applicable products
        const products = discount.applicableProducts && discount.applicableProducts.length > 0
          ? await prisma.product.findMany({
              where: { id: { in: discount.applicableProducts } },
              select: { id: true, name: true, sku: true, slug: true }
            })
          : [];
        
        // Get detailed information for applicable brands
        const brands = discount.applicableBrands && discount.applicableBrands.length > 0
          ? await prisma.brand.findMany({
              where: { id: { in: discount.applicableBrands } },
              select: { id: true, name: true, slug: true }
            })
          : [];
        
        // Return discount with detailed applicable information
        return {
          ...discount,
          applicableCategories: categories, // Replace IDs with full category objects
          applicableProducts: products,     // Replace IDs with full product objects
          applicableBrands: brands          // Replace IDs with full brand objects
        };
      }));

      // Get total count for pagination
      const totalCount = await prisma.discount.count({
        where: {
          AND: [
            filters.search ? {
              OR: [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
              ]
            } : {},
            filters.isActive !== undefined ? { isActive: filters.isActive } : {},
            filters.type ? { type: filters.type } : {}
          ]
        }
      });

      const response: ApiResponse = {
        success: true,
        data: {
          discounts: discountsWithDetails,
          pagination: {
            currentPage: filters.page,
            totalPages: Math.ceil(totalCount / filters.limit),
            totalCount,
            hasNextPage: filters.page < Math.ceil(totalCount / filters.limit),
            hasPrevPage: filters.page > 1
          }
        },
        message: 'Discounts retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllDiscounts: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching discounts',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Get customer wallet details by mobile number
  getCustomerWalletByMobile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mobileNumber } = req.params;
      
      // Find user by mobile number first, then get related customer
      const user = await prisma.user.findFirst({
        where: {
          phone: mobileNumber || '',
        },
        include: {
          customer: {
            include: {
              user: {
                select: USER_FIELDS_SELECT,
              },
            },
          },
        },
      });
      
      if (!user || !user.customer) {
        const response: ApiResponse = {
          success: false,
          error: 'Customer not found',
          message: 'No customer found with this mobile number',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Find customer's wallet
      const wallet = await prisma.wallet.findFirst({
        where: {
          customerId: user.customer.id
        }
      });
      
      if (!wallet) {
        const response: ApiResponse = {
          success: false,
          error: 'Wallet not found',
          message: 'Customer does not have a wallet',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: {
          customer: {
            id: user.customer.id,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            email: user.email,
          },
          wallet: {
            id: wallet.id,
            balance: wallet.balance,
            type: wallet.type,
            createdAt: wallet.createdAt,
          }
        },
        message: 'Customer wallet retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getCustomerWalletByMobile: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching customer wallet',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Send OTP for wallet payment verification
  sendOtpForWalletPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mobileNumber } = req.body;
      
      // Validate mobile number
      if (!mobileNumber) {
        const response: ApiResponse = {
          success: false,
          error: 'Mobile number is required',
          message: 'Mobile number is required to send OTP',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find user by mobile number
      const user = await prisma.user.findFirst({
        where: {
          phone: mobileNumber,
        },
        include: {
          customer: true
        }
      });
      
      if (!user || !user.customer) {
        const response: ApiResponse = {
          success: false,
          error: 'Customer not found',
          message: 'No customer found with this mobile number',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set OTP to expire in 5 minutes
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      // Check if an OTP record already exists for this phone and type
      const existingOtp = await prisma.otp.findFirst({
        where: {
          phone: mobileNumber,
          type: 'WALLET',
        }
      });
      
      if (existingOtp) {
        // Update the existing OTP record
        await prisma.otp.update({
          where: { id: existingOtp.id },
          data: {
            otp,
            status: 'PENDING',
            expiresAt,
            updatedAt: new Date(),
          }
        });
      } else {
        // Create a new OTP record
        await prisma.otp.create({
          data: {
            phone: mobileNumber,
            email: user.email,
            otp,
            type: 'WALLET',
            status: 'PENDING',
            expiresAt,
          }
        });
      }
      
      let response: ApiResponse;
      
      // Send OTP via SMS service
      try {
        await smsService.sendOtp(mobileNumber, otp);
        
        response = {
          success: true,
          data: {
            message: 'OTP sent successfully',
            phone: mobileNumber,
            // In production, we would not return the OTP in the response
            // For development/testing purposes only
            otp: otp,
          },
          message: 'OTP sent successfully',
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        logger.error(`Failed to send OTP via SMS: ${error}`);
        
        // In case of SMS failure, still return success but log the error
        response = {
          success: true,
          data: {
            message: 'OTP generated but SMS sending failed',
            phone: mobileNumber,
            // Still return OTP for development/testing purposes
            otp: otp,
          },
          message: 'OTP generated but SMS sending failed',
          timestamp: new Date().toISOString(),
        };
      }
      
      res.status(200).json(response);
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in sendOtpForWalletPayment: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in sending OTP',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Verify OTP and get wallet details
  verifyOtpAndGetWalletDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mobileNumber, otp } = req.body;
      
      // Validate required fields
      if (!mobileNumber || !otp) {
        const response: ApiResponse = {
          success: false,
          error: 'Mobile number and OTP are required',
          message: 'Mobile number and OTP are required to verify and get wallet details',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find user by mobile number first, then get related customer
      const user = await prisma.user.findFirst({
        where: {
          phone: mobileNumber || '',
        },
        include: {
          customer: {
            include: {
              user: {
                select: USER_FIELDS_SELECT,
              },
            },
          },
        },
      });
      
      if (!user || !user.customer) {
        const response: ApiResponse = {
          success: false,
          error: 'Customer not found',
          message: 'No customer found with this mobile number',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Find the OTP record
      const otpRecord = await prisma.otp.findFirst({
        where: {
          phone: mobileNumber,
          otp: otp,
          type: 'WALLET',
          status: 'PENDING',
          expiresAt: {
            gte: new Date() // Not expired
          }
        }
      });
      
      if (!otpRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid or expired OTP',
          message: 'The OTP provided is invalid, expired, or already used',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find customer's wallet
      const wallet = await prisma.wallet.findFirst({
        where: {
          customerId: user.customer.id
        }
      });
      
      if (!wallet) {
        const response: ApiResponse = {
          success: false,
          error: 'Wallet not found',
          message: 'Customer does not have a wallet',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Update the OTP record to mark as verified
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      const response: ApiResponse = {
        success: true,
        data: {
          customer: {
            id: user.customer.id,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            email: user.email,
          },
          wallet: {
            id: wallet.id,
            balance: wallet.balance,
            type: wallet.type,
            createdAt: wallet.createdAt,
          }
        },
        message: 'OTP verified successfully and wallet details retrieved',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in verifyOtpAndGetWalletDetails: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in verifying OTP or fetching wallet details',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Create return API for desktop manager (processes actual return)
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
      
      // If return items are provided, validate them
      if (returnData.items && Array.isArray(returnData.items) && returnData.items.length > 0) {
        for (const item of returnData.items) {
          if (!item.orderItemId || !item.quantity || item.quantity <= 0) {
            const response: ApiResponse = {
              success: false,
              message: 'Each return item must have a valid orderItemId and quantity',
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
        }
      }
        
      // Generate return number
      const returnNumber = `RET-${Date.now()}`;
        
      // Get the user who is creating the return (from authentication middleware)
      const createdBy = (req as any).user?.userId || null;
        
      // Fetch the original order to calculate refund amount
      const originalOrder = await this.orderRepo.getOrderById(returnData.orderId);
      if (!originalOrder) {
        const response: ApiResponse = {
          success: false,
          message: 'Original order not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      let calculatedRefundAmount = 0;
      
      // If return items are provided, calculate the refund amount
      if (returnData.items && Array.isArray(returnData.items) && returnData.items.length > 0) {
        // Type assertion to handle the items array
        const orderItems = (originalOrder as any).items;
        
        if (!orderItems || !Array.isArray(orderItems)) {
          const response: ApiResponse = {
            success: false,
            message: 'Original order items not found',
            timestamp: new Date().toISOString(),
          };
          res.status(400).json(response);
          return;
        }
        
        // Calculate refund amount based on returned items
        for (const returnItem of returnData.items) {
          const orderItem = orderItems.find((item: any) => item.id === returnItem.orderItemId);
          
          if (!orderItem) {
            const response: ApiResponse = {
              success: false,
              message: `Order item with ID ${returnItem.orderItemId} not found in the original order`,
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
          
          // Calculate refund for this item: (sellingPrice * quantity returned)
          const itemRefund = Number(orderItem.sellingPrice) * returnItem.quantity;
          calculatedRefundAmount += itemRefund;
        }
      }
      
      // Determine refund method for counter return
      const refundMethod = returnData.refundMethod || 'CASH'; // Default to CASH for counter returns
      
      // Create return with immediate approval status since it's from desktop manager
      const returnRequest = await this.orderRepo.createReturn({
        ...returnData,
        returnNumber,
        status: 'APPROVED', // Immediate approval for desktop manager
        source: 'SYSTEM', // Mark as SYSTEM for desktop operations
        refundAmount: calculatedRefundAmount, // Set calculated refund amount
        refundMethod, // Set refund method (CASH, STORE_CREDIT, etc.)
        ...(createdBy && { createdBy }), // Add createdBy if user is authenticated
      });
        
      const response: ApiResponse = {
        success: true,
        data: { return: returnRequest },
        message: 'Return processed successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Return creation error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating return',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Get all returns API for desktop manager
  getReturns = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status,
        orderId,
        type,
        page,
        limit,
        search,
        startDate,
        endDate
      } = req.query;
  
      const filters: any = {};
      if (status) filters.status = status;
      if (orderId) filters.orderId = orderId as string;
      if (type) filters.type = type as string;
      if (search) filters.search = search as string;
        
      // Add date filters if provided
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }
        
      // For desktop, we might want to filter by the user who created the return
      const createdBy = (req as any).user?.userId || null;
      if (createdBy) {
        filters.createdBy = createdBy;
      }
            
      // Only return SYSTEM sourced returns for desktop (counter returns)
      filters.source = 'SYSTEM';
      
      const pagination = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      };
      
      const result = await this.orderRepo.getDesktopReturns(filters, pagination);
      
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
  
  // Get returns data in Excel format
  getReturnsExcel = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status,
        orderId,
        type,
        search,
        startDate,
        endDate
      } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (orderId) filters.orderId = orderId as string;
      if (type) filters.type = type as string;
      if (search) filters.search = search as string;
        
      // Add date filters if provided
      if (startDate) {
        filters.startDate = new Date(startDate as string);
      }
      if (endDate) {
        filters.endDate = new Date(endDate as string);
      }
        
      // For desktop, we might want to filter by the user who created the return
      const createdBy = (req as any).user?.userId || null;
      if (createdBy) {
        filters.createdBy = createdBy;
      }
            
      // Only return SYSTEM sourced returns for desktop (counter returns)
      filters.source = 'SYSTEM';
      
      // Get all returns without pagination for Excel export
      const pagination = {
        page: 1,
        limit: 10000, // Large limit for export
      };
      
      const result = await this.orderRepo.getDesktopReturns(filters, pagination);
      
      // Prepare Excel data
      const excelData = result.returns.map((returnItem: any) => {
        // Format dates to IST
        const formatISTDate = (date: Date | string | null | undefined) => {
          if (!date) return '';
          const d = new Date(date);
          // Convert to IST (GMT+5:30)
          const istDate = new Date(d.getTime() + (5.5 * 60 * 60 * 1000));
          return istDate.toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
        };
        
        return [
          returnItem.returnNumber,
          returnItem.type,
          returnItem.reason,
          returnItem.status,
          returnItem.refundAmount,
          returnItem.refundMethod,
          returnItem.order?.orderNumber,
          returnItem.order?.totalAmount,
          returnItem.order?.customerName,
          returnItem.order?.customerPhone,
          formatISTDate(returnItem.createdAt),
          formatISTDate(returnItem.updatedAt),
        ];
      });
      
      // Define headers for CSV
      const headers = [
        'Return Number',
        'Type',
        'Reason',
        'Status',
        'Refund Amount',
        'Refund Method',
        'Order Number',
        'Order Total',
        'Customer Name',
        'Customer Phone',
        'Created At',
        'Updated At'
      ];
      
      // Convert to CSV format for Excel
      const csvContent = [
        headers.join(','),
        ...excelData.map(row => row.map(value => {
          if (value === null || value === undefined) {
            value = '';
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(','))
      ].join('\n');
      
      // Set response headers for Excel download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=returns.csv');
      
      res.status(200).send(csvContent);
    } catch (error) {
      logger.error(`Returns Excel export error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in exporting returns to Excel',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
  
  // Verify OTP for payment
  verifyOtpForPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mobileNumber, otp, amount } = req.body;
      
      // Validate required fields
      if (!mobileNumber || !otp || !amount) {
        const response: ApiResponse = {
          success: false,
          error: 'Missing required fields',
          message: 'Mobile number, OTP, and amount are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find user by mobile number first, then get related customer
      const user = await prisma.user.findFirst({
        where: {
          phone: mobileNumber || '',
        },
        include: {
          customer: {
            include: {
              user: {
                select: USER_FIELDS_SELECT,
              },
            },
          },
        },
      });
      
      if (!user || !user.customer) {
        const response: ApiResponse = {
          success: false,
          error: 'Customer not found',
          message: 'No customer found with this mobile number',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      // Find the OTP record
      const otpRecord = await prisma.otp.findFirst({
        where: {
          phone: mobileNumber,
          otp: otp,
          type: 'PAYMENT',
          status: 'PENDING',
          expiresAt: {
            gte: new Date() // Not expired
          }
        }
      });
      
      if (!otpRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid or expired OTP',
          message: 'The provided OTP is invalid, expired, or already used',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Update the OTP record to mark as verified
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      // Check if the customer has sufficient balance in wallet
      const wallet = await prisma.wallet.findFirst({
        where: {
          customerId: user.customer.id
        }
      });
      
      if (!wallet) {
        const response: ApiResponse = {
          success: false,
          error: 'Wallet not found',
          message: 'Customer does not have a wallet',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }
      
      if (Number(wallet.balance) < Number(amount)) {
        const response: ApiResponse = {
          success: false,
          error: 'Insufficient balance',
          message: 'Customer does not have sufficient balance in wallet',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      const response: ApiResponse = {
        success: true,
        data: {
          verified: true,
          customerId: user.customer.id,
          amount: Number(amount),
          walletBalance: wallet.balance,
        },
        message: 'OTP verified successfully',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in verifyOtpForPayment: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in verifying OTP',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}