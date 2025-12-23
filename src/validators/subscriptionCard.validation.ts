import Joi from 'joi';
import { CardStatus, Visibility } from '@prisma/client';

/**
 * CREATE SUBSCRIPTION CARD SCHEMA
 */
export const createSubscriptionCardSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Card name is required',
    'string.min': 'Card name must be at least 2 characters',
    'any.required': 'Card name is required',
  }),

  price: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),

  targetAmount: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Target amount must be a number',
    'number.min': 'Target amount cannot be negative',
    'any.required': 'Target amount is required',
  }),

  rewardPercent: Joi.number().precision(2).min(0).max(100).required().messages({
    'number.base': 'Reward percent must be a number',
    'number.min': 'Reward percent cannot be negative',
    'number.max': 'Reward percent cannot exceed 100',
    'any.required': 'Reward percent is required',
  }),

  capPercentage: Joi.number().integer().min(0).max(100).required().messages({
    'number.base': 'Cap percentage must be a number',
    'number.min': 'Cap percentage cannot be negative',
    'number.max': 'Cap percentage cannot exceed 100',
    'any.required': 'Cap percentage is required',
  }),

  benefitDays: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .messages({
      'array.base': 'Benefit days must be an array',
      'array.min': 'At least one benefit day is required',
      'any.required': 'Benefit days are required',
    }),

  referralRewardPercent: Joi.number().precision(2).min(0).max(100).optional().messages({
    'number.base': 'Referral reward percent must be a number',
    'number.min': 'Referral reward percent cannot be negative',
    'number.max': 'Referral reward percent cannot exceed 100',
  }),

  referralRewardAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Referral reward amount must be a number',
    'number.min': 'Referral reward amount cannot be negative',
  }),

  validityDays: Joi.number().integer().min(1).required().messages({
    'number.base': 'Validity days must be a number',
    'number.min': 'Validity days must be at least 1',
    'any.required': 'Validity days are required',
  }),

  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .default(CardStatus.ACTIVE)
    .messages({
      'any.only': `Status must be one of ${Object.values(CardStatus).join(', ')}`,
    }),

  visibility: Joi.string()
    .valid(...Object.values(Visibility))
    .required()
    .messages({
      'any.only': `Visibility must be one of ${Object.values(Visibility).join(', ')}`,
      'any.required': 'Visibility is required',
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
    .messages({
      'array.base': 'Images must be an array of URLs',
      'string.uri': 'Each image must be a valid URL',
    }),
});

/**
 * UPDATE SUBSCRIPTION CARD SCHEMA
 */
export const updateSubscriptionCardSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    'string.empty': 'Card name cannot be empty',
    'string.min': 'Card name must be at least 2 characters',
  }),

  price: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
  }),

  targetAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Target amount must be a number',
    'number.min': 'Target amount cannot be negative',
  }),

  rewardPercent: Joi.number().precision(2).min(0).max(100).optional().messages({
    'number.base': 'Reward percent must be a number',
    'number.min': 'Reward percent cannot be negative',
    'number.max': 'Reward percent cannot exceed 100',
  }),

  capPercentage: Joi.number().integer().min(0).max(100).optional().messages({
    'number.base': 'Cap percentage must be a number',
    'number.min': 'Cap percentage cannot be negative',
    'number.max': 'Cap percentage cannot exceed 100',
  }),

  benefitDays: Joi.array()
    .items(Joi.string())
    .min(1)
    .optional()
    .messages({
      'array.base': 'Benefit days must be an array',
      'array.min': 'At least one benefit day is required',
    }),

  referralRewardPercent: Joi.number().precision(2).min(0).max(100).optional().messages({
    'number.base': 'Referral reward percent must be a number',
    'number.min': 'Referral reward percent cannot be negative',
    'number.max': 'Referral reward percent cannot exceed 100',
  }),

  referralRewardAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Referral reward amount must be a number',
    'number.min': 'Referral reward amount cannot be negative',
  }),

  validityDays: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Validity days must be a number',
    'number.min': 'Validity days must be at least 1',
  }),

  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of ${Object.values(CardStatus).join(', ')}`,
    }),

  visibility: Joi.string()
    .valid(...Object.values(Visibility))
    .optional()
    .messages({
      'any.only': `Visibility must be one of ${Object.values(Visibility).join(', ')}`,
    }),

  images: Joi.array()
    .items(Joi.string().uri())
    .optional()
    .messages({
      'array.base': 'Images must be an array of URLs',
      'string.uri': 'Each image must be a valid URL',
    }),
});