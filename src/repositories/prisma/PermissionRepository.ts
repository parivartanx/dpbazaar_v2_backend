import { Permission, Prisma, PermissionAction } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IPermissionRepository } from '../interfaces/IPermissionRepository';



export class PermissionRepository implements IPermissionRepository {
  async create(data: Prisma.PermissionCreateInput): Promise<Permission> {
    return prisma.permission.create({ data });
  }

  async findAll(skip = 0, take = 50): Promise<Permission[]> {
    return prisma.permission.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Permission | null> {
    return prisma.permission.findUnique({ where: { id } });
  }

  async update(
    id: string,
    data: Prisma.PermissionUpdateInput
  ): Promise<Permission> {
    return prisma.permission.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.permission.delete({ where: { id } });
  }

  async filterPermissions(params: {
    search?: string;
    resource?: string;
    action?: PermissionAction;
    page?: number;
    limit?: number;
  }): Promise<Permission[]> {
    const { search, resource, action, page = 1, limit = 20 } = params;

    const where: any = {};

    if (resource) {
      where.resource = resource;
    }

    if (action) {
      where.action = action;
    }

    if (search) {
      where.OR = [
        { resource: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.permission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async countFilteredPermissions(params: {
    search?: string;
    resource?: string;
    action?: PermissionAction;
  }): Promise<number> {
    const { search, resource, action } = params;

    const where: any = {};

    if (resource) {
      where.resource = resource;
    }

    if (action) {
      where.action = action;
    }

    if (search) {
      where.OR = [
        { resource: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    return prisma.permission.count({ where });
  }
}
