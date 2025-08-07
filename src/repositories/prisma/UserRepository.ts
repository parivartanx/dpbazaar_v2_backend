import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    return prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        role: data.role || UserRole.CUSTOMER,
      },
    });
  }
}
