import { PrismaClient } from "@prisma/client";
import { IAnalyticsRepository } from "../interfaces/IAnalyticsRepository";

const prisma = new PrismaClient();

export class AnalyticsRepository implements IAnalyticsRepository {

  // 📌 Helper convert range to date
  private getStartDate(range: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - range);
    return d;
  }

  // ============================================
  // 📌 KPIs
  // ============================================
  async getKPIs(range: number): Promise<any> {
    const rangeStart = this.getStartDate(range);

    const lastRangeStart = this.getStartDate(range * 2);
    const lastRangeEnd = this.getStartDate(range);

    // CURRENT RANGE
    const [revThis, ordersThis, custThis] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: rangeStart }, status: "DELIVERED" }
      }),
      prisma.order.count({ where: { createdAt: { gte: rangeStart } } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: rangeStart } } })
    ]);

    // LAST RANGE
    const [revLast, ordersLast, custLast] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: lastRangeStart, lte: lastRangeEnd }, status: "DELIVERED" }
      }),
      prisma.order.count({
        where: { createdAt: { gte: lastRangeStart, lte: lastRangeEnd } }
      }),
      prisma.user.count({
        where: { role: "CUSTOMER", createdAt: { gte: lastRangeStart, lte: lastRangeEnd } }
      })
    ]);

    const revenueThis = Number(revThis._sum.totalAmount || 0);
    const revenueLast = Number(revLast._sum.totalAmount || 0);

    const avgThis = ordersThis > 0 ? revenueThis / ordersThis : 0;
    const avgLast = ordersLast > 0 ? revenueLast / ordersLast : 0;

    const percent = (curr: number, prev: number): number => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      revenue: { value: revenueThis, change: percent(revenueThis, revenueLast) },
      orders: { value: ordersThis, change: percent(ordersThis, ordersLast) },
      newCustomers: { value: custThis, change: percent(custThis, custLast) },
      avgOrderValue: { value: avgThis, change: percent(avgThis, avgLast) }
    };
  }

  // ============================================
  // 📌 Daily Revenue (range-based)
  // ============================================
  async getDailyRevenue(range: number): Promise<any[]> {
    const rangeStart = this.getStartDate(range);

    const result = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: { createdAt: { gte: rangeStart }, status: "DELIVERED" },
      orderBy: { createdAt: "asc" }
    });

    return result.map(r => ({
      date: r.createdAt,
      total: Number(r._sum.totalAmount || 0)
    }));
  }

  // ============================================
  // 📌 Sales by Category (range-based)
  // ============================================
async getSalesByCategory(range: number): Promise<any[]> {
  const rangeStart = this.getStartDate(range);

  // Step 1: Get sold quantities grouped by product
  const result = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    where: {
      order: {
        createdAt: { gte: rangeStart },
        status: "DELIVERED"
      }
    }
  });

  return Promise.all(
    result.map(async (item) => {
      // 🔥 Step 2: Get categoryId from ProductCategory
      const productCat = await prisma.productCategory.findFirst({
        where: { productId: item.productId },
        select: { categoryId: true }
      });

      // 🔥 Step 3: Get category name
      const category = productCat
        ? await prisma.category.findUnique({
            where: { id: productCat.categoryId },
            select: { name: true }
          })
        : null;

      return {
        categoryId: productCat?.categoryId || null,
        categoryName: category?.name || "Unknown",
        sold: item._sum.quantity || 0
      };
    })
  );
}


  // ============================================
  // 📌 Monthly Performance (range-based)
  // ============================================
  async getMonthlyPerformance(range: number): Promise<any[]> {
    const rangeStart = this.getStartDate(range);

    const orders = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: { createdAt: { gte: rangeStart }, status: "DELIVERED" },
      orderBy: { createdAt: "asc" }
    });

    const result: any = {};

    orders.forEach((o) => {
      const month = o.createdAt.getMonth();
      if (!result[month]) result[month] = { sales: 0, orders: 0, customers: 0 };

      result[month].sales += Number(o._sum.totalAmount || 0);
      result[month].orders += 1;
    });

    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER", createdAt: { gte: rangeStart } }
    });

    customers.forEach((c) => {
      const month = c.createdAt.getMonth();
      if (!result[month]) result[month] = { sales: 0, orders: 0, customers: 0 };
      result[month].customers += 1;
    });

    return Object.entries(result).map(([month, data]: any) => ({
      month: Number(month),
      ...data
    }));
  }
}