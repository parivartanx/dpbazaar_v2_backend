// src/repositories/prisma/ReferralCodeRepository.ts
import { ReferralCode } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IReferralCodeRepository } from '../interfaces/IReferralCodeRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class ReferralCodeRepository implements IReferralCodeRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    isActive?: boolean;
  }): Promise<ReferralCode[]> {
    const { page = 1, limit = 20, customerId, isActive } = params || {};

    const where: any = {};

    if (customerId) where.customerId = customerId;
    if (isActive !== undefined) where.isActive = isActive;

    return prisma.referralCode.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<ReferralCode | null> {
    return prisma.referralCode.findUnique({ 
      where: { id },
      include: {
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

  async findByCode(code: string): Promise<ReferralCode | null> {
    return prisma.referralCode.findUnique({ 
      where: { code },
      include: {
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

  async findByCustomerId(customerId: string): Promise<ReferralCode | null> {
    return prisma.referralCode.findFirst({ 
      where: { customerId },
      include: {
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

  async create(
    data: Omit<ReferralCode, 'id' | 'createdAt'>
  ): Promise<ReferralCode> {
    return prisma.referralCode.create({ 
      data,
      include: {
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

  async update(
    id: string,
    data: Partial<
      Omit<ReferralCode, 'id' | 'createdAt'>
    >
  ): Promise<ReferralCode> {
    return prisma.referralCode.update({
      where: { id },
      data,
      include: {
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

  async delete(id: string): Promise<ReferralCode> {
    return prisma.referralCode.delete({
      where: { id },
      include: {
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
  
  async deactivate(id: string): Promise<ReferralCode> {
    return prisma.referralCode.update({
      where: { id },
      data: { 
        isActive: false,
        deactivatedAt: new Date()
      },
      include: {
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

  async countFiltered(params?: {
    customerId?: string;
    isActive?: boolean;
  }): Promise<number> {
    const { customerId, isActive } = params || {};
    const where: any = {};

    if (customerId) where.customerId = customerId;
    if (isActive !== undefined) where.isActive = isActive;

    return prisma.referralCode.count({ where });
  }
}