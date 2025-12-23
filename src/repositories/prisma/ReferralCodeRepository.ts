// src/repositories/prisma/ReferralCodeRepository.ts
import { PrismaClient, ReferralCode } from '@prisma/client';
import { IReferralCodeRepository } from '../interfaces/IReferralCodeRepository';

const prisma = new PrismaClient();

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
        customer: true,
        subscription: true
      }
    });
  }

  async findByCode(code: string): Promise<ReferralCode | null> {
    return prisma.referralCode.findUnique({ 
      where: { code },
      include: {
        customer: true,
        subscription: true
      }
    });
  }

  async findByCustomerId(customerId: string): Promise<ReferralCode | null> {
    return prisma.referralCode.findUnique({ 
      where: { customerId },
      include: {
        customer: true,
        subscription: true
      }
    });
  }

  async create(
    data: Omit<ReferralCode, 'id' | 'createdAt'>
  ): Promise<ReferralCode> {
    return prisma.referralCode.create({ 
      data,
      include: {
        customer: true,
        subscription: true
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
        customer: true,
        subscription: true
      }
    });
  }

  async delete(id: string): Promise<ReferralCode> {
    return prisma.referralCode.delete({
      where: { id },
      include: {
        customer: true,
        subscription: true
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
        customer: true,
        subscription: true
      }
    });
  }
}