import { Request, Response } from 'express';
import { AddressRepository } from '../repositories/prisma/AddressRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { getCustomerIdFromUserId } from '../utils/customerHelper';

const addressRepo = new AddressRepository();

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string };
}

export class AddressController {
  /** ----------------- ADMIN END ----------------- */

  listAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, customerId, search } = req.query;
      const addresses = await addressRepo.list({
        page: Number(page) || 1,
        limit: Number(limit) || 20,
        customerId: customerId as string,
        search: search as string,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Addresses fetched successfully',
        data: { addresses },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error listing addresses: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch addresses',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const address = await addressRepo.findById(id);
      if (!address) {
        const response: ApiResponse = {
          success: false,
          message: 'Address not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Address fetched successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const address = await addressRepo.create(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Address created successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating address: ${error}`);
      const errorMessage = (error as Error).message;
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create address',
        error: errorMessage.includes('Customer with ID') || errorMessage.includes('Customer ID is required') 
          ? errorMessage 
          : 'Invalid data provided for address creation',
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(response);
    }
  };

  updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const address = await addressRepo.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Address updated successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const address = await addressRepo.softDelete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Address deleted successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  restoreAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const address = await addressRepo.restore(id);
      const response: ApiResponse = {
        success: true,
        message: 'Address restored successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error restoring address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to restore address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  /** ----------------- CUSTOMER END ----------------- */

  getMyAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const addresses = await addressRepo.findByCustomerId(customerId);
      const response: ApiResponse = {
        success: true,
        message: 'Customer addresses fetched successfully',
        data: { addresses },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching customer addresses: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch customer addresses',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createMyAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      
      // Ensure country has a default value if not provided
      const addressData = {
        ...req.body,
        customerId,
        country: req.body.country || 'India', // Default to India if not provided
      };

      const address = await addressRepo.create(addressData);
      const response: ApiResponse = {
        success: true,
        message: 'Address created successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating address: ${error}`);
      const errorMessage = (error as Error).message;
      
      // Provide more specific error messages
      let errorDetail = 'Invalid data provided for address creation';
      if (errorMessage.includes('Customer with ID') || errorMessage.includes('Customer ID is required')) {
        errorDetail = errorMessage;
      } else if (errorMessage.includes('required')) {
        errorDetail = errorMessage;
      } else if (errorMessage.includes('must be')) {
        errorDetail = errorMessage;
      } else if (errorMessage.includes('pattern')) {
        errorDetail = errorMessage;
      }
      
      const response: ApiResponse = {
        success: false,
        message: 'Failed to create address',
        error: errorDetail,
        timestamp: new Date().toISOString(),
      };
      res.status(400).json(response);
    }
  };

  updateMyAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Verify the address belongs to the customer
      const existingAddress = await addressRepo.findById(id);
      if (!existingAddress || existingAddress.customerId !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Address not found or not owned by customer',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const address = await addressRepo.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Address updated successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteMyAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Address ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Verify the address belongs to the customer
      const existingAddress = await addressRepo.findById(id);
      if (!existingAddress || existingAddress.customerId !== customerId) {
        const response: ApiResponse = {
          success: false,
          message: 'Address not found or not owned by customer',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const address = await addressRepo.softDelete(id);
      const response: ApiResponse = {
        success: true,
        message: 'Address deleted successfully',
        data: { address },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting address: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to delete address',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}