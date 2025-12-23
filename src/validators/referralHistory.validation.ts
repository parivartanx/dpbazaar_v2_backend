import Joi from 'joi';
import { ReferralStatus } from '@prisma/client';

/**
 * CREATE REFERRAL HISTORY SCHEMA
 */
export const createReferralHistorySchema = Joi.object({
  referralCodeId: Joi.string().required().messages({
    'string.empty': 'Referral code ID is required',
    'any.required': 'Referral code ID is required',
  }),

  referrerId: Joi.string().required().messages({
    'string.empty': 'Referrer ID is required',
    'any.required': 'Referrer ID is required',
  }),

  referredUserId: Joi.string().required().messages({
    'string.empty': 'Referred user ID is required',
    'any.required': 'Referred user ID is required',
  }),

  referrerSubscriptionId: Joi.string().required().messages({
    'string.empty': 'Referrer subscription ID is required',
    'any.required': 'Referrer subscription ID is required',
  }),

  triggeredCardId: Joi.string().required().messages({
    'string.empty': 'Triggered card ID is required',
    'any.required': 'Triggered card ID is required',
  }),

  status: Joi.string()
    .valid(...Object.values(ReferralStatus))
    .default(ReferralStatus.PENDING)
    .messages({
      'any.only': `Status must be one of ${Object.values(ReferralStatus).join(', ')}`,
    }),

  rewardAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Reward amount must be a number',
    'number.min': 'Reward amount cannot be negative',
  }),

  rewardedAt: Joi.date().iso().optional().messages({
    'date.base': 'Rewarded at must be a valid date',
  }),

  expiredAt: Joi.date().iso().optional().messages({
    'date.base': 'Expired at must be a valid date',
  }),
});

/**
 * UPDATE REFERRAL HISTORY SCHEMA
 */
export const updateReferralHistorySchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ReferralStatus))
    .optional()
    .messages({
      'any.only': `Status must be one of ${Object.values(ReferralStatus).join(', ')}`,
    }),

  rewardAmount: Joi.number().precision(2).min(0).optional().messages({
    'number.base': 'Reward amount must be a number',
    'number.min': 'Reward amount cannot be negative',
  }),

  rewardedAt: Joi.date().iso().optional().messages({
    'date.base': 'Rewarded at must be a valid date',
  }),

  expiredAt: Joi.date().iso().optional().messages({
    'date.base': 'Expired at must be a valid date',
  }),
});