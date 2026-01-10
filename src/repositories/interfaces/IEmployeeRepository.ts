import { Employee, Prisma, EmployeeStatus } from '@prisma/client';

export interface IEmployeeRepository {
  create(data: Prisma.EmployeeCreateInput): Promise<Employee>;
  findAll(skip?: number, take?: number): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  update(id: string, data: Prisma.EmployeeUpdateInput): Promise<Employee>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<Employee>;
  assignDepartment(id: string, departmentId: string): Promise<Employee>;
  filterEmployees(params: {
    search?: string;
    status?: EmployeeStatus;
    departmentId?: string;
    designation?: string;
    employmentType?: string;
    page?: number;
    limit?: number;
  }): Promise<Employee[]>;
  countFilteredEmployees(params: {
    search?: string;
    status?: EmployeeStatus;
    departmentId?: string;
    designation?: string;
    employmentType?: string;
  }): Promise<number>;
}
