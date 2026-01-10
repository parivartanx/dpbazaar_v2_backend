import Joi from 'joi';

/**
 * CREATE ADDRESS SCHEMA
 */
export const createAddressSchema = Joi.object({
  customerId: Joi.string().trim().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),

  type: Joi.string()
    .valid('HOME', 'WORK', 'OTHER')
    .default('HOME')
    .optional()
    .messages({
      'any.only': 'Type must be one of HOME, WORK, OTHER',
    }),

  isDefault: Joi.boolean().default(false).optional(),

  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be less than 100 characters',
    'any.required': 'Full name is required',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 10-15 digits',
      'any.required': 'Phone number is required',
    }),

  alternatePhone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Alternate phone number must be 10-15 digits',
    }),

  addressLine1: Joi.string().trim().min(5).max(200).required().messages({
    'string.empty': 'Address line 1 is required',
    'string.min': 'Address line 1 must be at least 5 characters',
    'string.max': 'Address line 1 must be less than 200 characters',
    'any.required': 'Address line 1 is required',
  }),

  addressLine2: Joi.string().trim().max(200).optional().allow(null, ''),

  landmark: Joi.string().trim().max(100).optional().allow(null, ''),

  city: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
    'any.required': 'City is required',
  }),

  state: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'State is required',
    'string.min': 'State must be at least 2 characters',
    'string.max': 'State must be less than 50 characters',
    'any.required': 'State is required',
  }),

  country: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least 2 characters',
    'string.max': 'Country must be less than 50 characters',
    'any.required': 'Country is required',
  }),

  postalCode: Joi.string().trim().min(3).max(10).required().messages({
    'string.empty': 'Postal code is required',
    'string.min': 'Postal code must be at least 3 characters',
    'string.max': 'Postal code must be less than 10 characters',
    'any.required': 'Postal code is required',
  }),

  lat: Joi.number().min(-90).max(90).optional().allow(null).messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
  }),

  lng: Joi.number().min(-180).max(180).optional().allow(null).messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
  }),

  deliveryInstructions: Joi.string().trim().max(500).optional().allow(null, ''),
});

/**
 * CREATE ADDRESS SCHEMA FOR CUSTOMER (without customerId requirement)
 */
export const createCustomerAddressSchema = Joi.object({
  type: Joi.string()
    .valid('HOME', 'WORK', 'OTHER')
    .default('HOME')
    .messages({
      'any.only': 'Type must be one of HOME, WORK, OTHER',
    }),

  isDefault: Joi.boolean().default(false),

  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be less than 100 characters',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be 10-15 digits (numbers only, no spaces or special characters)',
    }),

  alternatePhone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Alternate phone number must be 10-15 digits (numbers only)',
    }),

  addressLine1: Joi.string().trim().min(3).max(200).required().messages({
    'string.empty': 'Address line 1 is required',
    'string.min': 'Address line 1 must be at least 3 characters',
    'string.max': 'Address line 1 must be less than 200 characters',
  }),

  addressLine2: Joi.string().trim().max(200).optional().allow(null, ''),

  landmark: Joi.string().trim().max(100).optional().allow(null, ''),

  city: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
  }),

  state: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'State is required',
    'string.min': 'State must be at least 2 characters',
    'string.max': 'State must be less than 50 characters',
  }),

  country: Joi.string().trim().min(2).max(50).default('India').optional().messages({
    'string.min': 'Country must be at least 2 characters',
    'string.max': 'Country must be less than 50 characters',
  }),

  postalCode: Joi.string().trim().min(3).max(10).required().messages({
    'string.empty': 'Postal code is required',
    'string.min': 'Postal code must be at least 3 characters',
    'string.max': 'Postal code must be less than 10 characters',
  }),

  lat: Joi.number().min(-90).max(90).optional().allow(null).messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
  }),

  lng: Joi.number().min(-180).max(180).optional().allow(null).messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
  }),

  deliveryInstructions: Joi.string().trim().max(500).optional().allow(null, ''),
});

/**
 * UPDATE ADDRESS SCHEMA
 */
export const updateAddressSchema = Joi.object({
  type: Joi.string().valid('HOME', 'WORK', 'OTHER').optional().messages({
    'any.only': 'Type must be one of HOME, WORK, OTHER',
  }),

  isDefault: Joi.boolean().optional(),

  fullName: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be less than 100 characters',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits',
    }),

  alternatePhone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Alternate phone number must be 10-15 digits',
    }),

  addressLine1: Joi.string().trim().min(5).max(200).optional().messages({
    'string.min': 'Address line 1 must be at least 5 characters',
    'string.max': 'Address line 1 must be less than 200 characters',
  }),

  addressLine2: Joi.string().trim().max(200).optional().allow(null, ''),

  landmark: Joi.string().trim().max(100).optional().allow(null, ''),

  city: Joi.string().trim().min(2).max(50).optional().messages({
    'string.min': 'City must be at least 2 characters',
    'string.max': 'City must be less than 50 characters',
  }),

  state: Joi.string().trim().min(2).max(50).optional().messages({
    'string.min': 'State must be at least 2 characters',
    'string.max': 'State must be less than 50 characters',
  }),

  country: Joi.string().trim().min(2).max(50).optional().messages({
    'string.min': 'Country must be at least 2 characters',
    'string.max': 'Country must be less than 50 characters',
  }),

  postalCode: Joi.string().trim().min(3).max(10).optional().messages({
    'string.min': 'Postal code must be at least 3 characters',
    'string.max': 'Postal code must be less than 10 characters',
  }),

  lat: Joi.number().min(-90).max(90).optional().allow(null).messages({
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
  }),

  lng: Joi.number().min(-180).max(180).optional().allow(null).messages({
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
  }),

  deliveryInstructions: Joi.string().trim().max(500).optional().allow(null, ''),
});