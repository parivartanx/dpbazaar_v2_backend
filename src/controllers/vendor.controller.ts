import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { VendorRepository } from '../repositories/prisma/VendorRepository';

const vendorRepository = new VendorRepository();

export class VendorController {
  // List Vendors
  getAllVendors = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters: any = { ...req.query };
        // parse page/limit numbers
        if (filters.page) filters.page = Number(filters.page);
        if (filters.limit) filters.limit = Number(filters.limit);

        const vendors = await vendorRepository.getAll(filters);
        
        const response: ApiResponse = {
            success: true,
            data: { vendors },
            message: 'Vendors retrieved successfully',
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error in getAllVendors: ${error}`);
        res.status(500).json({ success: false, message: 'Problem in fetching vendors', error: (error as Error).message });
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
        res.status(500).json({ success: false, message: 'Problem in fetching vendor', error: (error as Error).message });
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
        res.status(500).json({ success: false, message: 'Problem in creating vendor', error: (error as Error).message });
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
        res.status(500).json({ success: false, message: 'Problem in updating vendor', error: (error as Error).message });
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
        res.status(500).json({ success: false, message: 'Problem in deleting vendor', error: (error as Error).message });
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
        res.status(500).json({ success: false, message: 'Problem in updating vendor status', error: (error as Error).message });
    }
  };
}
