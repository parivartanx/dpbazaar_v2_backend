import Joi from 'joi';

export const createVendorPayoutSchema = Joi.object({
  vendorId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('INR'),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').default('PENDING'),
  periodStart: Joi.date().required(),
  periodEnd: Joi.date().required(),
  transactionId: Joi.string().optional(),
  paymentMethod: Joi.string().optional(),
  paymentDetails: Joi.object().optional(),
});

export const updateVendorPayoutSchema = Joi.object({
  amount: Joi.number().positive(),
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'),
  transactionId: Joi.string(),
  paymentMethod: Joi.string(),
  paymentDetails: Joi.object(),
  processedAt: Joi.date(),
});

export const updateVendorPayoutStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED').required(),
});
