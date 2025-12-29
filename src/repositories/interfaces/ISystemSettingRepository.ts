import { SystemSetting, Prisma } from '@prisma/client';

export interface ISystemSettingRepository {
  create(data: Prisma.SystemSettingCreateInput): Promise<SystemSetting>;
  update(key: string, data: Prisma.SystemSettingUpdateInput): Promise<SystemSetting>;
  delete(key: string): Promise<SystemSetting>;
  findByKey(key: string): Promise<SystemSetting | null>;
  getAll(): Promise<SystemSetting[]>;
}
