import { PriceHistory } from '@prisma/client';

export interface IPriceHistoryRepository {
  findById(id: string): Promise<PriceHistory | null>;
  findAll(filters?: any): Promise<PriceHistory[]>;
  count(filters?: any): Promise<number>;
}
