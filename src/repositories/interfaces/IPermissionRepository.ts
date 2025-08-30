import { Permission, Prisma } from '@prisma/client';

export interface IPermissionRepository {
  create(data: Prisma.PermissionCreateInput): Promise<Permission>;
  findAll(skip?: number, take?: number): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  update(id: string, data: Prisma.PermissionUpdateInput): Promise<Permission>;
  delete(id: string): Promise<void>;
}
