import { EmployeeActivity } from '@prisma/client';

export interface IEmployeeActivityRepository {
  findById(id: string): Promise<EmployeeActivity | null>;
  findAll(filters?: any): Promise<EmployeeActivity[]>;
  count(filters?: any): Promise<number>;
}
