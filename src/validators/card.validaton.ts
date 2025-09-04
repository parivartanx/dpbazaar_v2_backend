import Joi from 'joi';
import { Visibility, CardStatus } from '@prisma/client';

/**
 * CREATE CARD SCHEMA
 */
export const createCardSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Card name is required',
    'string.min': 'Card name must be at least 2 characters',
  }),

  validityDays: Joi.number().integer().min(1).required().messages({
    'number.base': 'Validity days must be a number',
    'number.min': 'Validity days must be at least 1',
    'any.required': 'Validity days are required',
  }),

  benefitDays: Joi.array()
    .items(
      Joi.string().valid(
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
      )
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Benefit days must be an array of weekdays',
      'any.only': 'Benefit days must be a valid weekday',
      'any.required': 'At least one benefit day is required',
    }),

  benefitPercent: Joi.number().integer().min(0).max(100).required().messages({
    'number.base': 'Benefit percent must be a number',
    'number.min': 'Benefit percent cannot be negative',
    'number.max': 'Benefit percent cannot exceed 100',
    'any.required': 'Benefit percent is required',
  }),

  price: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),

  image: Joi.string().uri().required().messages({
    'string.empty': 'Image URL is required',
    'string.uri': 'Image must be a valid URL',
  }),

  visibility: Joi.string()
    .valid(...Object.values(Visibility))
    .required()
    .messages({
      'any.only': `Visibility must be one of ${Object.values(Visibility).join(', ')}`,
      'any.required': 'Visibility is required',
    }),

  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .default(CardStatus.ACTIVE)
    .messages({
      'any.only': `Status must be one of ${Object.values(CardStatus).join(', ')}`,
    }),
});

/**
 * UPDATE CARD SCHEMA
 */
export const updateCardSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  validityDays: Joi.number().integer().min(1).optional(),
  benefitDays: Joi.array()
    .items(
      Joi.string().valid(
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
      )
    )
    .optional(),
  benefitPercent: Joi.number().integer().min(0).max(100).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  image: Joi.string().uri().optional(),
  visibility: Joi.string()
    .valid(...Object.values(Visibility))
    .optional(),
  status: Joi.string()
    .valid(...Object.values(CardStatus))
    .optional(),
});
