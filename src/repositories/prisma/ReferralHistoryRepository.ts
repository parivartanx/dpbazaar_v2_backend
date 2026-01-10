// src/repositories/prisma/ReferralHistoryRepository.ts
import { ReferralHistory, ReferralStatus } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IReferralHistoryRepository } from '../interfaces/IReferralHistoryRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class ReferralHistoryRepository implements IReferralHistoryRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    referrerId?: string;
    referredUserId?: string;
    status?: ReferralStatus;
  }): Promise<ReferralHistory[]> {
    const { page = 1, limit = 20, referrerId, referredUserId, status } = params || {};

    const where: any = {};

    if (referrerId) where.referrerId = referrerId;
    if (referredUserId) where.referredUserId = referredUserId;
    if (status) where.status = status;

    return prisma.referralHistory.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      }
    });
  }

  async findById(id: string): Promise<ReferralHistory | null> {
    return prisma.referralHistory.findUnique({ 
      where: { id },
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      }
    });
  }

  async findByReferredUserId(referredUserId: string): Promise<ReferralHistory | null> {
    return prisma.referralHistory.findUnique({ 
      where: { referredUserId },
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
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
    data: Omit<ReferralHistory, 'id' | 'createdAt'>
  ): Promise<ReferralHistory> {
    return prisma.referralHistory.create({ 
      data,
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
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
      Omit<ReferralHistory, 'id' | 'createdAt'>
    >
  ): Promise<ReferralHistory> {
    return prisma.referralHistory.update({
      where: { id },
      data,
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
      }
    });
  }

  async delete(id: string): Promise<ReferralHistory> {
    return prisma.referralHistory.delete({
      where: { id },
      include: {
        referrer: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        referredUser: {
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
    referrerId?: string;
    referredUserId?: string;
    status?: ReferralStatus;
  }): Promise<number> {
    const { referrerId, referredUserId, status } = params || {};
    const where: any = {};

    if (referrerId) where.referrerId = referrerId;
    if (referredUserId) where.referredUserId = referredUserId;
    if (status) where.status = status;

    return prisma.referralHistory.count({ where });
  }
}