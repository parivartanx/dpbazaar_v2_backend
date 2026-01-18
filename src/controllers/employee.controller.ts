import { Request, Response } from 'express';
import { DepartmentRepository } from '../repositories/prisma/DepartmentRepository';
import { EmployeeRepository } from '../repositories/prisma/EmployeeRepository';
import { EmployeePermissionRepository } from '../repositories/prisma/EmployeePermissionRepository';
import { PermissionRepository } from '../repositories/prisma/PermissionRepository';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { UserRole, EmployeeStatus, PermissionAction } from '@prisma/client';
import { prisma } from '../config/prismaClient';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';
import {
  generateEmployeeUserId,
  generateEmployeeCode,
} from '../utils/idGenerator';

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
      const { search, isActive, parentId, page, limit } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      // Build filter params - only include defined values
      const filterParams: any = {
        search: search as string,
        parentId: parentId as string,
        page: pageNum,
        limit: limitNum,
      };

      if (isActive !== undefined) {
        filterParams.isActive = isActive === 'true';
      }

      // Get filtered departments
      const departments = await this.repo.filterDepartments(filterParams);

      // Build count params
      const countParams: any = {
        search: search as string,
        parentId: parentId as string,
      };

      if (isActive !== undefined) {
        countParams.isActive = isActive === 'true';
      }

      // Get total count for pagination metadata
      const totalCount = await this.repo.countFilteredDepartments(countParams);

      const response: ApiResponse = {
        success: true,
        message: 'Departments fetched successfully',
        data: {
          departments,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
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
        return res.status(404).json({
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
        return res.status(400).json({
          success: false,
          message: 'Department ID is required',
          timestamp: new Date().toISOString(),
        });

      // Check if department exists
      const existingDepartment = await this.repo.findById(id);
      if (!existingDepartment)
        return res.status(404).json({
          success: false,
          message: 'Department not found',
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
        return res.status(400).json({
          success: false,
          message: 'Department ID is required',
          timestamp: new Date().toISOString(),
        });

      // Check if department exists before deleting
      const existingDepartment = await this.repo.findById(id);
      if (!existingDepartment)
        return res.status(404).json({
          success: false,
          message: 'Department not found',
          timestamp: new Date().toISOString(),
        });

      await this.repo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully',
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
  private userRepo = new UserRepository();
  private departmentRepo = new DepartmentRepository();
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({
    r2Service: this.r2Service,
  });

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
      const {
        // User fields
        firstName,
        lastName,
        email,
        password,
        phone,
        middleName,
        // Employee fields
        employeeCode: inputEmployeeCode,
        departmentId,
        designation,
        status,
        employmentType,
        joiningDate,
        confirmationDate,
        lastWorkingDate,
        salary,
        currency,
        documents,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
        currentAddress,
        permanentAddress,
        metadata,
      } = req.body;

      let employeeCode = inputEmployeeCode;

      // Check if user already exists with this email
      const existingUser = await this.userRepo.findByEmail(email);

      let userToUse;

      if (existingUser) {
        // Check if this user is already an employee
        const existingEmployee = await prisma!.employee.findUnique({
          where: { userId: existingUser.id },
          select: { id: true, employeeCode: true },
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            error: 'Employee already exists',
            message: `This user is already an employee with code: ${existingEmployee.employeeCode}. Cannot create duplicate employee record.`,
            timestamp: new Date().toISOString(),
          });
        }

        // User exists but is not an employee - use existing user
        userToUse = existingUser;

        // Update user fields if provided
        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) updateData.phone = phone;
        if (middleName !== undefined) updateData.middleName = middleName;
        if (password) updateData.password = password; // Will be hashed in UserRepository

        // Update role to EMPLOYEE if not already
        if (existingUser.role !== UserRole.EMPLOYEE) {
          updateData.role = UserRole.EMPLOYEE;
        }

        if (Object.keys(updateData).length > 0) {
          await this.userRepo.update(existingUser.id, updateData);
          // Fetch updated user
          userToUse = await this.userRepo.findById(existingUser.id);
          if (!userToUse) {
            throw new Error('Failed to retrieve updated user');
          }
        }
      } else {
        // Generate meaningful user ID and employee code
        const generatedUserId = generateEmployeeUserId(firstName, lastName);

        // Get last employee code to generate next sequential code
        const lastEmployee = await prisma.employee.findFirst({
          orderBy: { employeeCode: 'desc' },
          select: { employeeCode: true },
        });
        const generatedEmployeeCode = generateEmployeeCode(
          lastEmployee?.employeeCode
        );

        // Create new User with custom ID and role EMPLOYEE
        userToUse = await prisma.user.create({
          data: {
            id: generatedUserId,
            firstName,
            lastName,
            email,
            password,
            role: UserRole.EMPLOYEE,
            isEmailVerified: false,
          },
        });

        // Update phone and middleName if provided
        if (phone || middleName) {
          await this.userRepo.update(userToUse.id, {
            phone: phone || null,
            middleName: middleName || null,
          });
        }

        // Override the employeeCode with our generated one
        employeeCode = generatedEmployeeCode;
      }

      // Validate department if departmentId is provided
      if (departmentId) {
        const department = await this.departmentRepo.findById(departmentId);
        if (!department) {
          return res.status(400).json({
            success: false,
            error: 'Department not found',
            message: `Department with ID ${departmentId} does not exist. Please provide a valid department ID or leave it empty.`,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Prepare employee data - Prisma handles null/undefined values automatically
      const employeeData: any = {
        userId: userToUse.id,
        employeeCode,
        designation,
        joiningDate: new Date(joiningDate),
        status: status || 'ACTIVE',
        employmentType: employmentType || 'FULL_TIME',
        currency: currency || 'INR',
        departmentId: departmentId || null,
        confirmationDate: confirmationDate ? new Date(confirmationDate) : null,
        lastWorkingDate: lastWorkingDate ? new Date(lastWorkingDate) : null,
        salary: salary ?? null,
        documents: documents || null,
        emergencyContactName: emergencyContactName || null,
        emergencyContactPhone: emergencyContactPhone || null,
        emergencyContactRelation: emergencyContactRelation || null,
        currentAddress: currentAddress || null,
        permanentAddress: permanentAddress || null,
        metadata: metadata || null,
      };

      // Create Employee
      const employee = await this.repo.create(employeeData);

      // Transform image keys to public URLs in the employee response
      const transformedEmployee =
        await this.imageUrlTransformer.transformCommonImageFields(employee);

      // Flatten employee response by merging user fields
      const flattenedEmployee =
        this.flattenEmployeeResponse(transformedEmployee);

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

  getAllEmployees = async (req: Request, res: Response) => {
    try {
      const {
        search,
        status,
        departmentId,
        designation,
        employmentType,
        page,
        limit,
      } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      // Get filtered employees
      const employees = await this.repo.filterEmployees({
        search: search as string,
        status: status as EmployeeStatus,
        departmentId: departmentId as string,
        designation: designation as string,
        employmentType: employmentType as string,
        page: pageNum,
        limit: limitNum,
      });

      // Get total count for pagination metadata
      const totalCount = await this.repo.countFilteredEmployees({
        search: search as string,
        status: status as EmployeeStatus,
        departmentId: departmentId as string,
        designation: designation as string,
        employmentType: employmentType as string,
      });

      const transformedEmployees = employees; // Temporarily bypass to test date serialization

      // Flatten employee responses by merging user fields
      const flattenedEmployees =
        this.flattenEmployeeArray(transformedEmployees);

      const response: ApiResponse = {
        success: true,
        message: 'Employees fetched successfully',
        data: {
          employees: flattenedEmployees,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
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
        return res.status(400).json({
          success: false,
          message: 'Id required',
          timestamp: new Date().toISOString(),
        });

      const employee = await this.repo.findById(id);
      if (!employee || employee.deletedAt)
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          timestamp: new Date().toISOString(),
        });

      // Transform image keys to public URLs in the employee response
      const transformedEmployee =
        await this.imageUrlTransformer.transformCommonImageFields(employee);

      // Flatten employee response by merging user fields
      const flattenedEmployee =
        this.flattenEmployeeResponse(transformedEmployee);

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
        return res.status(400).json({
          success: false,
          message: 'Id required',
          timestamp: new Date().toISOString(),
        });

      // Check if employee exists
      const existingEmployee = await this.repo.findById(id);
      if (!existingEmployee || existingEmployee.deletedAt)
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          timestamp: new Date().toISOString(),
        });

      // Extract user fields and employee fields separately
      const {
        firstName,
        lastName,
        middleName,
        phone,
        joiningDate,
        confirmationDate,
        lastWorkingDate,
        ...employeeFields
      } = req.body;

      // Update User record if user fields are provided
      const userUpdateData: any = {};
      if (firstName !== undefined) userUpdateData.firstName = firstName;
      if (lastName !== undefined) userUpdateData.lastName = lastName;
      if (middleName !== undefined) userUpdateData.middleName = middleName;
      if (phone !== undefined) userUpdateData.phone = phone;

      if (Object.keys(userUpdateData).length > 0) {
        await this.userRepo.update(existingEmployee.userId, userUpdateData);
      }

      // Prepare employee update data with proper date conversions
      const updateData: any = { ...employeeFields };

      // Debug logging for joiningDate
      logger.info(
        `[updateEmployee] Received joiningDate: ${joiningDate}, type: ${typeof joiningDate}`
      );

      // Convert date strings to Date objects if provided
      if (joiningDate) {
        updateData.joiningDate = new Date(joiningDate);
        logger.info(
          `[updateEmployee] Converted joiningDate: ${updateData.joiningDate}`
        );
      }
      if (confirmationDate)
        updateData.confirmationDate = new Date(confirmationDate);
      if (lastWorkingDate)
        updateData.lastWorkingDate = new Date(lastWorkingDate);

      const updated = await this.repo.update(id, updateData);

      // Transform image keys to public URLs in the employee response
      const transformedEmployee =
        await this.imageUrlTransformer.transformCommonImageFields(updated);

      // Flatten employee response by merging user fields
      const flattenedEmployee =
        this.flattenEmployeeResponse(transformedEmployee);

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
        return res.status(400).json({
          success: false,
          message: 'Id required',
          timestamp: new Date().toISOString(),
        });

      // Check if employee exists before deleting
      const existingEmployee = await this.repo.findById(id);
      if (!existingEmployee || existingEmployee.deletedAt)
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
          timestamp: new Date().toISOString(),
        });

      await this.repo.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
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
        return res.status(400).json({
          success: false,
          message: 'Id & status required',
          timestamp: new Date().toISOString(),
        });

      const updated = await this.repo.updateStatus(id, status);

      // Transform image keys to public URLs in the employee response
      const transformedEmployee =
        await this.imageUrlTransformer.transformCommonImageFields(updated);

      // Flatten employee response by merging user fields
      const flattenedEmployee =
        this.flattenEmployeeResponse(transformedEmployee);

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
        return res.status(400).json({
          success: false,
          message: 'Id & departmentId required',
          timestamp: new Date().toISOString(),
        });

      const updated = await this.repo.assignDepartment(id, departmentId);

      // Transform image keys to public URLs in the employee response
      const transformedEmployee =
        await this.imageUrlTransformer.transformCommonImageFields(updated);

      // Flatten employee response by merging user fields
      const flattenedEmployee =
        this.flattenEmployeeResponse(transformedEmployee);

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

  /**
   * Get employee statistics for Performance Overview
   */
  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.repo.getStats();

      const response: ApiResponse = {
        success: true,
        message: 'Employee stats fetched successfully',
        data: {
          stats: {
            totalEmployees: stats.totalEmployees,
            activeEmployees: stats.activeEmployees,
            inactiveEmployees: stats.inactiveEmployees,
            departmentCount: stats.departmentCount,
          },
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Employee Stats',
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
        return res.status(400).json({
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
        return res.status(400).json({
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
    } catch (error: any) {
      logger.error(`error: ${error}`);

      // Handle Prisma unique constraint error (P2002)
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate permission',
          message: `Permission with this resource and action combination already exists. Field(s): ${target?.join(', ') || 'resource, action'}`,
          timestamp: new Date().toISOString(),
        });
      }

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
      const { search, resource, action, page, limit } = req.query;

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      // Build filter params - only include defined values
      const filterParams: any = {
        search: search as string,
        resource: resource as string,
        page: pageNum,
        limit: limitNum,
      };

      if (action) {
        filterParams.action = action as PermissionAction;
      }

      // Get filtered permissions
      const permissions = await this.repo.filterPermissions(filterParams);

      // Build count params
      const countParams: any = {
        search: search as string,
        resource: resource as string,
      };

      if (action) {
        countParams.action = action as PermissionAction;
      }

      // Get total count for pagination metadata
      const totalCount = await this.repo.countFilteredPermissions(countParams);

      const response: ApiResponse = {
        success: true,
        message: 'Permissions fetched successfully',
        data: {
          permissions,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Permissions',
        timestamp: new Date().toISOString(),
      };
      return res.status(500).json(response);
    }
  };

  getPermissionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Permission ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      const permission = await this.repo.findById(id as string);
      if (!permission) {
        return res.status(404).json({
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
        return res.status(400).json({
          success: false,
          message: 'Permission ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if permission exists
      const existingPermission = await this.repo.findById(id as string);
      if (!existingPermission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found',
          timestamp: new Date().toISOString(),
        });
      }

      const permission = await this.repo.update(id as string, req.body);
      return res.status(200).json({
        success: true,
        message: 'Permission updated successfully',
        data: { permission },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);

      // Handle Prisma unique constraint error (P2002)
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        return res.status(409).json({
          success: false,
          error: 'Duplicate permission',
          message: `A permission with this resource and action combination already exists. Field(s): ${target?.join(', ') || 'resource, action'}`,
          timestamp: new Date().toISOString(),
        });
      }

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
        return res.status(400).json({
          success: false,
          message: 'Permission ID is required',
          timestamp: new Date().toISOString(),
        });
      }

      // Check if permission exists before deleting
      const existingPermission = await this.repo.findById(id as string);
      if (!existingPermission) {
        return res.status(404).json({
          success: false,
          message: 'Permission not found',
          timestamp: new Date().toISOString(),
        });
      }

      await this.repo.delete(id as string);
      return res.status(200).json({
        success: true,
        message: 'Permission deleted successfully',
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
