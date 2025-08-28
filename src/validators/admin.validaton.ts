import { body } from 'express-validator';

export const adminValidation = {
  createEmployee: [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('department').optional().isString(),
  ],

  updateEmployee: [
    body('name').optional().isString(),
    body('status').optional().isString().isIn(['ACTIVE', 'INACTIVE']),
  ],

  updateUserStatus: [
    body('status').notEmpty().isString().isIn(['ACTIVE', 'INACTIVE']),
  ],
};
