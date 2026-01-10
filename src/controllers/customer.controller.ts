import { Request, Response } from 'express';
import { CustomerRepository } from '../repositories/prisma/CustomerRepository';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { prisma } from '../config/prismaClient';

const customerRepo = new CustomerRepository();
const userRepo = new UserRepository();

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string };
}

export class CustomerController {
  /**
   * Helper function to flatten customer response by merging user fields into customer object
   * Excludes user.id to avoid overwriting customer.id, since userId already exists
   */
  private flattenCustomerResponse(customer: any): any {
    if (!customer || !customer.user) {
      return customer;
    }
    const { user: userData, ...customerFields } = customer;
    const { id: userId, ...userFields } = userData; // Exclude user.id to avoid conflict
    return {
      ...customerFields,
      ...userFields,
    };
  }

  /**
   * Helper function to flatten array of customer responses
   */
  private flattenCustomerArray(customers: any[]): any[] {
    return customers.map(customer => this.flattenCustomerResponse(customer));
  }

  /** ----------------- ADMIN END ----------------- */

  listCustomers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, tier, search } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      const filterParams: any = {
        page: pageNum,
        limit: limitNum,
      };

      if (tier) filterParams.tier = tier as string;
      if (search) filterParams.search = search as string;

      const customers = await customerRepo.list(filterParams);
      const totalCount = await customerRepo.countFiltered({
        tier: tier as string,
        search: search as string,
      });

      const flattenedCustomers = this.flattenCustomerArray(customers);

      const response: ApiResponse = {
        success: true,
        message: 'Customers fetched successfully',
        data: {
          customers: flattenedCustomers,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          },
        },
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

      // Check if customer is soft-deleted
      if (customer.deletedAt) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer fetched successfully',
        data: { customer: flattenedCustomer },
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
      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer created successfully',
        data: { customer: flattenedCustomer },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error: any) {
      logger.error(`Error creating customer: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - userId/customerCode uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        let fieldName = 'field';
        if (target?.includes('userId')) fieldName = 'user';
        else if (target?.includes('customerCode')) fieldName = 'customer code';
        
        res.status(409).json({
          success: false,
          error: 'Duplicate customer',
          message: `A customer with this ${fieldName} already exists. Field(s): ${target?.join(', ') || 'userId, customerCode'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

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

      // Check if customer exists
      const existingCustomer = await customerRepo.findById(id);
      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customer = await customerRepo.update(id, req.body);
      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer updated successfully',
        data: { customer: flattenedCustomer },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error: any) {
      logger.error(`Error updating customer: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - customerCode uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        res.status(409).json({
          success: false,
          error: 'Duplicate customer',
          message: `A customer with this ${target?.includes('customerCode') ? 'customer code' : 'field'} already exists. Field(s): ${target?.join(', ') || 'customerCode'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

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

      // Check if customer exists
      const existingCustomer = await customerRepo.findById(id);
      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if already soft-deleted
      if (existingCustomer.deletedAt) {
        res.status(400).json({
          success: false,
          message: 'Customer is already deleted',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customer = await customerRepo.softDelete(id);
      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer deleted successfully',
        data: { customer: flattenedCustomer },
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

      // Check if customer exists
      const existingCustomer = await customerRepo.findById(id);
      if (!existingCustomer) {
        res.status(404).json({
          success: false,
          message: 'Customer not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if customer is not soft-deleted
      if (!existingCustomer.deletedAt) {
        res.status(400).json({
          success: false,
          message: 'Customer is not deleted',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const customer = await customerRepo.restore(id);
      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer restored successfully',
        data: { customer: flattenedCustomer },
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

      // Fetch customer with user relation (repository now includes full user data)
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

      const flattenedCustomer = this.flattenCustomerResponse(customer);

      const response: ApiResponse = {
        success: true,
        message: 'Customer profile fetched successfully',
        data: { customer: flattenedCustomer },
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

      // Separate customer and user update data
      // User profile fields: firstName, lastName, middleName, phone, dateOfBirth, gender, avatar, bio
      const {
        firstName: userFirstName,
        lastName: userLastName,
        middleName: userMiddleName,
        phone: userPhone,
        dateOfBirth: userDateOfBirth,
        gender: userGender,
        avatar: userAvatar,
        bio: userBio,
        ...customerData
      } = req.body;

      // Update customer data (customer-specific fields only)
      const updatedCustomer = await customerRepo.update(customer.id, customerData);

      // Update user profile data if provided
      const userUpdateData: any = {};
      if (userFirstName) userUpdateData.firstName = userFirstName;
      if (userLastName) userUpdateData.lastName = userLastName;
      if (userMiddleName !== undefined) userUpdateData.middleName = userMiddleName;
      if (userPhone !== undefined) userUpdateData.phone = userPhone;
      if (userDateOfBirth !== undefined) userUpdateData.dateOfBirth = userDateOfBirth;
      if (userGender !== undefined) userUpdateData.gender = userGender;
      if (userAvatar !== undefined) userUpdateData.avatar = userAvatar;
      if (userBio !== undefined) userUpdateData.bio = userBio;

      if (Object.keys(userUpdateData).length > 0) {
        await userRepo.update(userId, userUpdateData);
      }

      // Fetch updated customer with user relation
      const customerWithUser = await prisma.customer.findUnique({
        where: { id: updatedCustomer.id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
              email: true,
              phone: true,
              username: true,
              role: true,
              status: true,
              isEmailVerified: true,
              isPhoneVerified: true,
              isTwoFactorEnabled: true,
              dateOfBirth: true,
              gender: true,
              avatar: true,
              bio: true,
              lastLoginAt: true,
              lastLoginIp: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      const flattenedCustomer = this.flattenCustomerResponse(customerWithUser);

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: { customer: flattenedCustomer },
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