import { Customer, Prisma } from '@prisma/client';

export interface ICustomerRepository {
  list(params?: {
    page?: number;
    limit?: number;
    tier?: string;
    search?: string;
  }): Promise<Customer[]>;

  findById(id: string): Promise<Customer | null>;
  findByUserId(userId: string): Promise<Customer | null>;

  // Use Unchecked input for create so userId can be provided directly
  create(
    data: Omit<
      Prisma.CustomerUncheckedCreateInput,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Customer>;

  update(id: string, data: Prisma.CustomerUpdateInput): Promise<Customer>;

  softDelete(id: string): Promise<Customer>;
  restore(id: string): Promise<Customer>;
}
// import { Customer } from '@prisma/client';

// export interface ICustomerRepository {
//   list(params?: {
//     page?: number;
//     limit?: number;
//     tier?: string;
//     search?: string;
//   }): Promise<Customer[]>;

//   findById(id: string): Promise<Customer | null>;

//   findByUserId(userId: string): Promise<Customer | null>;

//   create(data: Partial<Customer>): Promise<Customer>;

//   update(id: string, data: Partial<Customer>): Promise<Customer>;

//   softDelete(id: string): Promise<Customer>;

//   restore(id: string): Promise<Customer>;
// }
