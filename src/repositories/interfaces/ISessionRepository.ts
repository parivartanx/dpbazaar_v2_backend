import { Session } from '@prisma/client';

export interface ISessionRepository {
  getAll(params?: {
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<Session[]>;

  getById(id: string): Promise<Session | null>;

  deleteById(id: string): Promise<Session>;

  deleteByUserId(userId: string): Promise<number>;
  
  countFiltered(params?: {
    userId?: string;
  }): Promise<number>;
}
