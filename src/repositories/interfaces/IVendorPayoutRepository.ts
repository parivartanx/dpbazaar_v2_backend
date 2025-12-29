import { VendorPayout, Prisma } from '@prisma/client';

export interface IVendorPayoutRepository {
  create(data: Prisma.VendorPayoutCreateInput): Promise<VendorPayout>;
  update(id: string, data: Prisma.VendorPayoutUpdateInput): Promise<VendorPayout>;
  delete(id: string): Promise<VendorPayout>;
  findById(id: string): Promise<VendorPayout | null>;
  getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ payouts: VendorPayout[]; total: number }>;
  findByVendorId(vendorId: string): Promise<VendorPayout[]>;
}
