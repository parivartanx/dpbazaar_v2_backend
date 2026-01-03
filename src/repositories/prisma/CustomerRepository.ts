import { PrismaClient, Customer, Prisma } from '@prisma/client';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { USER_FIELDS_SELECT } from '../constants';

const prisma = new PrismaClient();

export class CustomerRepository implements ICustomerRepository {
  async list(params?: {
    page?: number;
    limit?: number;
    tier?: string;
    search?: string;
  }): Promise<Customer[]> {
    const { page = 1, limit = 20, tier, search } = params || {};
    const where: Prisma.CustomerWhereInput = { deletedAt: null };

    if (tier) where.tier = tier;
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { customerCode: { contains: search } },
      ];
    }

    return prisma.customer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { userId },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async create(
    data: Omit<
      Prisma.CustomerUncheckedCreateInput,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Customer> {
    return prisma.customer.create({
      data,
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CustomerUpdateInput
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data,
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async softDelete(id: string): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }

  async restore(id: string): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: { deletedAt: null },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
      },
    });
  }
}

// import { PrismaClient, Customer, Prisma } from '@prisma/client';
// import { ICustomerRepository } from '../interfaces/ICustomerRepository';

// const prisma = new PrismaClient();

// export class CustomerRepository implements ICustomerRepository {
//   async list(params?: {
//     page?: number;
//     limit?: number;
//     tier?: string;
//     search?: string;
//   }): Promise<Customer[]> {
//     const { page = 1, limit = 20, tier, search } = params || {};
//     const where: Prisma.CustomerWhereInput = { deletedAt: null };

//     if (tier) where.tier = tier;
//     if (search) {
//       where.OR = [
//         { firstName: { contains: search, mode: 'insensitive' } },
//         { lastName: { contains: search, mode: 'insensitive' } },
//         { customerCode: { contains: search } },
//       ];
//     }

//     return prisma.customer.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//     });
//   }

//   async findById(id: string): Promise<Customer | null> {
//     return prisma.customer.findUnique({ where: { id } });
//   }

//   async findByUserId(userId: string): Promise<Customer | null> {
//     return prisma.customer.findUnique({ where: { userId } });
//   }

//   // Fix: use Prisma.CustomerCreateInput
//   async create(
//     data: Omit<Prisma.CustomerCreateInput, 'id' | 'createdAt' | 'updatedAt'>
//   ): Promise<Customer> {
//     return prisma.customer.create({ data });
//   }

//   // Fix: use Prisma.CustomerUpdateInput
//   async update(
//     id: string,
//     data: Prisma.CustomerUpdateInput
//   ): Promise<Customer> {
//     return prisma.customer.update({ where: { id }, data });
//   }

//   async softDelete(id: string): Promise<Customer> {
//     return prisma.customer.update({
//       where: { id },
//       data: { deletedAt: new Date() },
//     });
//   }

//   async restore(id: string): Promise<Customer> {
//     return prisma.customer.update({
//       where: { id },
//       data: { deletedAt: null },
//     });
//   }
// }
