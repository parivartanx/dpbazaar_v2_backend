import Joi from 'joi';

export const createRefundSchema = Joi.object({
  paymentId: Joi.string().required(),
  returnId: Joi.string().optional(),
  amount: Joi.number().required(),
  reason: Joi.string().required(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED').default('PENDING'),
});

export const updateRefundSchema = Joi.object({
  amount: Joi.number().optional(),
  reason: Joi.string().optional(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED').optional(),
  gatewayRefundId: Joi.string().optional(),
  processedAt: Joi.date().optional(),
});
