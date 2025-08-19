import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateJoi = (schema: ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(err => err.message),
      });
      return; // explicitly stop here
    }

    next();
  };
};
