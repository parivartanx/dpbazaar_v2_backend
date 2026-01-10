import Joi from 'joi';

export const createVendorPayoutSchema = Joi.object({
  vendorId: Joi.string().trim().required().messages({
    'string.empty': 'Vendor ID is required',
    'any.required': 'Vendor ID is required',
  }),
  amount: Joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount cannot be negative',
    'any.required': 'Amount is required',
  }),
  currency: Joi.string().trim().default('INR').optional(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').default('PENDING').optional(),
  periodStart: Joi.date().iso().required().messages({
    'date.base': 'Period Start must be a valid date',
    'any.required': 'Period Start is required',
  }),
  periodEnd: Joi.date().iso().min(Joi.ref('periodStart')).required().messages({
    'date.base': 'Period End must be a valid date',
    'date.min': 'Period End must be after Period Start',
    'any.required': 'Period End is required',
  }),
  transactionId: Joi.string().trim().optional().allow(null, ''),
  paymentMethod: Joi.string().trim().optional().allow(null, ''),
  paymentDetails: Joi.object().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
});

export const updateVendorPayoutSchema = Joi.object({
  vendorId: Joi.string().trim().optional(),
  amount: Joi.number().min(0).optional(),
  currency: Joi.string().trim().optional(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').optional(),
  periodStart: Joi.date().iso().optional(),
  periodEnd: Joi.date().iso().optional(),
  transactionId: Joi.string().trim().optional().allow(null, ''),
  paymentMethod: Joi.string().trim().optional().allow(null, ''),
  paymentDetails: Joi.object().optional().allow(null),
  processedAt: Joi.date().iso().optional().allow(null),
});

export const updateVendorPayoutStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').required(),
});
