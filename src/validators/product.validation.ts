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
  categoryId: Joi.string()
    .pattern(cuidRegex)
    .optional()
    .allow(null, '')
    .messages({
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
  vendorId: Joi.string()
    .pattern(cuidRegex)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Vendor ID must be a valid CUID',
    }),
  shortDescription: Joi.string().max(255).optional().allow(null).messages({
    'string.max': 'Short description must be at most {#limit} characters',
  }),
  sku: Joi.string().trim().max(50).required().messages({
    'string.base': 'SKU must be a string',
    'string.empty': 'SKU is required',
    'string.max': 'SKU must be at most {#limit} characters',
    'any.required': 'SKU is required',
  }),
  slug: Joi.string().trim().required().messages({
    'string.base': 'Slug must be a string',
    'string.empty': 'Slug is required',
    'any.required': 'Slug is required',
  }),
  barcode: Joi.string().trim().max(50).optional().allow(null, '').messages({
    'string.max': 'Barcode must be at most {#limit} characters',
  }),
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
    unit: Joi.string().optional(),
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
    .pattern(Joi.string().trim(), Joi.any())
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

/**
 * INVENTORY SCHEMA (shared for product/variant inventory)
 */
const inventorySchema = Joi.object({
  warehouseId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'Warehouse ID must be a valid CUID',
    'any.required': 'Warehouse ID is required',
  }),

  // Stock Levels
  availableQuantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Available quantity must be a number',
    'number.min': 'Available quantity cannot be negative',
    'any.required': 'Available quantity is required',
  }),
  reservedQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Reserved quantity cannot be negative',
    }),
  damagedQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.min': 'Damaged quantity cannot be negative',
    }),

  // Thresholds
  minStockLevel: Joi.number().integer().min(0).optional().default(10).messages({
    'number.min': 'Min stock level cannot be negative',
  }),
  maxStockLevel: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(1000)
    .messages({
      'number.min': 'Max stock level cannot be negative',
    }),
  reorderPoint: Joi.number().integer().min(0).optional().default(20).messages({
    'number.min': 'Reorder point cannot be negative',
  }),
  reorderQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(100)
    .messages({
      'number.min': 'Reorder quantity cannot be negative',
    }),

  // Warehouse Location
  rack: Joi.string().optional().allow(null, ''),
  shelf: Joi.string().optional().allow(null, ''),
  bin: Joi.string().optional().allow(null, ''),
});

/**
 * IMAGE SCHEMA
 */
const imageSchema = Joi.object({
  imageKey: Joi.string().required().messages({
    'string.empty': 'Image key is required',
    'any.required': 'Image key is required',
  }),
  isPrimary: Joi.boolean().optional().default(false),
  alt: Joi.string().optional().allow(null, ''),
  caption: Joi.string().optional().allow(null, ''),
});

/**
 * PRODUCT ATTRIBUTE SCHEMA
 */
const productAttributeSchema = Joi.object({
  attributeTypeId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'Attribute type ID must be a valid CUID',
    'any.required': 'Attribute type ID is required',
  }),
  value: Joi.string().required().messages({
    'string.empty': 'Attribute value is required',
    'any.required': 'Attribute value is required',
  }),
});

/**
 * VARIANT SCHEMA (for comprehensive creation)
 */
const variantWithInventorySchema = Joi.object({
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
  attributes: Joi.object()
    .pattern(Joi.string().trim(), Joi.any())
    .required()
    .messages({
      'object.base': 'Attributes must be a valid object',
      'any.required': 'Variant attributes are required',
    }),
  mrp: Joi.number().min(0).optional().messages({
    'number.min': 'MRP cannot be negative',
  }),
  sellingPrice: Joi.number().min(0).optional().messages({
    'number.min': 'Selling price cannot be negative',
  }),
  weight: Joi.number().min(0).optional().messages({
    'number.min': 'Weight cannot be negative',
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0).optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional(),
    unit: Joi.string().optional(),
  }).optional(),
  isActive: Joi.boolean().optional().default(true),
  inventory: inventorySchema.optional(),
});

/**
 * CREATE PRODUCT COMPLETE SCHEMA
 * Comprehensive schema for creating product with all related entities
 */
const createProductCompleteSchema = Joi.object({
  // Required fields
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least {#limit} characters',
    'string.max': 'Name must be at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  sku: Joi.string().trim().max(50).required().messages({
    'string.base': 'SKU must be a string',
    'string.empty': 'SKU is required',
    'string.max': 'SKU must be at most {#limit} characters',
    'any.required': 'SKU is required',
  }),
  slug: Joi.string().trim().required().messages({
    'string.base': 'Slug must be a string',
    'string.empty': 'Slug is required',
    'any.required': 'Slug is required',
  }),
  description: Joi.string().trim().min(5).required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least {#limit} characters',
    'any.required': 'Description is required',
  }),
  mrp: Joi.number().min(0).required().messages({
    'number.base': 'MRP must be a number',
    'number.min': 'MRP cannot be negative',
    'any.required': 'MRP is required',
  }),
  sellingPrice: Joi.number().min(0).required().messages({
    'number.base': 'Selling price must be a number',
    'number.min': 'Selling price cannot be negative',
    'any.required': 'Selling price is required',
  }),
  categoryId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'Category ID must be a valid CUID',
    'any.required': 'Category ID is required',
  }),
  brandId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'Brand ID must be a valid CUID',
    'any.required': 'Brand ID is required',
  }),

  // Optional fields
  shortDescription: Joi.string().max(255).optional().allow(null, ''),
  barcode: Joi.string().trim().max(50).optional().allow(null, ''),
  costPrice: Joi.number().min(0).optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
  hsnCode: Joi.string().max(20).optional().allow(null, ''),
  vendorId: Joi.string().pattern(cuidRegex).optional().allow(null, ''),

  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'ARCHIVED', 'DRAFT', 'DELETED')
    .optional()
    .default('DRAFT'),
  stockStatus: Joi.string()
    .valid('IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK', 'DISCONTINUED')
    .optional()
    .default('OUT_OF_STOCK'),

  weight: Joi.number().min(0).optional(),
  dimensions: Joi.object({
    length: Joi.number().min(0).optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional(),
    unit: Joi.string().optional(),
  }).optional(),

  metaTitle: Joi.string().optional().allow(null, ''),
  metaDescription: Joi.string().optional().allow(null, ''),
  metaKeywords: Joi.array().items(Joi.string()).optional(),

  isFeatured: Joi.boolean().optional().default(false),
  isNewArrival: Joi.boolean().optional().default(false),
  isBestSeller: Joi.boolean().optional().default(false),
  isReturnable: Joi.boolean().optional().default(true),
  returnPeriodDays: Joi.number().min(0).optional().default(7),

  tags: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
  publishedAt: Joi.date().optional().allow(null),

  // Nested arrays
  images: Joi.array().items(imageSchema).optional(),
  attributes: Joi.array().items(productAttributeSchema).optional(),
  variants: Joi.array().items(variantWithInventorySchema).optional(),
  inventory: inventorySchema.optional(),
});

export {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
  createProductCompleteSchema,
};
