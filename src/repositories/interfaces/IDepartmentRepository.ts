import { Department, Prisma } from '@prisma/client';

export interface IDepartmentRepository {
  create(data: Prisma.DepartmentCreateInput): Promise<Department>;
  findAll(skip?: number, take?: number): Promise<Department[]>;
  findById(id: string): Promise<Department | null>;
  update(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department>;
  delete(id: string): Promise<void>;
  filterDepartments(params: {
    search?: string;
    isActive?: boolean;
    parentId?: string;
    page?: number;
    limit?: number;
  }): Promise<Department[]>;
  countFilteredDepartments(params: {
    search?: string;
    isActive?: boolean;
    parentId?: string;
  }): Promise<number>;
}
