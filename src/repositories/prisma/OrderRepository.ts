import { PrismaClient, Order, OrderStatus, PaymentStatus, Prisma, $Enums } from '@prisma/client';
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

const prisma = new PrismaClient();

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
}
