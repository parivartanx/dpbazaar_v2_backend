import { Review } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IReviewRepository } from '../interfaces/IReviewRepository';



export class ReviewRepository implements IReviewRepository {
  async getAll(filters?: any): Promise<Review[]> {
    return prisma.review.findMany({
      where: filters,
      include: { 
        product: { select: { name: true, slug: true, sku: true } }, 
        customer: { select: { firstName: true, lastName: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true
      }
    });
  }

  async create(data: any): Promise<Review> {
    return prisma.review.create({ data });
  }

  async approve(id: string, approvedBy: string): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: { 
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date()
      },
    });
  }

  async reject(id: string): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.review.delete({ where: { id } });
  }

  async reply(id: string, reply: string): Promise<Review> {
    return prisma.review.update({ 
      where: { id }, 
      data: { 
        sellerResponse: reply,
        sellerRespondedAt: new Date()
      } 
    });
  }
}
