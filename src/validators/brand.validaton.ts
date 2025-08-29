import Joi from 'joi';

export const createBrandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 2 characters',
  }),

  slug: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Slug is required',
    'string.min': 'Slug must be at least 2 characters',
  }),

  logo: Joi.string().uri().optional().messages({
    'string.uri': 'Logo must be a valid URL',
  }),

  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),

  website: Joi.string().uri().optional().messages({
    'string.uri': 'Website must be a valid URL',
  }),

  isActive: Joi.boolean().default(true),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  slug: Joi.string().min(2).max(100).optional(),
  logo: Joi.string().uri().optional().allow(null),
  description: Joi.string().max(500).optional().allow(null),
  website: Joi.string().uri().optional().allow(null),
  isActive: Joi.boolean().optional(),
});
