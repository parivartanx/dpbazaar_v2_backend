import { Permission, Prisma } from '@prisma/client';
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
}
