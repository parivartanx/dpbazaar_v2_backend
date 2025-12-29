import { AuditLog, Prisma } from '@prisma/client';

export interface IAuditLogRepository {
  create(data: Prisma.AuditLogCreateInput): Promise<AuditLog>;
  getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ logs: AuditLog[]; total: number }>;
  findById(id: string): Promise<AuditLog | null>;
  findByUserId(userId: string): Promise<AuditLog[]>;
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}
