import { Warehouse } from '@prisma/client';

export interface IWarehouseRepository {
  create(data: any): Promise<Warehouse>;
  update(id: string, data: any): Promise<Warehouse>;
  delete(id: string): Promise<Warehouse>;
  getById(id: string): Promise<Warehouse | null>;
  getAll(filters?: any): Promise<Warehouse[]>;
  getByCode(code: string): Promise<Warehouse | null>;
}
