import { PrismaClient, SystemSetting, Prisma } from '@prisma/client';
import { ISystemSettingRepository } from '../interfaces/ISystemSettingRepository';

const prisma = new PrismaClient();

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
