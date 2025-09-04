import Joi from 'joi';

/**
 * CREATE CUSTOMER SCHEMA
 */
export const createCustomerSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),

  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),

  middleName: Joi.string().optional().allow(null, ''),

  dateOfBirth: Joi.date().optional().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional().allow(null),

  avatar: Joi.string().uri().optional().allow(null),
  bio: Joi.string().max(500).optional().allow(null, ''),

  tier: Joi.string()
    .valid('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')
    .default('BRONZE'),

  preferences: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});

/**
 * UPDATE CUSTOMER SCHEMA
 */
export const updateCustomerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  middleName: Joi.string().optional().allow(null, ''),
  dateOfBirth: Joi.date().optional().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional().allow(null),

  avatar: Joi.string().uri().optional().allow(null),
  bio: Joi.string().max(500).optional().allow(null, ''),

  tier: Joi.string().valid('BRONZE', 'SILVER', 'GOLD', 'PLATINUM').optional(),

  preferences: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});
