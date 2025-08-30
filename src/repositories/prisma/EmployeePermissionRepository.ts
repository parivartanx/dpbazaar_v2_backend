import { PrismaClient, EmployeePermission, Prisma } from '@prisma/client';
import { IEmployeePermissionRepository } from '../interfaces/IEmployeePermissionRepository';

const prisma = new PrismaClient();

export class EmployeePermissionRepository
  implements IEmployeePermissionRepository
{
  async assign(
    data: Prisma.EmployeePermissionCreateInput
  ): Promise<EmployeePermission> {
    return prisma.employeePermission.create({ data });
  }

  async revoke(id: string): Promise<void> {
    await prisma.employeePermission.delete({ where: { id } });
  }

  async findByEmployeeId(employeeId: string): Promise<EmployeePermission[]> {
    return prisma.employeePermission.findMany({
      where: { employeeId },
      include: { permission: true },
    });
  }
}
