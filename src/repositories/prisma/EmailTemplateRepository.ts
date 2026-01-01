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

  async getAll(): Promise<EmailTemplate[]> {
    return prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}
