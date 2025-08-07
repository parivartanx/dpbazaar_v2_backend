import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiResponse } from '../types/common';

/**
 * Middleware to validate request using express-validator
 * @param validations - Array of validation chains
 * @returns Express middleware function
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const response: ApiResponse = {
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
      };

      return res.status(400).json(response);
    }

    return next();
  };
}; 