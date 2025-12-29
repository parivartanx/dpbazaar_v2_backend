import Joi from 'joi';

export const createReturnSchema = Joi.object({
  orderId: Joi.string().required(),
  returnNumber: Joi.string().required(),
  type: Joi.string().required(), // RETURN, EXCHANGE, REPLACEMENT
  reason: Joi.string().required(),
  detailedReason: Joi.string().optional(),
  status: Joi.string().valid('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'PROCESSING', 'REFUNDED', 'REPLACED').default('REQUESTED'),
  customerComments: Joi.string().optional(),
  items: Joi.array().items(Joi.object({
    orderItemId: Joi.string().required(),
    quantity: Joi.number().required(),
    condition: Joi.string().required()
  })).optional()
});

export const updateReturnSchema = Joi.object({
  status: Joi.string().valid('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'PROCESSING', 'REFUNDED', 'REPLACED').optional(),
  inspectionNotes: Joi.string().optional(),
  refundAmount: Joi.number().optional(),
  refundMethod: Joi.string().optional(),
  approvedAt: Joi.date().optional(),
  rejectedAt: Joi.date().optional(),
  processedAt: Joi.date().optional(),
});
