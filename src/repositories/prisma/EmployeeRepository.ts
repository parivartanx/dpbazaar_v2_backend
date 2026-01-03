import { Employee, Prisma, EmployeeStatus } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class EmployeeRepository implements IEmployeeRepository {
  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return prisma.employee.create({
      data,
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
    });
  }

  async findAll(skip = 0, take = 50): Promise<Employee[]> {
    return prisma.employee.findMany({
      skip,
      take,
      where: { deletedAt: null },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.EmployeeUpdateInput
  ): Promise<Employee> {
    return prisma.employee.update({
      where: { id },
      data,
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() }, // Soft delete
    });
  }

  async updateStatus(id: string, status: string): Promise<Employee> {
    return prisma.employee.update({
      where: { id },
      data: { status: status as EmployeeStatus },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
    });
  }

  async assignDepartment(id: string, departmentId: string): Promise<Employee> {
    return prisma.employee.update({
      where: { id },
      data: { departmentId },
      include: {
        user: {
          select: USER_FIELDS_SELECT,
        },
        department: true,
        permissions: { include: { permission: true } },
      },
    });
  }
}
