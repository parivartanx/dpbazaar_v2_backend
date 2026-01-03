import { IUserRepository } from '../interfaces/IUserRepository';
import { User, UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import bcrypt from 'bcryptjs';




export class UserRepository implements IUserRepository {
  /** Find user by email */
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  /** Find user by id */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  /** Create user */
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
    isEmailVerified?: boolean;
  }): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role || UserRole.CUSTOMER,
        isEmailVerified: data.isEmailVerified ?? false,
      },
    });
  }

  /** Update user */
  async update(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      middleName?: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      isEmailVerified: boolean;
      isPhoneVerified: boolean;
      phone?: string;
      dateOfBirth?: Date;
      gender?: string;
      avatar?: string;
      bio?: string;
    }>
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  /** Delete user */
  async delete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /** Restore user */
  async restore(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  /** Update user password */
  async updatePassword(id: string, password: string): Promise<void> {
    // Hash password before updating
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id }, data: { password: hashedPassword } });
  }

  /** Verify password - Compare plain text password with hashed password */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /** Lock user */
  async lockUser(id: string, lockedUntil: Date): Promise<User> {
    return prisma.user.update({ where: { id }, data: { lockedUntil } });
  }

  /** Unlock user */
  async unlockUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { lockedUntil: null, failedLoginAttempts: 0 },
    });
  }

  /** List users */
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

/** Count User */
  async getUserCounts() {
    const total = await prisma.user.count({ where: { deletedAt: null } });
    const active = await prisma.user.count({ where: { status: 'ACTIVE', deletedAt: null } });
    const inactive = await prisma.user.count({ where: { status: 'INACTIVE', deletedAt: null } });
    const suspended = await prisma.user.count({ where: { status: 'SUSPENDED', deletedAt: null } });

    return { total, active, inactive, suspended };
  }

/** Filter search */
  async filterUsers(params: {
    gender?: string;
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { gender, status, search, page = 1, limit = 20 } = params;

    return prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(gender && { gender }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Count filtered users */
  async countFilteredUsers(params: {
    gender?: string;
    status?: UserStatus;
    search?: string;
  }) {
    const { gender, status, search } = params;

    return prisma.user.count({
      where: {
        deletedAt: null,
        ...(gender && { gender }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }
  
  async findFirst(params: {
    where: any;
  }): Promise<User | null> {
    return prisma.user.findFirst(params);
  }
  
  async createCustomer(data: {
    userId: string;
    customerCode: string;
  }) {
    return prisma.customer.create({
      data: {
        userId: data.userId,
        customerCode: data.customerCode,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            email: true,
            phone: true,
            username: true,
            role: true,
            status: true,
            isEmailVerified: true,
            isPhoneVerified: true,
            isTwoFactorEnabled: true,
            dateOfBirth: true,
            gender: true,
            avatar: true,
            bio: true,
            lastLoginAt: true,
            lastLoginIp: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }
}