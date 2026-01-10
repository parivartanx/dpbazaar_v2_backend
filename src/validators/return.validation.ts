import Joi from 'joi';

export const createReturnSchema = Joi.object({
  orderId: Joi.string().trim().required().messages({
    'string.empty': 'Order ID is required',
    'any.required': 'Order ID is required',
  }),
  returnNumber: Joi.string().trim().required().messages({
    'string.empty': 'Return Number is required',
    'any.required': 'Return Number is required',
  }),
  type: Joi.string().valid('RETURN', 'EXCHANGE', 'REPLACEMENT').required().messages({
    'any.only': 'Type must be one of RETURN, EXCHANGE, REPLACEMENT',
    'any.required': 'Type is required',
  }),
  reason: Joi.string().trim().required().messages({
    'string.empty': 'Reason is required',
    'any.required': 'Reason is required',
  }),
  detailedReason: Joi.string().trim().optional().allow(null, ''),
  status: Joi.string().valid('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'PROCESSING', 'REFUNDED', 'REPLACED').default('REQUESTED').optional(),
  customerComments: Joi.string().trim().optional().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()).optional().default([]),
  pickupAddress: Joi.object().optional().allow(null),
  pickupScheduledDate: Joi.date().iso().optional().allow(null),
  pickupCompletedAt: Joi.date().iso().optional().allow(null),
  inspectionNotes: Joi.string().trim().optional().allow(null, ''),
  inspectionCompletedAt: Joi.date().iso().optional().allow(null),
  inspectedBy: Joi.string().trim().optional().allow(null, ''),
  refundAmount: Joi.number().min(0).optional().allow(null),
  refundMethod: Joi.string().valid('ORIGINAL_PAYMENT', 'STORE_CREDIT', 'BANK_TRANSFER').optional().allow(null, ''),
  exchangeOrderId: Joi.string().trim().optional().allow(null, ''),
  approvedAt: Joi.date().iso().optional().allow(null),
  rejectedAt: Joi.date().iso().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
  source: Joi.string().valid('WEBSITE', 'APP', 'POS', 'SYSTEM').default('WEBSITE').optional(),
  createdBy: Joi.string().trim().optional().allow(null, ''),
  items: Joi.array().items(Joi.object({
    orderItemId: Joi.string().trim().required(),
    quantity: Joi.number().integer().min(1).required(),
    condition: Joi.string().valid('NEW', 'USED', 'DAMAGED').default('USED').optional()
  })).optional().default([])
});

export const updateReturnSchema = Joi.object({
  status: Joi.string().valid('REQUESTED', 'APPROVED', 'REJECTED', 'PICKED_UP', 'RECEIVED', 'PROCESSING', 'REFUNDED', 'REPLACED').optional(),
  type: Joi.string().valid('RETURN', 'EXCHANGE', 'REPLACEMENT').optional(),
  reason: Joi.string().trim().optional(),
  detailedReason: Joi.string().trim().optional().allow(null, ''),
  customerComments: Joi.string().trim().optional().allow(null, ''),
  images: Joi.array().items(Joi.string().uri()).optional(),
  pickupAddress: Joi.object().optional().allow(null),
  pickupScheduledDate: Joi.date().iso().optional().allow(null),
  pickupCompletedAt: Joi.date().iso().optional().allow(null),
  inspectionNotes: Joi.string().trim().optional().allow(null, ''),
  inspectionCompletedAt: Joi.date().iso().optional().allow(null),
  inspectedBy: Joi.string().trim().optional().allow(null, ''),
  refundAmount: Joi.number().min(0).optional().allow(null),
  refundMethod: Joi.string().valid('ORIGINAL_PAYMENT', 'STORE_CREDIT', 'BANK_TRANSFER').optional().allow(null, ''),
  exchangeOrderId: Joi.string().trim().optional().allow(null, ''),
  approvedAt: Joi.date().iso().optional().allow(null),
  rejectedAt: Joi.date().iso().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
  createdBy: Joi.string().trim().optional().allow(null, ''),
});
