import { PrismaClient, JobExecution } from '@prisma/client';
import { IJobExecutionRepository } from '../interfaces/jobExecution.repository.interface';

const prisma = new PrismaClient();

export class JobExecutionRepository implements IJobExecutionRepository {
  async findById(id: string): Promise<JobExecution | null> {
    return prisma.jobExecution.findUnique({
      where: { id },
    });
  }

  async findAll(filters?: { status?: string; jobName?: string; page?: number; limit?: number }): Promise<JobExecution[]> {
    const { status, jobName, page = 1, limit = 10 } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (jobName) where.jobName = { contains: jobName, mode: 'insensitive' };

    return prisma.jobExecution.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startedAt: 'desc' },
    });
  }

  async count(filters?: { status?: string; jobName?: string }): Promise<number> {
    const { status, jobName } = filters || {};
    const where: any = {};

    if (status) where.status = status;
    if (jobName) where.jobName = { contains: jobName, mode: 'insensitive' };

    return prisma.jobExecution.count({ where });
  }
}
