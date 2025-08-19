import Joi from 'joi';

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least {#limit} characters',
    'string.max': 'Name must be at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  description: Joi.string().trim().min(5).required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least {#limit} characters',
    'any.required': 'Description is required',
  }),
  sellingPrice: Joi.number().min(0).required().messages({
    'number.base': 'Selling price must be a number',
    'number.min': 'Selling price cannot be negative',
    'any.required': 'Selling price is required',
  }),
  mrp: Joi.number().min(0).required().messages({
    'number.base': 'MRP must be a number',
    'number.min': 'MRP cannot be negative',
    'any.required': 'MRP is required',
  }),
  costPrice: Joi.number().min(0).optional().messages({
    'number.base': 'Cost price must be a number',
    'number.min': 'Cost price cannot be negative',
  }),
  categoryId: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Category ID must be a valid UUID',
  }),
  stockStatus: Joi.string()
    .valid('IN_STOCK', 'OUT_OF_STOCK')
    .optional()
    .messages({
      'any.only': 'Stock status must be either IN_STOCK or OUT_OF_STOCK',
    }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional().messages({
    'any.only': 'Status must be either ACTIVE or INACTIVE',
  }),
  brandId: Joi.string().uuid().optional().messages({
    'string.guid': 'Brand ID must be a valid UUID',
  }),
  vendorId: Joi.string().uuid().optional().messages({
    'string.guid': 'Vendor ID must be a valid UUID',
  }),
  shortDescription: Joi.string().max(255).optional().allow(null).messages({
    'string.max': 'Short description must be at most {#limit} characters',
  }),
  sku: Joi.string().max(50).optional().messages({
    'string.max': 'SKU must be at most {#limit} characters',
  }),
  slug: Joi.string().optional(),
  taxRate: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Tax rate cannot be negative',
    'number.max': 'Tax rate cannot exceed {#limit}%',
  }),
  hsnCode: Joi.string().max(20).optional().messages({
    'string.max': 'HSN code must be at most {#limit} characters',
  }),
  weight: Joi.number().min(0).optional().messages({
    'number.min': 'Weight cannot be negative',
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0).messages({
      'number.min': 'Length cannot be negative',
    }),
    width: Joi.number().min(0).messages({
      'number.min': 'Width cannot be negative',
    }),
    height: Joi.number().min(0).messages({
      'number.min': 'Height cannot be negative',
    }),
  }).optional(),
  metaTitle: Joi.string().optional(),
  metaDescription: Joi.string().optional(),
  metaKeywords: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Meta keywords must be an array of strings',
  }),
  isFeatured: Joi.boolean().optional(),
  isNewArrival: Joi.boolean().optional(),
  isBestSeller: Joi.boolean().optional(),
  isReturnable: Joi.boolean().optional(),
  returnPeriodDays: Joi.number().min(0).optional().messages({
    'number.min': 'Return period days cannot be negative',
  }),
  tags: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Tags must be an array of strings',
  }),
  metadata: Joi.object().optional(),
});

const updateProductSchema = createProductSchema.fork(
  Object.keys(createProductSchema.describe().keys),
  field => field.optional()
);

export { createProductSchema, updateProductSchema };
