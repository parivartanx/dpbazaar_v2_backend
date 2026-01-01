import { Invoice, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';



export class InvoiceRepository implements IInvoiceRepository {
  async create(data: Prisma.InvoiceCreateInput): Promise<Invoice> {
    return await prisma.invoice.create({
      data,
    });
  }

  async update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Invoice> {
    return await prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Invoice> {
    return await prisma.invoice.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Invoice | null> {
    return await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            customerName: true,
            totalAmount: true,
          }
        }
      }
    });
  }

  async findByOrderId(orderId: string): Promise<Invoice | null> {
    return await prisma.invoice.findFirst({
      where: { orderId },
    });
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    return await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });
  }

  async getAll(filters?: any, pagination?: { page: number; limit: number }): Promise<{ invoices: Invoice[]; total: number }> {
    const { page = 1, limit = 10 } = pagination || {};
    const skip = (page - 1) * limit;

    const where: Prisma.InvoiceWhereInput = {};

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.orderId) {
        where.orderId = filters.orderId;
      }
      if (filters.invoiceNumber) {
        where.invoiceNumber = { contains: filters.invoiceNumber, mode: 'insensitive' };
      }
      if (filters.startDate && filters.endDate) {
        where.createdAt = {
          gte: filters.startDate,
          lte: filters.endDate,
        };
      }
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              customerName: true,
              totalAmount: true,
            }
          }
        }
      }),
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total };
  }
}
