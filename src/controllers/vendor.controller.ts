import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { VendorRepository } from '../repositories/prisma/VendorRepository';

const vendorRepository = new VendorRepository();

export class VendorController {
  // List Vendors
  getAllVendors = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page, limit, search, status } = req.query;
        
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 20;

        const filters: any = {
          page: pageNum,
          limit: limitNum,
          search: search as string,
          status: status as string,
        };

        const vendors = await vendorRepository.getAll(filters);
        const totalCount = await vendorRepository.countFiltered({
          search: search as string,
          status: status as string,
        });
        
        const response: ApiResponse = {
            success: true,
            data: {
              vendors,
              pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
                totalItems: totalCount,
                itemsPerPage: limitNum,
              },
            },
            message: 'Vendors retrieved successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in getAllVendors: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in fetching vendors',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };

  // Get Vendor By ID
  getVendorById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
             res.status(400).json({ success: false, message: 'Vendor ID is required' });
             return;
        }

        const vendor = await vendorRepository.getById(id);
        if (!vendor) {
            res.status(404).json({ success: false, message: 'Vendor not found' });
            return;
        }

        const response: ApiResponse = {
            success: true,
            data: { vendor },
            message: 'Vendor retrieved successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in getVendorById: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in fetching vendor',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };

  // Create Vendor
  createVendor = async (req: Request, res: Response): Promise<void> => {
    try {
        const vendor = await vendorRepository.create(req.body);
        const response: ApiResponse = {
            success: true,
            data: { vendor },
            message: 'Vendor created successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(201).json(response);
    } catch (error) {
        logger.error(`Error in createVendor: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in creating vendor',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };

  // Update Vendor
  updateVendor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
             res.status(400).json({ success: false, message: 'Vendor ID is required' });
             return;
        }

        const vendor = await vendorRepository.update(id, req.body);
        const response: ApiResponse = {
            success: true,
            data: { vendor },
            message: 'Vendor updated successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in updateVendor: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in updating vendor',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };

  // Delete Vendor
  deleteVendor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
             res.status(400).json({ success: false, message: 'Vendor ID is required' });
             return;
        }

        await vendorRepository.delete(id);
        const response: ApiResponse = {
            success: true,
            message: 'Vendor deleted successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in deleteVendor: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in deleting vendor',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };
  
  // Update Status
  updateVendorStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!id) {
             res.status(400).json({ success: false, message: 'Vendor ID is required' });
             return;
        }

        const vendor = await vendorRepository.updateStatus(id, status);
        const response: ApiResponse = {
            success: true,
            data: { vendor },
            message: `Vendor status updated to ${status}`,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in updateVendorStatus: ${error}`);
        const response: ApiResponse = {
          success: false,
          message: 'Problem in updating vendor status',
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        };
        res.status(500).json(response);
    }
  };
}
