import { Request, Response } from 'express';
import { CustomerRepository } from '../repositories/prisma/CustomerRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';

const customerRepo = new CustomerRepository();

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class CustomerController {
  /** ----------------- ADMIN END ----------------- */

  listCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, tier, search } = req.query;
      const customers = await customerRepo.list({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        tier: tier as string,
        search: search as string,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Customers fetched successfully',
        data: { customers },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing customers: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch customers',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const customer = await customerRepo.findById(id);
      if (!customer) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Customer fetched successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching customer: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch customer',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const customer = await customerRepo.create(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Customer created successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating customer: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create customer',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const customer = await customerRepo.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Customer updated successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating customer: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update customer',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const customer = await customerRepo.softDelete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Customer deleted successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting customer: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete customer',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  restoreCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const customer = await customerRepo.restore(id);
      const response: ApiResponse = {
        success: true,
        message: 'Customer restored successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error restoring customer: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to restore customer',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customer = await customerRepo.findByUserId(userId);
      if (!customer) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer profile not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Customer profile fetched successfully',
        data: { customer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching profile: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch profile',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'User not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customer = await customerRepo.findByUserId(userId);
      if (!customer) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer profile not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const updatedCustomer = await customerRepo.update(customer.id, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: { customer: updatedCustomer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating profile: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update profile',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}