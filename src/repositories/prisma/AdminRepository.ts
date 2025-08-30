// import { PrismaClient, User, Employee, Permission } from '@prisma/client';
// import {
//   IAdminRepository,
//   GetAllUsersParams,
//   GetAllEmployeesParams,
// } from '../interfaces/IAdminRepository';
// import { PaginatedResponse } from '../../types/common';

// const prisma = new PrismaClient();

// export class AdminRepository implements IAdminRepository {
//   // ================== USERS ==================
//   async getAllUsers({
//     page,
//     limit,
//     search,
//     role,
//     status,
//     sortBy,
//     sortOrder,
//   }: GetAllUsersParams): Promise<PaginatedResponse<User>> {
//     const where: any = {};
//     if (search) {
//       where.OR = [
//         { firstName: { contains: search, mode: 'insensitive' } },
//         { lastName: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } },
//       ];
//     }
//     if (role) where.role = role;
//     if (status) where.status = status;

//     const orderBy = sortBy
//       ? { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' }
//       : { createdAt: 'desc' as const };

//     const [data, total] = await Promise.all([
//       prisma.user.findMany({
//         where,
//         skip: (page! - 1) * limit!,
//         take: limit!,
//         orderBy,
//       }),
//       prisma.user.count({ where }),
//     ]);

//     return {
//       data,
//       pagination: {
//         page: page!,
//         limit: limit!,
//         total,
//         totalPages: Math.ceil(total / limit!),
//       },
//     };
//   }

//   async getUserById(id: string) {
//     return prisma.user.findUnique({ where: { id } });
//   }

//   async updateUserStatus(id: string, status: string) {
//     return prisma.user.update({
//       where: { id },
//       data: { status: status as any },
//     });
//   }

//   async deleteUser(id: string) {
//     await prisma.user.delete({ where: { id } });
//   }

//   // ================== EMPLOYEES ==================
//   async createEmployee(data: Partial<Employee>) {
//     return prisma.employee.create({ data: data as any });
//   }

//   async getAllEmployees({
//     page,
//     limit,
//     search,
//     department,
//     status,
//     sortBy,
//     sortOrder,
//   }: GetAllEmployeesParams): Promise<PaginatedResponse<Employee>> {
//     const where: any = {};
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: 'insensitive' } },
//         { email: { contains: search, mode: 'insensitive' } },
//       ];
//     }
//     if (department) where.department = department;
//     if (status) where.status = status;

//     const orderBy = sortBy
//       ? { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' }
//       : { createdAt: 'desc' as const };

//     const [data, total] = await Promise.all([
//       prisma.employee.findMany({
//         where,
//         skip: (page! - 1) * limit!,
//         take: limit!,
//         orderBy,
//       }),
//       prisma.employee.count({ where }),
//     ]);

//     return {
//       data,
//       pagination: {
//         page: page!,
//         limit: limit!,
//         total,
//         totalPages: Math.ceil(total / limit!),
//       },
//     };
//   }

//   async getEmployeeById(id: string) {
//     return prisma.employee.findUnique({ where: { id } });
//   }

//   async updateEmployee(id: string, data: Partial<Employee>) {
//     return prisma.employee.update({
//       where: { id },
//       data: data as import('@prisma/client').Prisma.EmployeeUpdateInput,
//     });
//   }

//   async updateEmployeeStatus(id: string, status: string) {
//     return prisma.employee.update({
//       where: { id },
//       data: { status: status as import('@prisma/client').EmployeeStatus },
//     });
//   }

//   async deleteEmployee(id: string) {
//     await prisma.employee.delete({ where: { id } });
//   }

//   // ================== PERMISSIONS ==================
//   async getEmployeePermissions(employeeId: string): Promise<Permission[]> {
//     const employeeWithPermissions = await prisma.employee.findUnique({
//       where: { id: employeeId },
//       include: {
//         permissions: {
//           select: {
//             id: true,
//             action: true,
//             description: true,
//             createdAt: true,
//           },
//         },
//       },
//     });
//     return employeeWithPermissions?.permissions ?? [];
//   }

//   async assignPermission(employeeId: string, permissionId: string) {
//     await prisma.employee.update({
//       where: { id: employeeId },
//       data: { permissions: { connect: { id: permissionId } } },
//     });
//   }

//   async revokePermission(employeeId: string, permissionId: string) {
//     await prisma.employee.update({
//       where: { id: employeeId },
//       data: { permissions: { disconnect: { id: permissionId } } },
//     });
//   }
// }
