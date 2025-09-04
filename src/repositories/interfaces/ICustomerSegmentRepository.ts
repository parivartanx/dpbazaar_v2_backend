import { CustomerSegment, Prisma } from '@prisma/client';

export interface ICustomerSegmentRepository {
  findById(id: string): Promise<CustomerSegment | null>;
  listByCustomer(customerId: string): Promise<CustomerSegment[]>;

  create(
    data: Omit<Prisma.CustomerSegmentUncheckedCreateInput, 'id' | 'createdAt'>
  ): Promise<CustomerSegment>;

  update(
    id: string,
    data: Prisma.CustomerSegmentUpdateInput
  ): Promise<CustomerSegment>;
  delete(id: string): Promise<CustomerSegment>;
}
