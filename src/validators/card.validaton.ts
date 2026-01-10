import Joi from 'joi';
import { Visibility, CardStatus } from '@prisma/client';

/**
 * CREATE CARD SCHEMA (Note: Cards use SubscriptionCard model)
 */
export const createCardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Card name is required',
    'string.min': 'Card name must be at least 2 characters',
    'any.required': 'Card name is required',
  }),

  slug: Joi.string().trim().optional().allow(null, '').messages({
    'string.base': 'Slug must be a string',
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
 * UPDATE CARD SCHEMA
 */
export const updateCardSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  slug: Joi.string().trim().optional().allow(null, ''),
  price: Joi.number().precision(2).min(0).optional(),
  targetAmount: Joi.number().precision(2).min(0).optional(),
  rewardPercent: Joi.number().precision(2).min(0).max(100).optional(),
  capPercentage: Joi.number().integer().min(0).max(100).optional(),
  benefitDays: Joi.array()
    .items(Joi.string())
    .min(1)
    .optional(),
  referralRewardPercent: Joi.number().precision(2).min(0).max(100).optional(),
  referralRewardAmount: Joi.number().precision(2).min(0).optional(),
  validityDays: Joi.number().integer().min(1).optional(),
  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .optional(),
  visibility: Joi.string()
    .valid(...Object.values(Visibility))
    .optional(),
  images: Joi.array()
    .items(Joi.string().uri())
    .optional(),
});
