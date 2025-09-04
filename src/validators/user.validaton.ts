import Joi from 'joi';
import { UserRole, UserStatus } from '@prisma/client';

/**
 * CREATE USER SCHEMA
 */
export const createUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),

  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Phone number must be 10–15 digits',
    }),

  username: Joi.string().alphanum().min(3).max(30).optional().allow(null),

  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.CUSTOMER),

  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .default(UserStatus.ACTIVE),
});

/**
 * UPDATE USER SCHEMA
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null),
  username: Joi.string().alphanum().min(3).max(30).optional().allow(null),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(UserStatus))
    .optional(),
});

/**
 * LOCK USER SCHEMA
 */
export const lockUserSchema = Joi.object({
  lockedUntil: Joi.date().greater('now').required().messages({
    'date.greater': 'Locked until must be a future date',
    'any.required': 'lockedUntil is required',
  }),
});

/**
 * RESET PASSWORD SCHEMA
 */
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});
