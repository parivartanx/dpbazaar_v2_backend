import Joi from 'joi';
import { TransactionType, TransactionReason, TransactionStatus } from '@prisma/client';

/**
 * CREATE WALLET TRANSACTION SCHEMA
 */
export const createWalletTransactionSchema = Joi.object({
  walletId: Joi.string().required().messages({
    'string.empty': 'Wallet ID is required',
    'any.required': 'Wallet ID is required',
  }),

  customerId: Joi.string().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),

  type: Joi.string()
    .valid(...Object.values(TransactionType))
    .required()
    .messages({
      'any.only': `Type must be one of ${Object.values(TransactionType).join(', ')}`,
      'any.required': 'Transaction type is required',
    }),

  reason: Joi.string()
    .valid(...Object.values(TransactionReason))
    .required()
    .messages({
      'any.only': `Reason must be one of ${Object.values(TransactionReason).join(', ')}`,
      'any.required': 'Transaction reason is required',
    }),

  status: Joi.string()
    .valid(...Object.values(TransactionStatus))
    .default(TransactionStatus.PENDING)
    .messages({
      'any.only': `Status must be one of ${Object.values(TransactionStatus).join(', ')}`,
    }),

  amount: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount cannot be negative',
    'any.required': 'Amount is required',
  }),

  balanceBefore: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Balance before must be a number',
    'number.min': 'Balance before cannot be negative',
    'any.required': 'Balance before is required',
  }),

  balanceAfter: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Balance after must be a number',
    'number.min': 'Balance after cannot be negative',
    'any.required': 'Balance after is required',
  }),

  cardId: Joi.string().optional().messages({
    'string.empty': 'Card ID cannot be empty',
  }),

  subscriptionId: Joi.string().optional().messages({
    'string.empty': 'Subscription ID cannot be empty',
  }),

  referralId: Joi.string().optional().messages({
    'string.empty': 'Referral ID cannot be empty',
  }),

  rewardPercent: Joi.number().precision(2).min(0).max(100).optional().messages({
    'number.base': 'Reward percent must be a number',
    'number.min': 'Reward percent cannot be negative',
    'number.max': 'Reward percent cannot exceed 100',
  }),

  targetAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Target amount must be a number',
    'number.min': 'Target amount cannot be negative',
  }),

  capPercentage: Joi.number().integer().min(0).max(100).optional().messages({
    'number.base': 'Cap percentage must be a number',
    'number.min': 'Cap percentage cannot be negative',
    'number.max': 'Cap percentage cannot exceed 100',
  }),

  idempotencyKey: Joi.string().optional().messages({
    'string.empty': 'Idempotency key cannot be empty',
  }),

  metadata: Joi.object().optional().messages({
    'object.base': 'Metadata must be an object',
  }),
});

/**
 * UPDATE WALLET TRANSACTION SCHEMA
 */
export const updateWalletTransactionSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TransactionStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of ${Object.values(TransactionStatus).join(', ')}`,
    }),

  amount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount cannot be negative',
  }),

  balanceBefore: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Balance before must be a number',
    'number.min': 'Balance before cannot be negative',
  }),

  balanceAfter: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Balance after must be a number',
    'number.min': 'Balance after cannot be negative',
  }),

  cardId: Joi.string().optional().messages({
    'string.empty': 'Card ID cannot be empty',
  }),

  subscriptionId: Joi.string().optional().messages({
    'string.empty': 'Subscription ID cannot be empty',
  }),

  referralId: Joi.string().optional().messages({
    'string.empty': 'Referral ID cannot be empty',
  }),

  rewardPercent: Joi.number().precision(2).min(0).max(100).optional().messages({
    'number.base': 'Reward percent must be a number',
    'number.min': 'Reward percent cannot be negative',
    'number.max': 'Reward percent cannot exceed 100',
  }),

  targetAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Target amount must be a number',
    'number.min': 'Target amount cannot be negative',
  }),

  capPercentage: Joi.number().integer().min(0).max(100).optional().messages({
    'number.base': 'Cap percentage must be a number',
    'number.min': 'Cap percentage cannot be negative',
    'number.max': 'Cap percentage cannot exceed 100',
  }),

  idempotencyKey: Joi.string().optional().messages({
    'string.empty': 'Idempotency key cannot be empty',
  }),

  metadata: Joi.object().optional().messages({
    'object.base': 'Metadata must be an object',
  }),
});