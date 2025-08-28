import { User, Employee, Permission } from '@prisma/client';
import { PaginatedResponse, PaginationParams } from '../../types/common';

export interface GetAllUsersParams extends PaginationParams {
  search?: string;
  role?: string;
  status?: string;
}

export interface GetAllEmployeesParams extends PaginationParams {
  search?: string;
  department?: string;
  status?: string;
}

export interface IAdminRepository {
  // USER MANAGEMENT
  getAllUsers(params: GetAllUsersParams): Promise<PaginatedResponse<User>>;
  getUserById(id: string): Promise<User | null>;
  updateUserStatus(id: string, status: string): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // EMPLOYEE MANAGEMENT
  createEmployee(data: Partial<Employee>): Promise<Employee>;
  getAllEmployees(
    params: GetAllEmployeesParams
  ): Promise<PaginatedResponse<Employee>>;
  getEmployeeById(id: string): Promise<Employee | null>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
  updateEmployeeStatus(id: string, status: string): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;

  // PERMISSIONS
  getEmployeePermissions(employeeId: string): Promise<Permission[]>;
  assignPermission(employeeId: string, permissionId: string): Promise<void>;
  revokePermission(employeeId: string, permissionId: string): Promise<void>;
}
