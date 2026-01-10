import { Review } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IReviewRepository } from '../interfaces/IReviewRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class ReviewRepository implements IReviewRepository {
  async getAll(filters?: any): Promise<Review[]> {
    const { page, limit, status, productId, rating, search, ...restFilters } = filters || {};
    
    const where: any = { ...restFilters };
    
    if (status) where.status = status;
    if (productId) where.productId = productId;
    if (rating) where.rating = Number(rating);
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const query: any = {
      where,
      include: { 
        product: { select: { name: true, slug: true, sku: true } }, 
        customer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.review.findMany(query);
  }

  async getById(id: string): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
        customer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
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

  async countFiltered(filters?: any): Promise<number> {
    const { status, productId, rating, search, ...restFilters } = filters || {};
    
    const where: any = { ...restFilters };
    
    if (status) where.status = status;
    if (productId) where.productId = productId;
    if (rating) where.rating = Number(rating);
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return prisma.review.count({ where });
  }
}
