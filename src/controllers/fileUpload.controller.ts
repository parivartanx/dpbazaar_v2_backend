import { Request, Response } from 'express';
import { R2Service } from '../services/r2.service';
import { ApiResponse } from '@/types/common';
import { logger } from '../utils/logger';

export class FileUploadController {
  private r2Service = new R2Service();

  // Generate pre-signed URL for direct upload to R2
  generatePresignedUploadUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fileName, fileType, folderPath } = req.body;
      
      if (!fileName || !fileType) {
        res.status(400).json({
          success: false,
          message: 'File name and type are required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { url, key } = await this.r2Service.generatePresignedUploadUrl(
        fileName,
        fileType,
        folderPath
      );

      const response: ApiResponse = {
        success: true,
        data: { 
          presignedUrl: url,
          key,
          fileName,
          fileType
        },
        message: 'Pre-signed URL generated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error generating pre-signed upload URL: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Failed to generate pre-signed upload URL',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };





  // Get public URL for a file key
  getPublicUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(400).json({
          success: false,
          message: 'File key is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const publicUrl = this.r2Service.generatePublicUrl(key);

      const response: ApiResponse = {
        success: true,
        data: { publicUrl, key },
        message: 'Public URL generated successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error generating public URL: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Failed to generate public URL',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Delete file
  deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(400).json({
          success: false,
          message: 'File key is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.r2Service.deleteFile(key);

      const response: ApiResponse = {
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting file: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Failed to delete file',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}