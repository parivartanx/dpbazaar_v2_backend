import { Request, Response } from 'express';
import { DepartmentRepository } from '../repositories/prisma/DepartmentRepository';
import { EmployeeRepository } from '../repositories/prisma/EmployeeRepository';
import { EmployeePermissionRepository } from '../repositories/prisma/EmployeePermissionRepository';
import { PermissionRepository } from '../repositories/prisma/PermissionRepository';

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
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getAllDepartments = async (req: Request, res: Response) => {
    try {
      const departments = await this.repo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Departments fetched successfully',
        data: { departments },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getDepartmentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Department ID is required' });

      const department = await this.repo.findById(id);
      if (!department)
        return res.status(404).json({ message: 'Department not found' });

      return res.status(200).json({
        success: true,
        message: 'Department fetched successfully',
        data: { department },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  updateDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Department ID is required' });

      const department = await this.repo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: { department },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  deleteDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id)
        return res.status(400).json({ error: 'Department ID is required' });

      await this.repo.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
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

  createEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await this.repo.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: { employee },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getAllEmployees = async (_: Request, res: Response) => {
    try {
      const employees = await this.repo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Employees fetched successfully',
        data: { employees },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  getEmployeeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id required' });

      const employee = await this.repo.findById(id);
      if (!employee)
        return res.status(404).json({ error: 'Employee not found' });

      return res.status(200).json({
        success: true,
        message: 'Employee fetched successfully',
        data: { employee },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  updateEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id required' });

      const updated = await this.repo.update(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: { updated },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  deleteEmployee = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id required' });

      await this.repo.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  updateEmployeeStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!id || !status)
        return res.status(400).json({ error: 'Id & status required' });

      const updated = await this.repo.updateStatus(id, status);
      return res.status(200).json({
        success: true,
        message: 'Employee status updated successfully',
        data: { updated },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
    }
  };

  assignDepartment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { departmentId } = req.body;
      if (!id || !departmentId)
        return res.status(400).json({ error: 'Id & departmentId required' });

      const updated = await this.repo.assignDepartment(id, departmentId);
      return res.status(200).json({
        success: true,
        message: 'Employee department assigned successfully',
        data: { updated },
      });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
      return res.status(500).json({ error: 'Unknown error' });
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
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  revokePermission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Permission ID is required' });
      }

      await this.repo.revoke(id as string);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getEmployeePermissions = async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.params;
      if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }

      const permissions = await this.repo.findByEmployeeId(
        employeeId as string
      );
      return res.status(200).json({
        success: true,
        message: 'Permissions fetched successfully',
        data: { permissions },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
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
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getAllPermissions = async (_: Request, res: Response) => {
    try {
      const permissions = await this.repo.findAll();
      return res.status(200).json({
        success: true,
        message: 'Permissions fetched successfully',
        data: { permissions },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  getPermissionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Permission ID is required' });
      }

      const permission = await this.repo.findById(id as string);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Permission fetched successfully',
        data: { permission },
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
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
      });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };

  deletePermission = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Permission ID is required' });
      }

      await this.repo.delete(id as string);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  };
}
