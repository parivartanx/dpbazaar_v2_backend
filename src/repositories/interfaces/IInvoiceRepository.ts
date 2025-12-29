import { Invoice, Prisma } from '@prisma/client';

export interface IInvoiceRepository {
  create(data: Prisma.InvoiceCreateInput): Promise<Invoice>;
  update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice>;
  delete(id: string): Promise<Invoice>;
  findById(id: string): Promise<Invoice | null>;
  findByOrderId(orderId: string): Promise<Invoice | null>;
  findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null>;
  getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ invoices: Invoice[]; total: number }>;
}
