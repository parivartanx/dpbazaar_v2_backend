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
    isEmailVerified?: boolean;
  }): Promise<User>;
  update(
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
  
  /** Filter and search users with pagination */
  filterUsers(params: {
    gender?: string;
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<User[]>;
  
  /** Count filtered users */
  countFilteredUsers(params: {
    gender?: string;
    status?: UserStatus;
    search?: string;
  }): Promise<number>;
  
  findFirst(params: {
    where: any;
  }): Promise<User | null>;
  
  createCustomer(data: {
    userId: string;
    customerCode: string;
  }): Promise<any>;
}