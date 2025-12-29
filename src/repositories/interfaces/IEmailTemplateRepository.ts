import { EmailTemplate } from '@prisma/client';

export interface IEmailTemplateRepository {
  create(data: any): Promise<EmailTemplate>;
  update(id: string, data: any): Promise<EmailTemplate>;
  delete(id: string): Promise<EmailTemplate>;
  getById(id: string): Promise<EmailTemplate | null>;
  getByCode(code: string): Promise<EmailTemplate | null>;
  getAll(): Promise<EmailTemplate[]>;
}
