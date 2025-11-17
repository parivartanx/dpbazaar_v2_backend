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


  // async getSalesByCategory(range: number): Promise<any[]> {
  //   const rangeStart = this.getStartDate(range);

  //   const result = await prisma.orderItem.groupBy({
  //     by: ["productId"],
  //     _sum: { quantity: true },
  //     where: {
  //       order: {
  //         createdAt: { gte: rangeStart },
  //         status: "DELIVERED"
  //       }
  //     }
  //   });

  //   return Promise.all(
  //     result.map(async (item) => {
  //       const product = await prisma.product.findUnique({
  //         where: { id: item.productId },
  //         include: { category: true }
  //       });

  //       return {
  //         categoryName: product?.category?.name || "Unknown",
  //         sold: item._sum.quantity
  //       };
  //     })
  //   );
  // }

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


// import { PrismaClient } from "@prisma/client";
// import { IAnalyticsRepository } from "../interfaces/IAnalyticsRepository";

// const prisma = new PrismaClient();

// export class AnalyticsRepository implements IAnalyticsRepository {

//   // 🔥 MAIN KPI: revenue, orders, customers, avgOrderValue with % change
//   async getKPIs(): Promise<any> {
//     const now = new Date();

//     const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

//     // THIS MONTH
//     const [revThis, ordersThis, custThis] = await Promise.all([
//       prisma.order.aggregate({
//         _sum: { totalAmount: true },
//         where: {
//           createdAt: { gte: firstDayThisMonth },
//           status: "DELIVERED"
//         }
//       }),
//       prisma.order.count({
//         where: { createdAt: { gte: firstDayThisMonth } }
//       }),
//       prisma.user.count({
//         where: {
//           role: "CUSTOMER",
//           createdAt: { gte: firstDayThisMonth }
//         }
//       })
//     ]);

//     // LAST MONTH
//     const [revLast, ordersLast, custLast] = await Promise.all([
//       prisma.order.aggregate({
//         _sum: { totalAmount: true },
//         where: {
//           createdAt: {
//             gte: firstDayLastMonth,
//             lte: endLastMonth
//           },
//           status: "DELIVERED"
//         }
//       }),
//       prisma.order.count({
//         where: {
//           createdAt: {
//             gte: firstDayLastMonth,
//             lte: endLastMonth
//           }
//         }
//       }),
//       prisma.user.count({
//         where: {
//           role: "CUSTOMER",
//           createdAt: {
//             gte: firstDayLastMonth,
//             lte: endLastMonth
//           }
//         }
//       })
//     ]);

//     const revenueThis = Number(revThis._sum.totalAmount || 0);
//     const revenueLast = Number(revLast._sum.totalAmount || 0);

//     const avgThis = ordersThis > 0 ? revenueThis / ordersThis : 0;
//     const avgLast = ordersLast > 0 ? (revenueLast / ordersLast) : 0;

//     const percent = (curr: number, prev: number): number => {
//       if (prev === 0) return curr > 0 ? 100 : 0;
//       return ((curr - prev) / prev) * 100;
//     };

//     return {
//       revenue: {
//         value: revenueThis,
//         change: percent(revenueThis, revenueLast)
//       },
//       orders: {
//         value: ordersThis,
//         change: percent(ordersThis, ordersLast)
//       },
//       newCustomers: {
//         value: custThis,
//         change: percent(custThis, custLast)
//       },
//       avgOrderValue: {
//         value: avgThis,
//         change: percent(avgThis, avgLast)
//       }
//     };
//   }

//   // 🔥 Last 7 days revenue
//   async getDailyRevenue(): Promise<any[]> {
//     const last7 = new Date();
//     last7.setDate(last7.getDate() - 7);

//     const result = await prisma.order.groupBy({
//       by: ["createdAt"],
//       _sum: { totalAmount: true },
//       where: {
//         createdAt: { gte: last7 },
//         status: "DELIVERED"
//       },
//       orderBy: { createdAt: "asc" }
//     });

//     return result.map(r => ({
//       date: r.createdAt,
//       total: Number(r._sum.totalAmount || 0)
//     }));
//   }

//   // 🔥 Sales by Category
//   async getSalesByCategory(): Promise<any[]> {
//     const result = await prisma.productCategory.groupBy({
//       by: ["categoryId"],
//       _count: { productId: true }
//     });

//     return Promise.all(
//       result.map(async (item) => {
//         const category = await prisma.category.findUnique({
//           where: { id: item.categoryId },
//           select: { name: true }
//         });

//         return {
//           categoryId: item.categoryId,
//           categoryName: category?.name || "Unknown",
//           totalProducts: item._count.productId
//         };
//       })
//     );
//   }

//   // 🔥 Monthly performance (sales, orders, new customers)
//   async getMonthlyPerformance(): Promise<any[]> {
//     const yearStart = new Date(new Date().getFullYear(), 0, 1);

//     const orders = await prisma.order.groupBy({
//       by: ["createdAt"],
//       _sum: { totalAmount: true },
//       where: {
//         createdAt: { gte: yearStart },
//         status: "DELIVERED"
//       },
//       orderBy: { createdAt: "asc" }
//     });

//     const result: any = {};

//     orders.forEach((o) => {
//       const month = o.createdAt.getMonth(); // 0-11

//       if (!result[month]) {
//         result[month] = { sales: 0, orders: 0, customers: 0 };
//       }

//       result[month].sales += Number(o._sum.totalAmount || 0);
//       result[month].orders += 1;
//     });

//     // CUSTOMERS
//     const customers = await prisma.user.findMany({
//       where: {
//         role: "CUSTOMER",
//         createdAt: { gte: yearStart }
//       }
//     });

//     customers.forEach((c) => {
//       const month = c.createdAt.getMonth();
//       if (!result[month]) result[month] = { sales: 0, orders: 0, customers: 0 };
//       result[month].customers += 1;
//     });

//     return Object.entries(result).map(([month, data]: any) => ({
//       month: Number(month),
//       ...data
//     }));
//   }
// }
