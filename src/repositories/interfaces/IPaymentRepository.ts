import { Payment, Prisma } from '@prisma/client';

export interface IPaymentRepository {
  create(data: Prisma.PaymentCreateInput): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment>;
  delete(id: string): Promise<Payment>;
  list(filters?: { orderId?: string; status?: string; method?: string; page?: number; limit?: number }): Promise<Payment[]>;
  countFiltered(filters?: { orderId?: string; status?: string; method?: string }): Promise<number>;
}