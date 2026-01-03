import Joi from 'joi';

/**
 * CREATE CUSTOMER SCHEMA
 * Note: firstName, lastName, middleName, dateOfBirth, gender, avatar, bio are now in User model
 * These fields should be updated via User endpoints/controllers
 */
export const createCustomerSchema = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),

  // Customer-specific fields only
  tier: Joi.string()
    .valid('BRONZE', 'SILVER', 'GOLD', 'PLATINUM')
    .default('BRONZE'),

  preferences: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});

/**
 * UPDATE CUSTOMER SCHEMA
 * Note: firstName, lastName, middleName, dateOfBirth, gender, avatar, bio are now in User model
 * These fields should be updated via User endpoints/controllers
 */
export const updateCustomerSchema = Joi.object({
  // Customer-specific fields only
  tier: Joi.string().valid('BRONZE', 'SILVER', 'GOLD', 'PLATINUM').optional(),

  preferences: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});
