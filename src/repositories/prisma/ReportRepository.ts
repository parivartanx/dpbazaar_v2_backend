// import { PrismaClient } from '@prisma/client';
// import { IReportRepository } from '../interfaces/IReportRepository';

// const prisma = new PrismaClient();

// export class ReportRepository implements IReportRepository {
//   async getSalesReport(): Promise<any> {
//     return prisma.orderItem.groupBy({
//       by: ['productId'],
//       _sum: { quantity: true, totalPrice: true },
//     });
//   }

//   async getBestSellers(): Promise<any> {
//     return prisma.product.findMany({
//       orderBy: { salesCount: 'desc' },
//       take: 10,
//     });
//   }

//   async getCategorySales(): Promise<any> {
//     return prisma.orderItem.groupBy({
//       by: ['productId'],
//       _sum: { totalPrice: true },
//     });
//   }

//   async getReturnsReport(): Promise<any> {
//     return prisma.returnRequest.findMany({
//       include: { product: true, order: true },
//     });
//   }
// }
