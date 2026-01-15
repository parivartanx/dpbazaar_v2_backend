import { Department, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IDepartmentRepository } from '../interfaces/IDepartmentRepository';
import { USER_FIELDS_SELECT } from '../constants';

export class DepartmentRepository implements IDepartmentRepository {
  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return prisma.department.create({
      data,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(skip = 0, take = 50): Promise<Department[]> {
    return prisma.department.findMany({
      skip,
      take,
      where: { isActive: true },
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

  async filterDepartments(params: {
    search?: string;
    isActive?: boolean;
    parentId?: string;
    page?: number;
    limit?: number;
  }): Promise<Department[]> {
    const { search, isActive, parentId, page = 1, limit = 20 } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (parentId !== undefined) {
      where.parentId = parentId || null;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { code: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.department.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countFilteredDepartments(params: {
    search?: string;
    isActive?: boolean;
    parentId?: string;
  }): Promise<number> {
    const { search, isActive, parentId } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (parentId !== undefined) {
      where.parentId = parentId || null;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { code: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.department.count({ where });
  }
}
