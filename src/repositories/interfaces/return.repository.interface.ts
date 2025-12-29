import { Return } from '@prisma/client';

export interface IReturnRepository {
  create(data: any): Promise<Return>;
  findById(id: string): Promise<Return | null>;
  findAll(filters?: any): Promise<Return[]>;
  update(id: string, data: any): Promise<Return>;
  delete(id: string): Promise<Return>;
  count(filters?: any): Promise<number>;
}
