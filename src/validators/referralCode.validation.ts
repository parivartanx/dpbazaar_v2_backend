import Joi from 'joi';

/**
 * CREATE REFERRAL CODE SCHEMA
 * Note: According to Prisma schema, ReferralCode has: id, code, isActive, customerId, createdAt, deactivatedAt
 */
export const createReferralCodeSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'string.empty': 'Referral code is required',
    'any.required': 'Referral code is required',
  }),

  customerId: Joi.string().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),

  isActive: Joi.boolean().default(true).optional().messages({
    'boolean.base': 'isActive must be a boolean value',
  }),
});

/**
 * UPDATE REFERRAL CODE SCHEMA
 */
export const updateReferralCodeSchema = Joi.object({
  code: Joi.string().optional().messages({
    'string.empty': 'Referral code cannot be empty',
  }),

  isActive: Joi.boolean().optional().messages({
    'boolean.base': 'isActive must be a boolean value',
  }),

  deactivatedAt: Joi.date().iso().optional().messages({
    'date.base': 'Deactivated at must be a valid date',
  }),
});