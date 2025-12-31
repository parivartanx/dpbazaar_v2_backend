import { Banner } from '@prisma/client';

export interface IBannerRepository {
  create(data: any): Promise<Banner>;
  update(id: string, data: any): Promise<Banner>;
  delete(id: string): Promise<Banner>;
  findById(id: string): Promise<Banner | null>;
  findAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ data: Banner[]; total: number; page: number; limit: number; totalPages: number }>;
  incrementImpressions(id: string): Promise<Banner>;
  incrementClicks(id: string): Promise<Banner>;
  getActiveBanners(): Promise<Banner[]>;
}