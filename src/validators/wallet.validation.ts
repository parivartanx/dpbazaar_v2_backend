import Joi from 'joi';
import { WalletType } from '@prisma/client';

/**
 * CREATE WALLET SCHEMA
 */
export const createWalletSchema = Joi.object({
  customerId: Joi.string().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),

  type: Joi.string()
    .valid(...Object.values(WalletType))
    .required()
    .messages({
      'any.only': `Type must be one of ${Object.values(WalletType).join(', ')}`,
      'any.required': 'Wallet type is required',
    }),

  balance: Joi.number().precision(2).min(0).default(0).messages({
    'number.base': 'Balance must be a number',
    'number.min': 'Balance cannot be negative',
  }),
});

/**
 * UPDATE WALLET SCHEMA
 */
export const updateWalletSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(WalletType))
    .optional(),

  balance: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Balance must be a number',
    'number.min': 'Balance cannot be negative',
  }),
});