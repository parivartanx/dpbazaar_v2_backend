import Joi from 'joi';
import { CardSubscriptionStatus } from '@prisma/client';

/**
 * CREATE USER SUBSCRIPTION CARD SCHEMA
 */
export const createUserSubscriptionCardSchema = Joi.object({
  customerId: Joi.string().trim().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),

  cardId: Joi.string().trim().required().messages({
    'string.empty': 'Card ID is required',
    'any.required': 'Card ID is required',
  }),

  referralCodeId: Joi.string().trim().optional().allow(null, '').messages({
    'string.base': 'Referral code ID must be a string',
  }),

  status: Joi.string()
    .valid(...Object.values(CardSubscriptionStatus))
    .default(CardSubscriptionStatus.UPCOMING)
    .messages({
      'any.only': `Status must be one of ${Object.values(CardSubscriptionStatus).join(', ')}`,
    }),

  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),

  endDate: Joi.date().iso().required().messages({
    'date.base': 'End date must be a valid date',
    'any.required': 'End date is required',
  }),

  activatedAt: Joi.date().iso().optional().messages({
    'date.base': 'Activated at must be a valid date',
  }),

  expiredAt: Joi.date().iso().optional().messages({
    'date.base': 'Expired at must be a valid date',
  }),

  currentAmount: Joi.number().precision(2).min(0).default(0).messages({
    'number.base': 'Current amount must be a number',
    'number.min': 'Current amount cannot be negative',
  }),
});

/**
 * PURCHASE SUBSCRIPTION CARD SCHEMA
 */
export const purchaseSubscriptionCardSchema = Joi.object({
  cardId: Joi.string().trim().required().messages({
    'string.empty': 'Card ID is required',
    'any.required': 'Card ID is required',
  }),

  referralCode: Joi.string().trim().optional().allow(null, '').messages({
    'string.empty': 'Referral code cannot be empty',
  }),
});

/**
 * UPDATE USER SUBSCRIPTION CARD SCHEMA
 */
export const updateUserSubscriptionCardSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(CardSubscriptionStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of ${Object.values(CardSubscriptionStatus).join(', ')}`,
    }),

  startDate: Joi.date().iso().optional().messages({
    'date.base': 'Start date must be a valid date',
  }),

  endDate: Joi.date().iso().optional().messages({
    'date.base': 'End date must be a valid date',
  }),

  activatedAt: Joi.date().iso().optional().messages({
    'date.base': 'Activated at must be a valid date',
  }),

  expiredAt: Joi.date().iso().optional().messages({
    'date.base': 'Expired at must be a valid date',
  }),

  currentAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Current amount must be a number',
    'number.min': 'Current amount cannot be negative',
  }),

  referralCodeId: Joi.string().trim().optional().allow(null, '').messages({
    'string.base': 'Referral code ID must be a string',
  }),

  cardId: Joi.string().trim().optional(),
  customerId: Joi.string().trim().optional(),
});