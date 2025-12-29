import { PrismaClient, EmployeeActivity } from '@prisma/client';
import { IEmployeeActivityRepository } from '../interfaces/employeeActivity.repository.interface';

const prisma = new PrismaClient();

export class EmployeeActivityRepository implements IEmployeeActivityRepository {
  async findById(id: string): Promise<EmployeeActivity | null> {
    return prisma.employeeActivity.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async findAll(filters?: { employeeId?: string; action?: string; page?: number; limit?: number }): Promise<EmployeeActivity[]> {
    const { employeeId, action, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (employeeId) where.employeeId = employeeId;
    if (action) where.action = action;

    return prisma.employeeActivity.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: true,
      },
    });
  }

  async count(filters?: { employeeId?: string; action?: string }): Promise<number> {
    const { employeeId, action } = filters || {};
    const where: any = {};

    if (employeeId) where.employeeId = employeeId;
    if (action) where.action = action;

    return prisma.employeeActivity.count({ where });
  }
}
