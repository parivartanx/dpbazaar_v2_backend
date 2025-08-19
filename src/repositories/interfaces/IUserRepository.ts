import { User, UserRole } from '@prisma/client';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<User>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
}

export interface IUserRepository {
  updatePassword(id: string, password: string): Promise<void>;
}
