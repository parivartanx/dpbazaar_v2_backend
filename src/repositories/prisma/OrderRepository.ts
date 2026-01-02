import { Order, OrderStatus, PaymentStatus, Prisma, $Enums } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import {
  IOrderRepository,
  CreateOrderData,
  UpdateOrderData,
  OrderFilters,
  PaginationParams,
  DashboardStats,
  MonthlyStats,
  OrderCountByStatus,
  RevenueStats,
} from '../interfaces/IOrderRepository';


export class OrderRepository implements IOrderRepository {
  async createOrder(data: CreateOrderData): Promise<Order> {
    // Fetch customer details with addresses
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
        addresses: {
          where: { deletedAt: null },
        },
      },
    });

    if (!customer) {
      throw new Error(`Customer with ID ${data.customerId} not found`);
    }

    // Extract customer info
    const customerName = `${customer.firstName} ${customer.lastName}`.trim();
    const customerEmail = customer.user.email || '';
    const customerPhone = customer.user.phone || '';

    let shippingAddress: any;
    if (data.shippingAddressId) {
      // Fetch shipping address from customer's saved addresses
      const shippingAddressRecord = customer.addresses.find(
        a => a.id === data.shippingAddressId
      );
      if (!shippingAddressRecord) {
        throw new Error(`Shipping address with ID ${data.shippingAddressId} not found for this customer`);
      }

      shippingAddress = {
        fullName: shippingAddressRecord.fullName,
        phone: shippingAddressRecord.phone,
        alternatePhone: shippingAddressRecord.alternatePhone,
        addressLine1: shippingAddressRecord.addressLine1,
        addressLine2: shippingAddressRecord.addressLine2,
        landmark: shippingAddressRecord.landmark,
        city: shippingAddressRecord.city,
        state: shippingAddressRecord.state,
        country: shippingAddressRecord.country,
        postalCode: shippingAddressRecord.postalCode,
        deliveryInstructions: shippingAddressRecord.deliveryInstructions,
      };
    } else {
      // For SYSTEM orders (desktop), use a default address or customer's details
      shippingAddress = {
        fullName: customerName,
        phone: customerPhone,
        alternatePhone: null,
        addressLine1: 'Counter Sale',
        addressLine2: 'In-Store Purchase',
        landmark: 'Store Location',
        city: 'N/A',
        state: 'N/A',
        country: 'INR',
        postalCode: '000000',
        deliveryInstructions: 'Counter pickup',
      };
    }

    let billingAddress: any;
    if (data.billingAddressId) {
      // Fetch billing address from customer's saved addresses
      const billingAddressRecord = customer.addresses.find(
        a => a.id === data.billingAddressId
      );
      if (!billingAddressRecord) {
        throw new Error(`Billing address with ID ${data.billingAddressId} not found for this customer`);
      }

      billingAddress = {
        fullName: billingAddressRecord.fullName,
        phone: billingAddressRecord.phone,
        alternatePhone: billingAddressRecord.alternatePhone,
        addressLine1: billingAddressRecord.addressLine1,
        addressLine2: billingAddressRecord.addressLine2,
        landmark: billingAddressRecord.landmark,
        city: billingAddressRecord.city,
        state: billingAddressRecord.state,
        country: billingAddressRecord.country,
        postalCode: billingAddressRecord.postalCode,
      };
    } else {
      // For SYSTEM orders (desktop), use the same as shipping or a default address
      billingAddress = {
        fullName: customerName,
        phone: customerPhone,
        alternatePhone: null,
        addressLine1: 'Counter Sale',
        addressLine2: 'In-Store Purchase',
        landmark: 'Store Location',
        city: 'N/A',
        state: 'N/A',
        country: 'INR',
        postalCode: '000000',
      };
    }
    // Fetch product details for order items
    const itemsWithDetails = await Promise.all(
      data.items.map(async item => {
        const includeConfig: any = {
          images: { where: { isPrimary: true } },
        };

        if (item.variantId) {
          includeConfig.variants = { where: { id: item.variantId } };
        }

        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: includeConfig,
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        // Check stock status
        if (product.stockStatus === 'OUT_OF_STOCK') {
          throw new Error(`Product ${product.name} is out of stock`);
        }

        let variant = null;
        let price = product.sellingPrice;
        let mrp = product.mrp;
        let variantName = null;

        if (item.variantId) {
          variant = await prisma.productVariant.findUnique({
            where: { id: item.variantId },
          });

          if (!variant) {
            throw new Error(`Variant with ID ${item.variantId} not found`);
          }

          if (!variant.isActive) {
            throw new Error(`Variant ${variant.variantName} is not active`);
          }

          // Use variant price if available, otherwise use product price
          price = variant.sellingPrice || product.sellingPrice;
          mrp = variant.mrp || product.mrp;
          variantName = variant.variantName;
        }

        const discount = Number(mrp) - Number(price);
        const taxAmount = (Number(price) * Number(product.taxRate)) / 100;
        const totalAmount = Number(price) * item.quantity + taxAmount;

        // Get primary image
        const primaryImage = await prisma.productImage.findFirst({
          where: { productId: product.id, isPrimary: true },
        });

        return {
          productId: product.id,
          variantId: item.variantId || null,
          productName: product.name,
          productSku: product.sku,
          variantName: variantName,
          productImage: primaryImage?.url || null,
          mrp: mrp,
          sellingPrice: price,
          quantity: item.quantity,
          discount: discount,
          taxRate: product.taxRate,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          vendorId: product.vendorId,
          status: 'PENDING',
        };
      })
    );

    // Calculate order totals
    const itemsTotal = itemsWithDetails.reduce(
      (sum, item) => sum + Number(item.sellingPrice) * item.quantity,
      0
    );
    const taxAmount = itemsWithDetails.reduce(
      (sum, item) => sum + Number(item.taxAmount),
      0
    );
    const discount = itemsWithDetails.reduce(
      (sum, item) => sum + Number(item.discount) * item.quantity,
      0
    );

    // Apply discount code if provided
    let discountAmount = discount;
    if (data.discountCode) {
      const discountCoupon = await prisma.discount.findUnique({
        where: { code: data.discountCode },
      });

      if (discountCoupon && discountCoupon.isActive) {
        const now = new Date();
        if (
          discountCoupon.validFrom <= now &&
          discountCoupon.validUntil >= now
        ) {
          if (discountCoupon.type === 'PERCENTAGE') {
            const couponDiscount =
              (itemsTotal * Number(discountCoupon.value)) / 100;
            discountAmount += Math.min(
              couponDiscount,
              Number(discountCoupon.maxDiscountAmount || couponDiscount)
            );
          } else if (discountCoupon.type === 'FIXED_AMOUNT') {
            discountAmount += Number(discountCoupon.value);
          }
        }
      }
    }

    const shippingCharges = 0; // Calculate based on your logic
    const codCharges = 0; // Calculate if COD is selected
    const totalAmount = itemsTotal + taxAmount + shippingCharges + codCharges - discountAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        vendorId: data.vendorId ?? null,
        itemsTotal,
        taxAmount,
        shippingCharges,
        discount,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        shippingAddress,
        billingAddress,
        customerName,
        customerEmail,
        customerPhone,
        customerNotes: data.customerNotes || null,
        source: data.source || $Enums.Source.WEBSITE,
        deviceInfo: data.deviceInfo || null,
        createdBy: data.createdBy || null,
        items: {
          create: itemsWithDetails,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Update customer stats
    await prisma.customer.update({
      where: { id: data.customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: totalAmount },
        lastOrderAt: new Date(),
      },
    });

    // Update product sales count
    for (const item of itemsWithDetails) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: item.quantity } },
      });
    }

    return order;
  }

  async getAllOrders(
    filters?: OrderFilters,
    pagination?: PaginationParams
  ): Promise<{ orders: Order[]; total: number }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.vendorId) {
      where.vendorId = filters.vendorId;
    }

    // New filters for desktop app
    if (filters?.createdBy) {
      (where as any).createdBy = filters.createdBy;
    }

    if (filters?.source) {
      where.source = filters.source as any; // Cast to any to match enum
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerEmail: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          // For desktop bill history, include only minimal details
          items: {
            select: {
              id: true,
              productName: true,
              productSku: true,
              quantity: true,
              sellingPrice: true,
              totalAmount: true,
            },
          },
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              customerCode: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
          },
        },
        customer: {
          include: {
            user: true,
            addresses: true,
          },
        },
        payments: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        delivery: true,
        returns: true,
        invoices: true,
      },
    });
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
            variant: true,
          },
        },
        customer: {
          include: {
            user: true,
            addresses: true,
          },
        },
        payments: true,
        discounts: {
          include: {
            discount: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        delivery: true,
        returns: true,
        invoices: true,
      },
    });
  }

  async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        customer: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const updateData: Prisma.OrderUpdateInput = {
      status,
      statusHistory: {
        create: {
          fromStatus: order.status,
          toStatus: status,
        },
      },
    };

    // Update status-specific timestamps
    switch (status) {
      case OrderStatus.CONFIRMED:
        updateData.confirmedAt = new Date();
        break;
      case OrderStatus.PACKED:
        updateData.packedAt = new Date();
        break;
      case OrderStatus.SHIPPED:
        updateData.shippedAt = new Date();
        break;
      case OrderStatus.DELIVERED:
        updateData.deliveredAt = new Date();
        break;
      case OrderStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        break;
      case OrderStatus.RETURNED:
        updateData.returnRequestedAt = new Date();
        break;
    }

    return prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: true,
        statusHistory: true,
      },
    });
  }

  async deleteOrder(id: string): Promise<Order> {
    // Soft delete - not applicable in schema, but we can cancel
    return this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }

  async restoreOrder(id: string): Promise<Order> {
    // Restore from cancelled state to pending
    return this.updateOrderStatus(id, OrderStatus.PENDING);
  }

  async getMonthlyOrderStats(months: number): Promise<MonthlyStats[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: OrderStatus.CANCELLED },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    // Group by month
    const monthlyData: { [key: string]: MonthlyStats } = {};

    orders.forEach(order => {
      const monthKey = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          orderCount: 0,
          revenue: 0,
        };
      }

      monthlyData[monthKey].orderCount += 1;
      monthlyData[monthKey].revenue += Number(order.totalAmount);
    });

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Helper function to calculate percentage change
    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    // Get all time stats
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
      totalRevenueResult,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
      prisma.order.count({ where: { status: OrderStatus.RETURNED } }),
      prisma.order.aggregate({
        where: { status: { not: OrderStatus.CANCELLED } },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = Number(totalRevenueResult._sum.totalAmount || 0);

    // Get this month stats
    const [
      thisMonthOrders,
      thisMonthPending,
      thisMonthDelivered,
      thisMonthCancelled,
      thisMonthReturned,
      thisMonthRevenueResult,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonthStart },
          status: { not: OrderStatus.CANCELLED },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonthStart },
          status: OrderStatus.PENDING,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonthStart },
          status: OrderStatus.DELIVERED,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonthStart },
          status: OrderStatus.CANCELLED,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thisMonthStart },
          status: OrderStatus.RETURNED,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: thisMonthStart },
          status: { not: OrderStatus.CANCELLED },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const thisMonthRevenue = Number(
      thisMonthRevenueResult._sum.totalAmount || 0
    );

    // Get last month stats
    const [
      lastMonthOrders,
      lastMonthPending,
      lastMonthDelivered,
      lastMonthCancelled,
      lastMonthReturned,
      lastMonthRevenueResult,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: { not: OrderStatus.CANCELLED },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: OrderStatus.PENDING,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: OrderStatus.DELIVERED,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: OrderStatus.CANCELLED,
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: OrderStatus.RETURNED,
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
          status: { not: OrderStatus.CANCELLED },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    const lastMonthRevenue = Number(
      lastMonthRevenueResult._sum.totalAmount || 0
    );

    // Calculate average order values
    const thisMonthAvgOrderValue =
      thisMonthOrders > 0 ? thisMonthRevenue / thisMonthOrders : 0;
    const lastMonthAvgOrderValue =
      lastMonthOrders > 0 ? lastMonthRevenue / lastMonthOrders : 0;

    // Get monthly performance for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        status: { not: OrderStatus.CANCELLED },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    // Group by month
    const monthlyData: {
      [key: number]: { revenue: number; orders: number };
    } = {};

    monthlyOrders.forEach(order => {
      const month = order.createdAt.getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, orders: 0 };
      }
      monthlyData[month].revenue += Number(order.totalAmount);
      monthlyData[month].orders += 1;
    });

    const monthlyPerformance = Object.entries(monthlyData).map(
      ([month, data]) => ({
        month: Number(month),
        revenue: data.revenue,
        orders: data.orders,
        avgOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
      })
    );

    return {
      kpis: {
        totalRevenue: {
          value: totalRevenue,
          change: calculateChange(thisMonthRevenue, lastMonthRevenue),
        },
        totalOrders: {
          value: totalOrders,
          change: calculateChange(thisMonthOrders, lastMonthOrders),
        },
        pendingOrders: {
          value: pendingOrders,
          change: calculateChange(thisMonthPending, lastMonthPending),
        },
        deliveredOrders: {
          value: deliveredOrders,
          change: calculateChange(thisMonthDelivered, lastMonthDelivered),
        },
        cancelledOrders: {
          value: cancelledOrders,
          change: calculateChange(thisMonthCancelled, lastMonthCancelled),
        },
        returnedOrders: {
          value: returnedOrders,
          change: calculateChange(thisMonthReturned, lastMonthReturned),
        },
        avgOrderValue: {
          value: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          change: calculateChange(
            thisMonthAvgOrderValue,
            lastMonthAvgOrderValue
          ),
        },
      },
      monthlyPerformance,
    };
  }

  async getOrderCountByStatus(): Promise<OrderCountByStatus[]> {
    const result = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return result.map(item => ({
      status: item.status,
      count: item._count.status,
    }));
  }

  async getRevenueStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<RevenueStats> {
    const where: Prisma.OrderWhereInput = {
      status: { not: OrderStatus.CANCELLED },
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [result, totalOrders] = await Promise.all([
      prisma.order.aggregate({
        where,
        _sum: { totalAmount: true },
        _avg: { totalAmount: true },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      totalRevenue: Number(result._sum.totalAmount || 0),
      avgOrderValue: Number(result._avg.totalAmount || 0),
      totalOrders,
    };
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrdersByVendor(vendorId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { vendorId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        customer: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        cancelledAt: new Date(),
        adminNotes: reason || null,
        statusHistory: {
          create: {
            fromStatus: existingOrder?.status || null,
            toStatus: OrderStatus.CANCELLED,
            reason: reason || null,
          },
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });

    // Update customer stats
    await prisma.customer.update({
      where: { id: order.customerId },
      data: {
        totalOrders: { decrement: 1 },
        totalSpent: { decrement: Number(order.totalAmount) },
      },
    });

    return order;
  }

  async confirmOrder(id: string): Promise<Order> {
    return this.updateOrderStatus(id, OrderStatus.CONFIRMED);
  }

  // Return Management Methods
  async createReturn(data: any): Promise<any> {
    // First, validate return items and create the return record
    const returnRecord = await this.createReturnRecord(data);
    
    // Then, handle the approved return operations in separate transactions
    if (data.status === 'APPROVED') {
      await this.processApprovedReturn(returnRecord, data);
    }
    
    return returnRecord;
  }
  
  private async createReturnRecord(data: any): Promise<any> {
    // Check if the same order items have already been returned to prevent duplicate returns
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      for (const item of data.items) {
        // Get all existing returns for this order item
        const existingReturns = await prisma.returnItem.findMany({
          where: {
            orderItemId: item.orderItemId,
          },
          include: {
            return: true
          }
        });
        
        // Calculate total quantity already returned for this order item
        let totalReturnedQuantity = 0;
        existingReturns.forEach((existingReturnItem) => {
          if (existingReturnItem.return.status !== 'REJECTED') {
            // Only count items from returns that were not rejected
            totalReturnedQuantity += existingReturnItem.quantity;
          }
        });
        
        // Get the original order item to check the purchased quantity
        const originalOrderItem = await prisma.orderItem.findUnique({
          where: { id: item.orderItemId }
        });
        
        if (!originalOrderItem) {
          throw new Error(`Order item with ID ${item.orderItemId} not found`);
        }
        
        // Check if returning more quantity than was purchased
        const quantityToReturn = item.quantity;
        const availableQuantityForReturn = originalOrderItem.quantity - totalReturnedQuantity;
        
        if (quantityToReturn > availableQuantityForReturn) {
          throw new Error(
            `Cannot return ${quantityToReturn} items for order item ${item.orderItemId}. ` +
            `Only ${availableQuantityForReturn} items available for return. ` +
            `(${originalOrderItem.quantity} purchased - ${totalReturnedQuantity} already returned)`
          );
        }
        
        if (quantityToReturn <= 0) {
          throw new Error(`Return quantity must be greater than 0 for order item ${item.orderItemId}`);
        }
      }
    }
    
    // Build the return data object conditionally to avoid type issues
    const returnData: any = {
      orderId: data.orderId,
      returnNumber: data.returnNumber,
      type: data.type,
      reason: data.reason,
      detailedReason: data.detailedReason,
      status: data.status || 'REQUESTED',
      customerComments: data.customerComments,
      images: data.images || [],
      pickupAddress: data.pickupAddress || null,
      pickupScheduledDate: data.pickupScheduledDate || null,
      pickupCompletedAt: data.pickupCompletedAt,
      inspectionNotes: data.inspectionNotes,
      inspectionCompletedAt: data.inspectionCompletedAt,
      inspectedBy: data.inspectedBy,
      approvedAt: data.approvedAt,
      rejectedAt: data.rejectedAt,
      processedAt: data.processedAt,
      // Handle return items if provided
      items: data.items ? {
        create: data.items.map((item: any) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
          condition: item.condition || 'USED',
        }))
      } : undefined,
    };

    // Add optional fields only if they exist in the data
    if (data.source !== undefined) returnData.source = data.source;
    else returnData.source = 'SYSTEM';
    
    if (data.refundAmount !== undefined) returnData.refundAmount = data.refundAmount;
    if (data.refundMethod !== undefined) returnData.refundMethod = data.refundMethod;
    if (data.exchangeOrderId !== undefined) returnData.exchangeOrderId = data.exchangeOrderId;
    if (data.createdBy !== undefined) returnData.createdBy = data.createdBy;

    // Create the return record
    return await prisma.return.create({
      data: returnData,
    });
  }
  
  private async processApprovedReturn(returnRecord: any, data: any): Promise<void> {
    return prisma.$transaction(async (tx) => {
      // Check if all items in the order are returned to determine if the entire order is returned
      const order = await tx.order.findUnique({
        where: { id: data.orderId },
        include: { items: true, returns: { include: { items: true } }, payments: true }
      });
      
      if (order) {
        // Calculate total items in order vs total items returned
        const totalOrderItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Get total quantity of items already returned for this order
        let totalReturnedItems = 0;
        if (order.returns && Array.isArray(order.returns)) {
          order.returns.forEach((returnRecord: any) => {
            if (returnRecord.items && Array.isArray(returnRecord.items)) {
              returnRecord.items.forEach((returnItem: any) => {
                totalReturnedItems += returnItem.quantity;
              });
            }
          });
        }
        
        // Add the current return items to the total and handle inventory adjustment
        if (data.items) {
          for (const item of data.items) {
            totalReturnedItems += item.quantity;
            
            // Get the original order item to find product/variant info
            const originalOrderItem = await tx.orderItem.findUnique({
              where: { id: item.orderItemId }
            });
            
            if (originalOrderItem) {
              // Find the corresponding inventory record
              const inventory = await tx.inventory.findFirst({
                where: {
                  productId: originalOrderItem.productId,
                  variantId: originalOrderItem.variantId || null,
                },
              });
              
              if (inventory) {
                // Update inventory: increase available quantity
                await tx.inventory.update({
                  where: { id: inventory.id },
                  data: {
                    availableQuantity: {
                      increment: item.quantity
                    },
                    updatedAt: new Date(),
                  },
                });
                
                // Create stock movement record for the return
                await tx.stockMovement.create({
                  data: {
                    inventoryId: inventory.id,
                    warehouseId: inventory.warehouseId,
                    type: 'RETURN',
                    quantity: item.quantity,
                    referenceType: 'RETURN',
                    referenceId: returnRecord.id,
                    reason: 'Customer return',
                    notes: `Return of order item ${originalOrderItem.id}`,
                    performedAt: new Date(),
                  },
                });
              }
              
              // Update the order item to reflect the refunded quantity and return status
              await tx.orderItem.update({
                where: { id: originalOrderItem.id },
                data: {
                  refundedQuantity: {
                    increment: item.quantity
                  },
                  isReturned: true,
                  updatedAt: new Date(),
                },
              });
            }
          }
          
          // Process refund for the returned items
          if (data.refundAmount > 0 && order.payments && order.payments.length > 0) {
            // Use the first payment for refund processing
            const payment = order.payments[0];
            
            if (payment) {
              // Create a refund record linked to both the payment and the return
              await tx.refund.create({
                data: {
                  paymentId: payment.id,
                  returnId: returnRecord.id,
                  amount: data.refundAmount,
                  reason: data.reason || 'Return',
                  status: 'PENDING', // Initially pending, will be updated based on payment gateway response
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              });
              
              // Update the payment's refunded amount
              await tx.payment.update({
                where: { id: payment.id },
                data: {
                  refundedAmount: {
                    increment: data.refundAmount
                  },
                  updatedAt: new Date(),
                },
              });
            }
          }
        }
        
        // If all items are returned, mark order as RETURNED; otherwise keep as DELIVERED (for partial returns)
        const newOrderStatus = totalReturnedItems >= totalOrderItems ? 'RETURNED' : 'DELIVERED';
        
        await tx.order.update({
          where: { id: data.orderId },
          data: { status: newOrderStatus },
        });
      }
    });
  }

  async getReturnById(returnId: string): Promise<any> {
    return prisma.return.findUnique({
      where: { id: returnId },
      include: {
        order: {
          include: {
            customer: true,
            items: true,
          },
        },
        items: {
          include: {
            orderItem: true,
          },
        },
      },
    });
  }

  async getAllReturns(filters: any, pagination: any): Promise<{ returns: any[]; total: number }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReturnWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              customer: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  customerCode: true,
                },
              },
              items: true,
            },
          },
          items: {
            include: {
              orderItem: true,
            },
          },
        },
      }),
      prisma.return.count({ where }),
    ]);

    return { returns, total };
  }

  async getDesktopReturns(filters: any, pagination: any): Promise<{ returns: any[]; total: number }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReturnWhereInput = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.orderId) {
      where.orderId = filters.orderId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.createdBy) {
      where.createdBy = filters.createdBy;
    }
    
    if (filters?.source) {
      where.source = filters.source;
    }
    
    // Add date filters if provided
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      
      if (filters?.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      
      if (filters?.endDate) {
        where.createdAt.lte = new Date(new Date(filters.endDate).setDate(new Date(filters.endDate).getDate() + 1)); // Include the full end date
      }
    }

    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          returnNumber: true,
          type: true,
          reason: true,
          status: true,
          refundAmount: true,
          refundMethod: true,
          createdAt: true,
          updatedAt: true,
          order: {
            select: {
              orderNumber: true,
              totalAmount: true,
              status: true,
              customerName: true,
              customerPhone: true,
            },
          },
          items: {
            select: {
              quantity: true,
              condition: true,
              orderItem: {
                select: {
                  productName: true,
                  productSku: true,
                  sellingPrice: true,
                },
              },
            },
          },
        },
      }),
      prisma.return.count({ where }),
    ]);

    // Transform the results to flatten the item structure
    const transformedReturns = returns.map(returnRecord => {
      return {
        ...returnRecord,
        items: returnRecord.items.map(item => ({
          quantity: item.quantity,
          condition: item.condition,
          productName: item.orderItem?.productName,
          productSku: item.orderItem?.productSku,
          sellingPrice: item.orderItem?.sellingPrice,
        })),
      };
    });

    return { returns: transformedReturns, total };
  }

  async updateReturnStatus(returnId: string, data: any): Promise<any> {
    const { status, inspectionNotes, refundAmount, refundMethod, ...otherData } = data;
    
    return prisma.$transaction(async (tx) => {
      // Update the return record
      const updatedReturn = await tx.return.update({
        where: { id: returnId },
        data: {
          status,
          inspectionNotes,
          refundAmount: refundAmount ? Number(refundAmount) : null,
          refundMethod,
          processedAt: status === 'APPROVED' || status === 'REJECTED' ? new Date() : undefined,
          approvedAt: status === 'APPROVED' ? new Date() : undefined,
          rejectedAt: status === 'REJECTED' ? new Date() : undefined,
          ...otherData
        },
      });
      
      // Update the related order status based on return status
      if (status === 'APPROVED') {
        // Check if all items in the order are returned to determine if the entire order is returned
        const order = await tx.order.findUnique({
          where: { id: updatedReturn.orderId },
          include: { items: true, returns: { include: { items: true } }, payments: true }
        });
        
        if (order) {
          // Calculate total items in order vs total items returned
          const totalOrderItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
          
          // Get total quantity of items already returned for this order (excluding the current return being updated)
          let totalReturnedItems = 0;
          if (order.returns && Array.isArray(order.returns)) {
            order.returns.forEach((returnRecord: any) => {
              // Only count items from other returns, not the one being updated
              if (returnRecord.id !== returnId && returnRecord.items && Array.isArray(returnRecord.items)) {
                returnRecord.items.forEach((returnItem: any) => {
                  totalReturnedItems += returnItem.quantity;
                });
              }
            });
          }
          
          // Add the current return items to the total and handle inventory adjustment
          // We need to fetch the updated return with items separately
          const currentReturnWithItems = await tx.return.findUnique({
            where: { id: returnId },
            include: { items: true }
          });
          
          if (currentReturnWithItems && currentReturnWithItems.items && Array.isArray(currentReturnWithItems.items)) {
            for (const returnItem of currentReturnWithItems.items) {
              totalReturnedItems += returnItem.quantity;
              
              // Get the original order item to find product/variant info
              const originalOrderItem = await tx.orderItem.findUnique({
                where: { id: returnItem.orderItemId }
              });
              
              if (originalOrderItem) {
                // Find the corresponding inventory record
                const inventory = await tx.inventory.findFirst({
                  where: {
                    productId: originalOrderItem.productId,
                    variantId: originalOrderItem.variantId || null,
                  },
                });
                
                if (inventory) {
                  // Update inventory: increase available quantity
                  await tx.inventory.update({
                    where: { id: inventory.id },
                    data: {
                      availableQuantity: {
                        increment: returnItem.quantity
                      },
                      updatedAt: new Date(),
                    },
                  });
                  
                  // Create stock movement record for the return
                  await tx.stockMovement.create({
                    data: {
                      inventoryId: inventory.id,
                      warehouseId: inventory.warehouseId,
                      type: 'RETURN',
                      quantity: returnItem.quantity,
                      referenceType: 'RETURN',
                      referenceId: returnId,
                      reason: 'Customer return',
                      notes: `Return of order item ${originalOrderItem.id}`,
                      performedAt: new Date(),
                    },
                  });
                }
                
                // Update the order item to reflect the refunded quantity and return status
                await tx.orderItem.update({
                  where: { id: originalOrderItem.id },
                  data: {
                    refundedQuantity: {
                      increment: returnItem.quantity
                    },
                    isReturned: true,
                    updatedAt: new Date(),
                  },
                });
              }
            }
            
            // Process refund for the returned items if not already processed
            if (order.payments && order.payments.length > 0) {
              // Check if a refund record already exists for this return
              const existingRefund = await tx.refund.findFirst({
                where: {
                  returnId: returnId,
                } as any, // Use type assertion to bypass schema validation temporarily
              });
              
              if (!existingRefund && updatedReturn.refundAmount && Number(updatedReturn.refundAmount) > 0) {
                // Use the first payment for refund processing
                const payment = order.payments[0];
                
                if (payment) {
                  // Create a refund record linked to both the payment and the return
                  await tx.refund.create({
                    data: {
                      paymentId: payment.id,
                      returnId: returnId,
                      amount: updatedReturn.refundAmount,
                      reason: updatedReturn.reason || 'Return',
                      status: 'PENDING', // Initially pending, will be updated based on payment gateway response
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  });
                  
                  // Update the payment's refunded amount
                  await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                      refundedAmount: {
                        increment: updatedReturn.refundAmount
                      },
                      updatedAt: new Date(),
                    },
                  });
                }
              }
            }
          }
          
          // If all items are returned, mark order as RETURNED; otherwise keep as DELIVERED (for partial returns)
          const newOrderStatus = totalReturnedItems >= totalOrderItems ? 'RETURNED' : 'DELIVERED';
          
          await tx.order.update({
            where: { id: updatedReturn.orderId },
            data: { status: newOrderStatus },
          });
        }
      } else if (status === 'REJECTED') {
        // When return is rejected, check if other returns exist, otherwise revert to DELIVERED
        const otherApprovedReturns = await tx.return.findMany({
          where: {
            orderId: updatedReturn.orderId,
            status: 'APPROVED',
            id: { not: returnId }, // Exclude the current return
          },
          include: { items: true }
        });
        
        // Calculate if any items are still returned after this rejection
        let totalStillReturned = 0;
        otherApprovedReturns.forEach((returnRecord: any) => {
          if (returnRecord.items && Array.isArray(returnRecord.items)) {
            returnRecord.items.forEach((returnItem: any) => {
              totalStillReturned += returnItem.quantity;
            });
          }
        });
        
        // If no items are still returned after this rejection, revert to DELIVERED
        if (totalStillReturned === 0) {
          await tx.order.update({
            where: { id: updatedReturn.orderId },
            data: { status: 'DELIVERED' },
          });
        }
        
        // When a return is rejected, we need to reverse the inventory adjustments made when the return was initially approved
        // Get the return with its items
        const rejectedReturnWithItems = await tx.return.findUnique({
          where: { id: returnId },
          include: { items: true }
        });
        
        if (rejectedReturnWithItems && rejectedReturnWithItems.items && Array.isArray(rejectedReturnWithItems.items)) {
          for (const returnItem of rejectedReturnWithItems.items) {
            // Get the original order item to find product/variant info
            const originalOrderItem = await tx.orderItem.findUnique({
              where: { id: returnItem.orderItemId }
            });
            
            if (originalOrderItem) {
              // Find the corresponding inventory record
              const inventory = await tx.inventory.findFirst({
                where: {
                  productId: originalOrderItem.productId,
                  variantId: originalOrderItem.variantId || null,
                },
              });
              
              if (inventory) {
                // Update inventory: decrease available quantity since return was rejected
                await tx.inventory.update({
                  where: { id: inventory.id },
                  data: {
                    availableQuantity: {
                      decrement: returnItem.quantity
                    },
                    updatedAt: new Date(),
                  },
                });
                
                // Create stock movement record for the return reversal
                await tx.stockMovement.create({
                  data: {
                    inventoryId: inventory.id,
                    warehouseId: inventory.warehouseId,
                    type: 'ADJUSTMENT',
                    quantity: returnItem.quantity,
                    referenceType: 'RETURN_REJECTION',
                    referenceId: returnId,
                    reason: 'Return rejected',
                    notes: `Reversal of return for order item ${originalOrderItem.id}`,
                    performedAt: new Date(),
                  },
                });
                
                // Update the order item to reverse the refunded quantity and return status
                await tx.orderItem.update({
                  where: { id: originalOrderItem.id },
                  data: {
                    refundedQuantity: {
                      decrement: returnItem.quantity
                    },
                    isReturned: false, // Set to false since return was rejected
                    updatedAt: new Date(),
                  },
                });
              }
            }
          }
          
          // Reverse the refund if one was processed
          const refundToReverse = await tx.refund.findFirst({
            where: {
              returnId: returnId,
            }
          });
          
          if (refundToReverse) {
            // Update the refund status to reflect rejection
            await tx.refund.update({
              where: { id: refundToReverse.id },
              data: {
                status: 'FAILED', // Mark as failed since return was rejected
                updatedAt: new Date(),
              },
            });
            
            // Find the associated order to get the payment
            const order = await tx.order.findUnique({
              where: { id: updatedReturn.orderId },
              include: { payments: true }
            });
            
            if (order && order.payments && order.payments.length > 0) {
              const payment = order.payments[0];
              
              if (payment) {
                // Reverse the refunded amount from the payment
                await tx.payment.update({
                  where: { id: payment.id },
                  data: {
                    refundedAmount: {
                      decrement: refundToReverse.amount
                    },
                    updatedAt: new Date(),
                  },
                });
              }
            }
          }
        }
      }
      
      return updatedReturn;
    });
  }
}
