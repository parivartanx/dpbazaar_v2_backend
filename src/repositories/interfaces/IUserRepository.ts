import { User, UserRole, UserStatus } from '@prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User>;
  update(
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
  ): Promise<User>;
  delete(id: string): Promise<User>;
  restore(id: string): Promise<User>;
  updatePassword(id: string, password: string): Promise<void>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  lockUser(id: string, lockedUntil: Date): Promise<User>;
  unlockUser(id: string): Promise<User>;
  list(params?: {
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
  }): Promise<User[]>;
}
