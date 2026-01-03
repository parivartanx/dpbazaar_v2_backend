import { Request, Response } from 'express';
import { DepartmentRepository } from '../repositories/prisma/DepartmentRepository';
import { EmployeeRepository } from '../repositories/prisma/EmployeeRepository';
import { EmployeePermissionRepository } from '../repositories/prisma/EmployeePermissionRepository';
import { PermissionRepository } from '../repositories/prisma/PermissionRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

/**
 * ===========================
 * Department Controller
 * ===========================
 */
export class DepartmentController {
  private repo = new DepartmentRepository();

  createDepartment = async (req: Request, res: Response) => {
    try {
      const department = await this.repo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: { department },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating department',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getAllDepartments = async (req: Request, res: Response) => {
    try {
      const departments = await this.repo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Departments fetched successfully',
        data: { departments },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching departments',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getDepartmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({
          success: false,
          message: 'Department ID is required',
          timestamp: new Date().toISOString(),
        });

      const department = await this.repo.findById(id);
      if (!department)
        return res
          .status(404)
          .json({
            success: false,
            message: 'Department not found',
            timestamp: new Date().toISOString(),
          });

      return res.status(200).json({
        success: true,
        message: 'Department fetched successfully',
        data: { department },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching department',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  updateDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Department ID is required',
            timestamp: new Date().toISOString(),
          });

      const department = await this.repo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: { department },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating department',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  deleteDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Department ID is required',
            timestamp: new Date().toISOString(),
          });

      await this.repo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'department deleted',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Department',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };
}

/**
 * ===========================
 * Employee Controller
 * ===========================
 */
export class EmployeeController {
  private repo = new EmployeeRepository();
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  /**
   * Helper function to flatten employee response by merging user fields into employee object
   * Excludes user.id to avoid overwriting employee.id, since userId already exists
   */
  private flattenEmployeeResponse(employee: any): any {
    if (!employee || !employee.user) {
      return employee;
    }
    const { user: userData, ...employeeFields } = employee;
    const { id: userId, ...userFields } = userData; // Exclude user.id to avoid conflict
    return {
      ...employeeFields,
      ...userFields,
    };
  }

  /**
   * Helper function to flatten array of employee responses
   */
  private flattenEmployeeArray(employees: any[]): any[] {
    return employees.map(employee => this.flattenEmployeeResponse(employee));
  }

  createEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.repo.create(req.body);
      
      // Transform image keys to public URLs in the employee response
      const transformedEmployee = await this.imageUrlTransformer.transformCommonImageFields(employee);
      
      // Flatten employee response by merging user fields
      const flattenedEmployee = this.flattenEmployeeResponse(transformedEmployee);
      
      return res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: { employee: flattenedEmployee },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Employee',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getAllEmployees = async (_: Request, res: Response) => {
    try {
      const employees = await this.repo.findAll();
      
      // Transform image keys to public URLs in the employees response
      const transformedEmployees = await this.imageUrlTransformer.transformCommonImageFields(employees);
      
      // Flatten employee responses by merging user fields
      const flattenedEmployees = this.flattenEmployeeArray(transformedEmployees);
      
      return res.status(200).json({
        success: true,
        message: 'Employees fetched successfully',
        data: { employees: flattenedEmployees },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Employees',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getEmployeeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id required',
            timestamp: new Date().toISOString(),
          });

      const employee = await this.repo.findById(id);
      if (!employee)
        return res
          .status(404)
          .json({
            success: false,
            message: 'Employee not found',
            timestamp: new Date().toISOString(),
          });

      // Transform image keys to public URLs in the employee response
      const transformedEmployee = await this.imageUrlTransformer.transformCommonImageFields(employee);
      
      // Flatten employee response by merging user fields
      const flattenedEmployee = this.flattenEmployeeResponse(transformedEmployee);
      
      return res.status(200).json({
        success: true,
        message: 'Employee fetched successfully',
        data: { employee: flattenedEmployee },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Employee',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  updateEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id required',
            timestamp: new Date().toISOString(),
          });

      const updated = await this.repo.update(id, req.body);
      
      // Transform image keys to public URLs in the employee response
      const transformedEmployee = await this.imageUrlTransformer.transformCommonImageFields(updated);
      
      // Flatten employee response by merging user fields
      const flattenedEmployee = this.flattenEmployeeResponse(transformedEmployee);
      
      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: { employee: flattenedEmployee },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Employee',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  deleteEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id required',
            timestamp: new Date().toISOString(),
          });

      await this.repo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'employee deleted',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Employee',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  updateEmployeeStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!id || !status)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id & status required',
            timestamp: new Date().toISOString(),
          });

      const updated = await this.repo.updateStatus(id, status);
      
      // Transform image keys to public URLs in the employee response
      const transformedEmployee = await this.imageUrlTransformer.transformCommonImageFields(updated);
      
      // Flatten employee response by merging user fields
      const flattenedEmployee = this.flattenEmployeeResponse(transformedEmployee);
      
      return res.status(200).json({
        success: true,
        message: 'Employee status updated successfully',
        data: { employee: flattenedEmployee },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Employee Status',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  assignDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { departmentId } = req.body;
      if (!id || !departmentId)
        return res
          .status(400)
          .json({
            success: false,
            message: 'Id & departmentId required',
            timestamp: new Date().toISOString(),
          });

      const updated = await this.repo.assignDepartment(id, departmentId);
      
      // Transform image keys to public URLs in the employee response
      const transformedEmployee = await this.imageUrlTransformer.transformCommonImageFields(updated);
      
      // Flatten employee response by merging user fields
      const flattenedEmployee = this.flattenEmployeeResponse(transformedEmployee);
      
      return res.status(200).json({
        success: true,
        message: 'Employee department assigned successfully',
        data: { employee: flattenedEmployee },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Assigning Department',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };
}

/**
 * ===========================
 * Employee Permission Controller
 * ===========================
 */
export class EmployeePermissionController {
  private repo = new EmployeePermissionRepository();

  assignPermission = async (req: Request, res: Response) => {
    try {
      const permission = await this.repo.assign(req.body);
      return res.status(201).json({
        success: true,
        message: 'Permission assigned successfully',
        data: { permission },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Assigning Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  revokePermission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Permission ID is required',
            timestamp: new Date().toISOString(),
          });
      }

      await this.repo.revoke(id as string);
      return res.status(200).json({
        success: true,
        message: 'Permission Revoked',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Revoking Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getEmployeePermissions = async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.params;
      if (!employeeId) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Employee ID is required',
            timestamp: new Date().toISOString(),
          });
      }

      const permissions = await this.repo.findByEmployeeId(
        employeeId as string
      );
      return res.status(200).json({
        success: true,
        message: 'Permissions fetched successfully',
        data: { permissions },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Employee Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };
}

/**
 * ===========================
 * Permission Controller
 * ===========================
 */
export class PermissionController {
  private repo = new PermissionRepository();

  createPermission = async (req: Request, res: Response) => {
    try {
      const permission = await this.repo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Permission created successfully',
        data: { permission },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getAllPermissions = async (req: Request, res: Response) => {
    try {
      const permissions = await this.repo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Permissions fetched successfully',
        data: { permissions },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getPermissionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Permission ID is required',
            timestamp: new Date().toISOString(),
          });
      }

      const permission = await this.repo.findById(id as string);
      if (!permission) {
        return res
          .status(404)
          .json({
            success: false,
            message: 'Permission not found',
            timestamp: new Date().toISOString(),
          });
      }
      return res.status(200).json({
        success: true,
        message: 'Permission fetched successfully',
        data: { permission },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  updatePermission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Permission ID is required' });
      }

      const permission = await this.repo.update(id as string, req.body);
      return res.status(200).json({
        success: true,
        message: 'Permission updated successfully',
        data: { permission },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  deletePermission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Permission ID is required',
            timestamp: new Date().toISOString(),
          });
      }

      await this.repo.delete(id as string);
      return res.status(200).json({
        success: true,
        message: 'Permission Deleted',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Permission',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };
}
