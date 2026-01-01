import { Address, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IAddressRepository } from '../interfaces/IAddressRepository';

export class AddressRepository implements IAddressRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    search?: string;
  }): Promise<Address[]> {
    const { page = 1, limit = 20, customerId, search } = params || {};
    const where: Prisma.AddressWhereInput = { deletedAt: null };

    if (customerId) where.customerId = customerId;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { addressLine1: { contains: search, mode: 'insensitive' } },
        { addressLine2: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { postalCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.address.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Address | null> {
    return prisma.address.findUnique({ where: { id } });
  }
  
  async findByCustomerId(customerId: string): Promise<Address[]> {
    return prisma.address.findMany({ 
      where: { 
        customerId,
        deletedAt: null 
      },
      orderBy: { createdAt: 'desc' 
    } });
  }

  async create(
    data: Omit<
      Prisma.AddressCreateInput,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Address> {
    // Check if customer exists before creating address
    const customerId = (data as any).customerId;
    if (customerId) {
      const customerExists = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customerExists) {
        throw new Error(`Customer with ID ${customerId} does not exist. Please provide a valid customer ID.`);
      }
    } else {
      throw new Error('Customer ID is required to create an address.');
    }

    return prisma.address.create({ data });
  }

  async update(
    id: string,
    data: Prisma.AddressUpdateInput
  ): Promise<Address> {
    return prisma.address.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Address> {
    return prisma.address.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<Address> {
    return prisma.address.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}