import { EmployeePermission, Prisma } from '@prisma/client';

export interface IEmployeePermissionRepository {
  assign(
    data: Prisma.EmployeePermissionCreateInput
  ): Promise<EmployeePermission>;
  revoke(id: string): Promise<void>;
  findByEmployeeId(employeeId: string): Promise<EmployeePermission[]>;
}
