import Joi from 'joi';

export const createRefundSchema = Joi.object({
  paymentId: Joi.string().trim().required().messages({
    'string.empty': 'Payment ID is required',
    'any.required': 'Payment ID is required',
  }),
  returnId: Joi.string().trim().optional().allow(null, ''),
  amount: Joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount cannot be negative',
    'any.required': 'Amount is required',
  }),
  reason: Joi.string().trim().required().messages({
    'string.empty': 'Reason is required',
    'any.required': 'Reason is required',
  }),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED').default('PENDING').optional(),
  gatewayRefundId: Joi.string().trim().optional().allow(null, ''),
  gatewayResponse: Joi.object().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
});

export const updateRefundSchema = Joi.object({
  paymentId: Joi.string().trim().optional(),
  returnId: Joi.string().trim().optional().allow(null, ''),
  amount: Joi.number().min(0).optional(),
  reason: Joi.string().trim().optional(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED').optional(),
  gatewayRefundId: Joi.string().trim().optional().allow(null, ''),
  gatewayResponse: Joi.object().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
});
