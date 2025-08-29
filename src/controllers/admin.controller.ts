import { Request, Response } from 'express';
import { AdminService } from '../services/admin.services';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/common';
import { AdminRepository } from '../repositories/prisma/AdminRepository';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService(new AdminRepository());
  }

  // =====================================================
  // USER MANAGEMENT
  // =====================================================

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, search, role, status } = req.query;

      const result = await this.adminService.getAllUsers({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        search: (search as string) || '',
        role: (role as string) || '',
        status: (status as string) || '',
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Users retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Get all users error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to retrieve users',
        message: 'Failed to retrieve users',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const result = await this.adminService.getUserById(id);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Get user by id error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to retrieve user',
        message: 'Failed to retrieve user',
        timestamp: new Date().toISOString(),
      };

      res.status(404).json(response);
    }
  };

  public updateUserStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const { status } = req.body as { status?: string };

      if (!status) {
        throw new Error('Status is required');
      }

      const result = await this.adminService.updateUserStatus(id, status);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User status updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Update user status error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update user status',
        message: 'Failed to update user status',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      await this.adminService.deleteUser(id);

      const response: ApiResponse = {
        success: true,
        message: 'User deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Delete user error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
        message: 'Failed to delete user',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  // =====================================================
  // EMPLOYEE MANAGEMENT
  // =====================================================

  public createEmployee = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const employeeData = req.body;

      const result = await this.adminService.createEmployee(employeeData);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employee created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Create employee error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create employee',
        message: 'Failed to create employee',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public getAllEmployees = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { page, limit, search, department, status } = req.query;

      const result = await this.adminService.getAllEmployees({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 10,
        search: (search as string) || '',
        department: (department as string) || '',
        status: (status as string) || '',
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employees retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Get all employees error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve employees',
        message: 'Failed to retrieve employees',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };

  public getEmployeeById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const result = await this.adminService.getEmployeeById(id);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employee retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Get employee by id error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve employee',
        message: 'Failed to retrieve employee',
        timestamp: new Date().toISOString(),
      };

      res.status(404).json(response);
    }
  };

  public updateEmployee = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const updateData = req.body;

      const result = await this.adminService.updateEmployee(id, updateData);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employee updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Update employee error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update employee',
        message: 'Failed to update employee',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public updateEmployeeStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const { status } = req.body as { status?: string };

      if (!status) {
        throw new Error('Status is required');
      }

      const result = await this.adminService.updateEmployeeStatus(id, status);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employee status updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Update employee status error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update employee status',
        message: 'Failed to update employee status',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public deleteEmployee = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      await this.adminService.deleteEmployee(id);

      const response: ApiResponse = {
        success: true,
        message: 'Employee deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Delete employee error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete employee',
        message: 'Failed to delete employee',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  // =====================================================
  // EMPLOYEE PERMISSIONS
  // =====================================================

  public getEmployeePermissions = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const result = await this.adminService.getEmployeePermissions(id);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Employee permissions retrieved successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Get employee permissions error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve employee permissions',
        message: 'Failed to retrieve employee permissions',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };

  public assignPermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const { permissionId } = req.body as { permissionId?: string };

      if (!permissionId) {
        throw new Error('permissionId is required');
      }

      const result = await this.adminService.assignPermission(id, permissionId);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Permission assigned successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Assign permission error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to assign permission',
        message: 'Failed to assign permission',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public revokePermission = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id, permissionId } = req.params as {
        id: string;
        permissionId: string;
      };

      await this.adminService.revokePermission(id, permissionId);

      const response: ApiResponse = {
        success: true,
        message: 'Permission revoked successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Revoke permission error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to revoke permission',
        message: 'Failed to revoke permission',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };
}
