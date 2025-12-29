import { DeliveryAgent } from '@prisma/client';

export interface IDeliveryAgentRepository {
  create(data: any): Promise<DeliveryAgent>;
  update(id: string, data: any): Promise<DeliveryAgent>;
  delete(id: string): Promise<DeliveryAgent>;
  getById(id: string): Promise<DeliveryAgent | null>;
  getAll(filters?: any): Promise<DeliveryAgent[]>;
  findByCode(code: string): Promise<DeliveryAgent | null>;
}
