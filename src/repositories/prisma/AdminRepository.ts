import { PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../interfaces/IAdminRepository";

const prisma = new PrismaClient();

export class AdminRepository implements IAdminRepository {
  
  async getTotalRevenue(): Promise<number> {
    const result = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: "DELIVERED" }
    });

    return result._sum.totalAmount ? Number(result._sum.totalAmount) : 0;
  }

  async getTotalOrders(): Promise<number> {
    return prisma.order.count();
  }

  async getTotalCustomers(): Promise<number> {
    return prisma.user.count({
      where: { role: "CUSTOMER" }
    });
  }

  async getWeeklySales(): Promise<any[]> {
    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);

    const result = await prisma.order.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: {
        createdAt: { gte: last7 },
        status: "DELIVERED",
      },
      orderBy: { createdAt: "asc" }
    });

    return result.map(r => ({
      date: r.createdAt,
      total: r._sum.totalAmount ? Number(r._sum.totalAmount) : 0,
    }));
  }

    async getSalesByCategory(): Promise<any[]> {
    const result = await prisma.productCategory.groupBy({
        by: ["categoryId"],
        _count: { productId: true },
    });

    return Promise.all(
        result.map(async (item) => {
            const category = await prisma.category.findUnique({
                where: { id: item.categoryId },
                select: { name: true }
            });

            return {
                categoryId: item.categoryId,
                categoryName: category?.name || "Unknown",
                totalProducts: item._count.productId
            };
        })
    );
    }

  async getRecentOrders(): Promise<any[]> {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,

      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }
}
