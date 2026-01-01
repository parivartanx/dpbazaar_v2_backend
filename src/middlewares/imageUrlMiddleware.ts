import { Request, Response, NextFunction } from 'express';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';
import { R2Service } from '../services/r2.service';

const imageUrlTransformer = new ImageUrlTransformer({ r2Service: new R2Service() });

/**
 * Middleware to transform image keys to public URLs in response data
 * This middleware should be used after the controller has prepared the response
 * but before sending it to the client
 */
export const transformImageUrls = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json to transform image keys to URLs before sending response
    res.json = function(data: any) {
      try {
        // Transform common image fields in the response data
        const transformedData = await imageUrlTransformer.transformCommonImageFields(data);
        return originalJson.call(this, transformedData);
      } catch (error) {
        // If transformation fails, send original data
        console.error('Error transforming image URLs:', error);
        return originalJson.call(this, data);
      }
    };

    next();
  };
};

/**
 * Middleware to transform specific image fields in response data
 * @param fields - Array of field names that contain image keys to transform
 */
export const transformSpecificImageUrls = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store the original res.json method
    const originalJson = res.json;

    // Override res.json to transform specific image fields before sending response
    res.json = function(data: any) {
      try {
        // Transform specific fields in the response data
        const transformedData = imageUrlTransformer.transformImageKeysToUrls(data, fields);
        return originalJson.call(this, transformedData);
      } catch (error) {
        // If transformation fails, send original data
        console.error('Error transforming specific image URLs:', error);
        return originalJson.call(this, data);
      }
    };

    next();
  };
};