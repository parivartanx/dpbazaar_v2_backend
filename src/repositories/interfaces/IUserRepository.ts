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
