import { PrismaClient, Session } from '@prisma/client';
import { ISessionRepository } from '../interfaces/ISessionRepository';

const prisma = new PrismaClient();

export class SessionRepository implements ISessionRepository {
  async getAll(params?: {
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<Session[]> {
    const { userId, page = 1, limit = 20 } = params || {};

    const whereClause: any = {}; // dynamic where clause
    if (userId) whereClause.userId = userId;

    return prisma.session.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({ where: { id } });
  }

  async deleteById(id: string): Promise<Session> {
    return prisma.session.delete({ where: { id } });
  }

  async deleteByUserId(userId: string): Promise<number> {
    const deleted = await prisma.session.deleteMany({ where: { userId } });
    return deleted.count;
  }
}
