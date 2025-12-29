import { Request, Response } from 'express';
import { InvoiceRepository } from '../repositories/prisma/InvoiceRepository';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

const invoiceRepository = new InvoiceRepository();

export class InvoiceController {
  getAllInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, status, orderId, invoiceNumber, startDate, endDate } = req.query;
      const filters = {
        status,
        orderId,
        invoiceNumber,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const result = await invoiceRepository.getAll(filters, {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Invoices retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getAllInvoices: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching invoices', error: (error as Error).message });
    }
  };

  getInvoiceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Invoice ID is required' });
        return;
      }

      const invoice = await invoiceRepository.findById(id);
      if (!invoice) {
        res.status(404).json({ success: false, message: 'Invoice not found' });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: { invoice },
        message: 'Invoice retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in getInvoiceById: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in fetching invoice', error: (error as Error).message });
    }
  };

  createInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const invoice = await invoiceRepository.create(req.body);
      const response: ApiResponse = {
        success: true,
        data: { invoice },
        message: 'Invoice created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error in createInvoice: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in creating invoice', error: (error as Error).message });
    }
  };

  updateInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Invoice ID is required' });
        return;
      }

      const invoice = await invoiceRepository.update(id, req.body);
      const response: ApiResponse = {
        success: true,
        data: { invoice },
        message: 'Invoice updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in updateInvoice: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in updating invoice', error: (error as Error).message });
    }
  };

  deleteInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, message: 'Invoice ID is required' });
        return;
      }

      const invoice = await invoiceRepository.delete(id);
      const response: ApiResponse = {
        success: true,
        data: { invoice },
        message: 'Invoice deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in deleteInvoice: ${error}`);
      res.status(500).json({ success: false, message: 'Problem in deleting invoice', error: (error as Error).message });
    }
  };
}
