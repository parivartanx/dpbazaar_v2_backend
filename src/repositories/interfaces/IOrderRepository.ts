import { Order, OrderItem, OrderStatus, PaymentStatus } from '@prisma/client';

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  customerId?: string;
  vendorId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface CreateOrderData {
  customerId: string;
  vendorId?: string;
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
  }>;
  shippingAddress: any;
  billingAddress: any;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  discountCode?: string;
  source?: string;
  deviceInfo?: any;
}

export interface UpdateOrderData {
  shippingAddress?: any;
  billingAddress?: any;
  customerNotes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  courierPartner?: string;
}

export interface DashboardStats {
  kpis: {
    totalRevenue: { value: number; change: number };
    totalOrders: { value: number; change: number };
    pendingOrders: { value: number; change: number };
    deliveredOrders: { value: number; change: number };
    cancelledOrders: { value: number; change: number };
    returnedOrders: { value: number; change: number };
    avgOrderValue: { value: number; change: number };
  };
  monthlyPerformance: Array<{
    month: number;
    revenue: number;
    orders: number;
    avgOrderValue: number;
  }>;
}

export interface MonthlyStats {
  month: string;
  orderCount: number;
  revenue: number;
}

export interface OrderCountByStatus {
  status: OrderStatus;
  count: number;
}

export interface RevenueStats {
  totalRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
}

export interface IOrderRepository {
  // CRUD Operations
  createOrder(data: CreateOrderData): Promise<Order>;
  getAllOrders(
    filters?: OrderFilters,
    pagination?: PaginationParams
  ): Promise<{ orders: Order[]; total: number }>;
  getOrderById(id: string): Promise<Order | null>;
  updateOrder(id: string, data: UpdateOrderData): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  deleteOrder(id: string): Promise<Order>;
  restoreOrder(id: string): Promise<Order>;

  // Analytics & Stats
  getMonthlyOrderStats(months: number): Promise<MonthlyStats[]>;
  getDashboardStats(): Promise<DashboardStats>;
  getOrderCountByStatus(): Promise<OrderCountByStatus[]>;
  getRevenueStats(startDate?: Date, endDate?: Date): Promise<RevenueStats>;

  // Additional Methods
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrdersByVendor(vendorId: string): Promise<Order[]>;
  cancelOrder(id: string, reason?: string): Promise<Order>;
  confirmOrder(id: string): Promise<Order>;
}
