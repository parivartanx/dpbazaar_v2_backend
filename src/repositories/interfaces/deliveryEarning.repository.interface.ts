import { DeliveryEarning } from '@prisma/client';

export interface IDeliveryEarningRepository {
  create(data: any): Promise<DeliveryEarning>;
  findById(id: string): Promise<DeliveryEarning | null>;
  findAll(filters?: any): Promise<DeliveryEarning[]>;
  update(id: string, data: any): Promise<DeliveryEarning>;
  delete(id: string): Promise<DeliveryEarning>;
  count(filters?: any): Promise<number>;
}
