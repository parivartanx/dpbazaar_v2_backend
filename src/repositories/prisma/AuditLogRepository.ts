import { AuditLog, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IAuditLogRepository } from '../interfaces/IAuditLogRepository';

export class AuditLogRepository implements IAuditLogRepository {
  async create(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return await prisma.auditLog.create({
      data,
    });
  }

  async getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ logs: AuditLog[]; total: number }> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (filters) {
      if (filters.userId) {
        where.userId = filters.userId;
      }
      if (filters.action) {
        where.action = filters.action;
      }
      if (filters.entityType) {
        where.entityType = filters.entityType;
      }
      if (filters.entityId) {
        where.entityId = filters.entityId;
      }
      if (filters.startDate && filters.endDate) {
        where.createdAt = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  async findById(id: string): Promise<AuditLog | null> {
    return await prisma.auditLog.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return await prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
