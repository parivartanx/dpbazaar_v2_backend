import { PrismaClient, Banner } from '@prisma/client';
import { IBannerRepository } from '../interfaces/IBannerRepository';

const prisma = new PrismaClient();

export class BannerRepository implements IBannerRepository {
  async create(data: any): Promise<Banner> {
    return await prisma.banner.create({
      data: {
        ...data,
        impressions: 0,
        clicks: 0,
      },
    });
  }

  async update(id: string, data: any): Promise<Banner> {
    return await prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Banner> {
    return await prisma.banner.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Banner | null> {
    return await prisma.banner.findUnique({
      where: { id },
    });
  }

  async findAll(
    filters?: any,
    pagination?: { page: number; limit: number }
  ): Promise<{ data: Banner[]; total: number; page: number; limit: number; totalPages: number }> {
    const { page = 1, limit = 10 } = pagination || {};
    const { status, type, placement, search, startAt, endAt } = filters || {};

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (placement) where.placement = placement;
    if (startAt) where.startAt = { gte: startAt };
    if (endAt) where.endAt = { lte: endAt };
    
    // Add search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ctaText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.banner.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: banners,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async incrementImpressions(id: string): Promise<Banner> {
    return await prisma.banner.update({
      where: { id },
      data: {
        impressions: {
          increment: 1,
        },
      },
    });
  }

  async incrementClicks(id: string): Promise<Banner> {
    return await prisma.banner.update({
      where: { id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  async getActiveBanners(): Promise<Banner[]> {
    return await prisma.banner.findMany({
      where: {
        status: 'ACTIVE',
        startAt: {
          lte: new Date(),
        },
        OR: [
          {
            endAt: {
              gte: new Date(),
            },
          },
          {
            endAt: null,
          },
        ],
      },
      orderBy: { displayOrder: 'asc' },
    });
  }
}