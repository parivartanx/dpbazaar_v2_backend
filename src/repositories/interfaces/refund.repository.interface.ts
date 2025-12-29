import { Refund } from '@prisma/client';

export interface IRefundRepository {
  create(data: any): Promise<Refund>;
  findById(id: string): Promise<Refund | null>;
  findAll(filters?: any): Promise<Refund[]>;
  update(id: string, data: any): Promise<Refund>;
  delete(id: string): Promise<Refund>;
  count(filters?: any): Promise<number>;
}
