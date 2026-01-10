import { Permission, Prisma, PermissionAction } from '@prisma/client';

export interface IPermissionRepository {
  create(data: Prisma.PermissionCreateInput): Promise<Permission>;
  findAll(skip?: number, take?: number): Promise<Permission[]>;
  findById(id: string): Promise<Permission | null>;
  update(id: string, data: Prisma.PermissionUpdateInput): Promise<Permission>;
  delete(id: string): Promise<void>;
  filterPermissions(params: {
    search?: string;
    resource?: string;
    action?: PermissionAction;
    page?: number;
    limit?: number;
  }): Promise<Permission[]>;
  countFilteredPermissions(params: {
    search?: string;
    resource?: string;
    action?: PermissionAction;
  }): Promise<number>;
}
