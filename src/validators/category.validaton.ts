import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 2 characters',
  }),

  slug: Joi.string().min(2).max(100).optional().messages({
    'string.min': 'Slug must be at least 2 characters',
  }),

  description: Joi.string().max(500).optional().allow(null),

  image: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'Image must be a valid URL',
  }),

  icon: Joi.string().uri().optional().allow(null).messages({
    'string.uri': 'Icon must be a valid URL',
  }),

  parentId: Joi.string().optional().allow(null),

  level: Joi.number().integer().min(0).optional(),

  path: Joi.string().min(1).optional().messages({
    'string.empty': 'Path cannot be empty',
  }),

  metaTitle: Joi.string().max(150).optional().allow(null),
  metaDescription: Joi.string().max(300).optional().allow(null),
  metaKeywords: Joi.array().items(Joi.string()).optional().default([]),

  displayOrder: Joi.number().integer().min(0).default(0),

  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),

  commissionRate: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .optional()
    .allow(null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  slug: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).optional().allow(null),
  image: Joi.string().uri().optional().allow(null),
  icon: Joi.string().uri().optional().allow(null),
  parentId: Joi.string().optional().allow(null),
  level: Joi.number().integer().min(0).optional(),
  path: Joi.string().min(1).optional(),
  metaTitle: Joi.string().max(150).optional().allow(null),
  metaDescription: Joi.string().max(300).optional().allow(null),
  metaKeywords: Joi.array().items(Joi.string()).optional(),
  displayOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  commissionRate: Joi.number()
    .precision(2)
    .min(0)
    .max(100)
    .optional()
    .allow(null),
});

export const toggleFeatureSchema = Joi.object({
  isFeatured: Joi.boolean().required().messages({
    'any.required': 'isFeatured is required',
    'boolean.base': 'isFeatured must be a boolean value',
  }),
});

export const toggleActiveSchema = Joi.object({
  isActive: Joi.boolean().required().messages({
    'any.required': 'isActive is required',
    'boolean.base': 'isActive must be a boolean value',
  }),
});
