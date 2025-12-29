import { Discount } from '@prisma/client';

export interface IDiscountRepository {
  getAll(filters?: any): Promise<Discount[]>;
  getById(id: string): Promise<Discount | null>;
  getByCode(code: string): Promise<Discount | null>;
  create(data: any): Promise<Discount>;
  update(id: string, data: any): Promise<Discount>;
  delete(id: string): Promise<void>;
}
