import { Delivery } from '@prisma/client';

export interface IDeliveryRepository {
  create(data: any): Promise<Delivery>;
  update(id: string, data: any): Promise<Delivery>;
  delete(id: string): Promise<Delivery>;
  getById(id: string): Promise<Delivery | null>;
  getAll(filters?: any): Promise<Delivery[]>;
  findByOrderId(orderId: string): Promise<Delivery | null>;
  findByAgentId(agentId: string): Promise<Delivery[]>;
  countFiltered(filters?: any): Promise<number>;
}
