import { PrismaClient, CustomerSegment, Prisma } from '@prisma/client';
import { ICustomerSegmentRepository } from '../interfaces/ICustomerSegmentRepository';

const prisma = new PrismaClient();

export class CustomerSegmentRepository implements ICustomerSegmentRepository {
  async findById(id: string): Promise<CustomerSegment | null> {
    return prisma.customerSegment.findUnique({ where: { id } });
  }

  async listByCustomer(customerId: string): Promise<CustomerSegment[]> {
    return prisma.customerSegment.findMany({ where: { customerId } });
  }

  async create(
    data: Omit<Prisma.CustomerSegmentUncheckedCreateInput, 'id' | 'createdAt'>
  ): Promise<CustomerSegment> {
    return prisma.customerSegment.create({ data });
  }

  async update(
    id: string,
    data: Prisma.CustomerSegmentUpdateInput
  ): Promise<CustomerSegment> {
    return prisma.customerSegment.update({ where: { id }, data });
  }

  async delete(id: string): Promise<CustomerSegment> {
    return prisma.customerSegment.delete({ where: { id } });
  }
}

// import { PrismaClient, CustomerSegment } from '@prisma/client';
// import { ICustomerSegmentRepository } from '../interfaces/ICustomerSegmentRepository';

// const prisma = new PrismaClient();

// export class CustomerSegmentRepository implements ICustomerSegmentRepository {
//   async findById(id: string) {
//     return prisma.customerSegment.findUnique({ where: { id } });
//   }

//   async listByCustomer(customerId: string) {
//     return prisma.customerSegment.findMany({ where: { customerId } });
//   }

//   async create(data: Partial<CustomerSegment>) {
//     return prisma.customerSegment.create({ data });
//   }

//   async update(id: string, data: Partial<CustomerSegment>) {
//     return prisma.customerSegment.update({ where: { id }, data });
//   }

//   async delete(id: string) {
//     return prisma.customerSegment.delete({ where: { id } });
//   }
// }
