import Joi from 'joi';

const cuidRegex = /^c[^\s-]{8,}$/;

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
  categoryId: Joi.string().pattern(cuidRegex).optional().allow(null, '').messages({
    'string.pattern.base': 'Category ID must be a valid CUID',
  }),
  stockStatus: Joi.string()
    .valid('IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK', 'DISCONTINUED')
    .optional()
    .messages({
      'any.only': 'Stock status must be valid',
    }),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT', 'DELETED')
    .optional()
    .messages({
      'any.only': 'Status must be valid',
    }),
  brandId: Joi.string().pattern(cuidRegex).optional().allow(null, '').messages({
    'string.pattern.base': 'Brand ID must be a valid CUID',
  }),
  vendorId: Joi.string().pattern(cuidRegex).optional().allow(null, '').messages({
    'string.pattern.base': 'Vendor ID must be a valid CUID',
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
    length: Joi.number().min(0).optional().messages({
      'number.min': 'Length cannot be negative',
    }),
    width: Joi.number().min(0).optional().messages({
      'number.min': 'Width cannot be negative',
    }),
    height: Joi.number().min(0).optional().messages({
      'number.min': 'Height cannot be negative',
    }),
    unit: Joi.string().optional()
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
  publishedAt: Joi.date().optional(),
});

const updateProductSchema = createProductSchema.fork(
  Object.keys(createProductSchema.describe().keys),
  field => field.optional()
);

/**
 * CREATE VARIANT SCHEMA
 */
const createVariantSchema = Joi.object({
  variantSku: Joi.string().trim().max(50).required().messages({
    'string.base': 'Variant SKU must be a string',
    'string.empty': 'Variant SKU is required',
    'string.max': 'Variant SKU must be at most {#limit} characters',
    'any.required': 'Variant SKU is required',
  }),
  variantName: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Variant name must be a string',
    'string.empty': 'Variant name is required',
    'string.min': 'Variant name must be at least {#limit} characters',
    'string.max': 'Variant name must be at most {#limit} characters',
    'any.required': 'Variant name is required',
  }),

  mrp: Joi.number().min(0).optional().messages({
    'number.base': 'MRP must be a number',
    'number.min': 'MRP cannot be negative',
  }),
  sellingPrice: Joi.number().min(0).optional().messages({
    'number.base': 'Selling price must be a number',
    'number.min': 'Selling price cannot be negative',
  }),

  attributes: Joi.object()
    .pattern(Joi.string(), Joi.any())
    .required()
    .messages({
      'object.base': 'Attributes must be a valid object',
      'any.required': 'Attributes are required',
    }),

  weight: Joi.number().min(0).optional().messages({
    'number.base': 'Weight must be a number',
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

  isActive: Joi.boolean().optional(),
});

/**
 * UPDATE VARIANT SCHEMA
 */
const updateVariantSchema = createVariantSchema.fork(
  Object.keys(createVariantSchema.describe().keys),
  field => field.optional()
);

export {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
};
