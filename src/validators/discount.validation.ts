import Joi from 'joi';

export const createDiscountSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(3).required().messages({
    'string.base': 'Code must be a string',
    'string.empty': 'Code is required',
    'string.min': 'Code must be at least {#limit} characters',
    'any.required': 'Code is required',
  }),
  description: Joi.string().trim().required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
  }),
  type: Joi.string().valid('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_SHIPPING').required().messages({
    'any.only': 'Invalid discount type',
    'any.required': 'Type is required',
  }),
  value: Joi.number().min(0).required().messages({
    'number.base': 'Value must be a number',
    'number.min': 'Value cannot be negative',
    'any.required': 'Value is required',
  }),
  minOrderAmount: Joi.number().min(0).allow(null).optional(),
  maxDiscountAmount: Joi.number().min(0).allow(null).optional(),
  usageLimit: Joi.number().integer().min(1).allow(null).optional(),
  usagePerCustomer: Joi.number().integer().min(1).default(1).optional(),
  validFrom: Joi.date().iso().required().messages({
    'date.base': 'Valid From must be a valid date',
    'any.required': 'Valid From is required',
  }),
  validUntil: Joi.date().iso().min(Joi.ref('validFrom')).required().messages({
    'date.base': 'Valid Until must be a valid date',
    'date.min': 'Valid Until must be after Valid From',
    'any.required': 'Valid Until is required',
  }),
  isActive: Joi.boolean().default(true).optional(),
  applicableCategories: Joi.array().items(Joi.string().trim()).default([]).optional(),
  applicableProducts: Joi.array().items(Joi.string().trim()).default([]).optional(),
  applicableBrands: Joi.array().items(Joi.string().trim()).default([]).optional(),
  customerSegments: Joi.array().items(Joi.string().trim()).default([]).optional(),
});

export const updateDiscountSchema = createDiscountSchema.fork(
  Object.keys(createDiscountSchema.describe().keys),
  (schema) => schema.optional()
);
