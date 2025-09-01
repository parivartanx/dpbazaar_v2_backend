// import { PrismaClient, Review } from '@prisma/client';
// import { IReviewRepository } from '../interfaces/IReviewRepository';

// const prisma = new PrismaClient();

// export class ReviewRepository implements IReviewRepository {
//   async getAll(): Promise<Review[]> {
//     return prisma.review.findMany({ include: { product: true, user: true } });
//   }

//   async approve(id: string): Promise<Review> {
//     return prisma.review.update({
//       where: { id },
//       data: { status: 'APPROVED' },
//     });
//   }

//   async reject(id: string, reason?: string): Promise<Review> {
//     return prisma.review.update({
//       where: { id },
//       data: { status: 'REJECTED', rejectionReason: reason },
//     });
//   }

//   async delete(id: string): Promise<void> {
//     await prisma.review.delete({ where: { id } });
//   }

//   async reply(id: string, reply: string): Promise<Review> {
//     return prisma.review.update({ where: { id }, data: { adminReply: reply } });
//   }
// }
