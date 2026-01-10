import { EmailTemplate } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IEmailTemplateRepository } from '../interfaces/IEmailTemplateRepository';



export class EmailTemplateRepository implements IEmailTemplateRepository {
  async create(data: any): Promise<EmailTemplate> {
    return prisma.emailTemplate.create({ data });
  }

  async update(id: string, data: any): Promise<EmailTemplate> {
    return prisma.emailTemplate.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<EmailTemplate> {
    return prisma.emailTemplate.delete({
      where: { id }
    });
  }

  async getById(id: string): Promise<EmailTemplate | null> {
    return prisma.emailTemplate.findUnique({
      where: { id }
    });
  }

  async getByCode(code: string): Promise<EmailTemplate | null> {
    return prisma.emailTemplate.findUnique({
      where: { code }
    });
  }

  async getAll(filters?: any): Promise<EmailTemplate[]> {
    const { page, limit, isActive, search } = filters || {};
    const where: any = {};

    if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const query: any = {
      where,
      orderBy: { createdAt: 'desc' }
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    return prisma.emailTemplate.findMany(query);
  }

  async countFiltered(filters?: any): Promise<number> {
    const { isActive, search } = filters || {};
    const where: any = {};

    if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.emailTemplate.count({ where });
  }
}
