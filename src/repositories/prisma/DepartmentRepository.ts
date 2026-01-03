import { Department, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IDepartmentRepository } from '../interfaces/IDepartmentRepository';
import { USER_FIELDS_SELECT } from '../constants';



export class DepartmentRepository implements IDepartmentRepository {
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return prisma.department.create({ data });
  }

  async findAll(skip = 0, take = 50): Promise<Department[]> {
    return prisma.department.findMany({
      skip,
      take,
      include: {
        employees: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        children: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            user: {
              select: USER_FIELDS_SELECT,
            },
          },
        },
        children: true,
        parent: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.DepartmentUpdateInput
  ): Promise<Department> {
    return prisma.department.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.department.delete({ where: { id } });
  }
}
