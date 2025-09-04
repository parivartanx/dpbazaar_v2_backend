import { IUserRepository } from '../interfaces/IUserRepository';
import { PrismaClient, User, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role || UserRole.CUSTOMER,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
    }>
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await prisma.user.update({ where: { id }, data: { password } });
  }

  async lockUser(id: string, lockedUntil: Date): Promise<User> {
    return prisma.user.update({ where: { id }, data: { lockedUntil } });
  }

  async unlockUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lockedUntil: null, failedLoginAttempts: 0 },
    });
  }

  async list(params?: {
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }): Promise<User[]> {
    const { role, status, page = 1, limit = 20 } = params || {};
    return prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(status && { status }),
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}

// import { IUserRepository } from '../interfaces/IUserRepository';
// import { PrismaClient, User, UserRole } from '@prisma/client';

// const prisma = new PrismaClient();

// export class UserRepository implements IUserRepository {
//   async findByEmail(email: string) {
//     return prisma.user.findUnique({
//       where: { email },
//     });
//   }
//   async create(data: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     role?: UserRole;
//   }) {
//     return prisma.user.create({
//       data: {
//         email: data.email,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         password: data.password,
//         role: data.role || UserRole.CUSTOMER,
//       },
//     });
//   }

//   async findById(id: string): Promise<User | null> {
//     return await prisma.user.findUnique({
//       where: { id },
//     });
//   }

//   async updatePassword(id: string, password: string): Promise<void> {
//     await prisma.user.update({
//       where: { id },
//       data: { password },
//     });
//   }
// }
