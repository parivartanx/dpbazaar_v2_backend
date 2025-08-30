import { Employee, Prisma } from '@prisma/client';

export interface IEmployeeRepository {
  create(data: Prisma.EmployeeCreateInput): Promise<Employee>;
  findAll(skip?: number, take?: number): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  update(id: string, data: Prisma.EmployeeUpdateInput): Promise<Employee>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<Employee>;
  assignDepartment(id: string, departmentId: string): Promise<Employee>;
}
