import { Vendor } from '@prisma/client';

export interface IVendorRepository {
  getAll(filters?: any): Promise<Vendor[]>;
  getById(id: string): Promise<Vendor | null>;
  create(data: any): Promise<Vendor>;
  update(id: string, data: any): Promise<Vendor>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<Vendor>;
  countFiltered(filters?: any): Promise<number>;
}
