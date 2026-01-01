import { SystemSetting, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';

import { ISystemSettingRepository } from '../interfaces/ISystemSettingRepository';

export class SystemSettingRepository implements ISystemSettingRepository {
  async create(data: Prisma.SystemSettingCreateInput): Promise<SystemSetting> {
    return await prisma.systemSetting.create({
      data,
    });
  }

  async update(key: string, data: Prisma.SystemSettingUpdateInput): Promise<SystemSetting> {
    return await prisma.systemSetting.update({
      where: { key },
      data,
    });
  }

  async delete(key: string): Promise<SystemSetting> {
    return await prisma.systemSetting.delete({
      where: { key },
    });
  }

  async findByKey(key: string): Promise<SystemSetting | null> {
    return await prisma.systemSetting.findUnique({
      where: { key },
    });
  }

  async getAll(): Promise<SystemSetting[]> {
    return await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });
  }
}
