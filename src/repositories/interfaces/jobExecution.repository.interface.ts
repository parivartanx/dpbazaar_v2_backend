import { JobExecution } from '@prisma/client';

export interface IJobExecutionRepository {
  findById(id: string): Promise<JobExecution | null>;
  findAll(filters?: any): Promise<JobExecution[]>;
  count(filters?: any): Promise<number>;
}
