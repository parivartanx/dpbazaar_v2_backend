import { Address, Prisma } from '@prisma/client';

export interface IAddressRepository {
  list(params?: {
    page?: number;
    limit?: number;
    customerId?: string;
    search?: string;
  }): Promise<Address[]>;

  findById(id: string): Promise<Address | null>;
  
  findByCustomerId(customerId: string): Promise<Address[]>;

  create(
    data: Omit<
      Prisma.AddressCreateInput,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Address>;

  update(id: string, data: Prisma.AddressUpdateInput): Promise<Address>;

  softDelete(id: string): Promise<Address>;
  restore(id: string): Promise<Address>;
}