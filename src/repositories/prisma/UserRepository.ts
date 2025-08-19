import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient, User, UserRole } from '@prisma/client';

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

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { password },
    });
  }
}
