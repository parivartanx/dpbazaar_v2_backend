import Joi from 'joi';

export const createVendorSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),
  vendorCode: Joi.string().trim().min(3).required().messages({
    'any.required': 'Vendor Code is required',
  }),
  businessName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Business Name is required',
  }),
  businessType: Joi.string().valid('INDIVIDUAL', 'COMPANY').required().messages({
    'any.only': 'Business Type must be INDIVIDUAL or COMPANY',
  }),
  gstNumber: Joi.string().trim().uppercase().optional().allow(null, ''),
  panNumber: Joi.string().trim().uppercase().optional().allow(null, ''),
  registrationNumber: Joi.string().trim().optional().allow(null, ''),
  businessEmail: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Business Email is required',
  }),
  businessPhone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Business Phone must be 10 digits',
    'any.required': 'Business Phone is required',
  }),
  supportEmail: Joi.string().email().optional().allow(null, ''),
  supportPhone: Joi.string().pattern(/^[0-9]{10}$/).optional().allow(null, ''),
  businessAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('India'),
  }).required().messages({
    'any.required': 'Business Address is required',
  }),
  warehouseAddresses: Joi.array().items(Joi.object()).optional().allow(null),
  bankDetails: Joi.object().optional().allow(null),
  commissionRate: Joi.number().min(0).max(100).default(10).optional(),
  metadata: Joi.object().optional().allow(null),
});

export const updateVendorSchema = Joi.object({
  businessName: Joi.string().trim().min(2).optional(),
  businessType: Joi.string().valid('INDIVIDUAL', 'COMPANY').optional(),
  gstNumber: Joi.string().trim().uppercase().optional().allow(null, ''),
  panNumber: Joi.string().trim().uppercase().optional().allow(null, ''),
  registrationNumber: Joi.string().trim().optional().allow(null, ''),
  businessEmail: Joi.string().email().optional(),
  businessPhone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  supportEmail: Joi.string().email().optional().allow(null, ''),
  supportPhone: Joi.string().pattern(/^[0-9]{10}$/).optional().allow(null, ''),
  businessAddress: Joi.object().optional(),
  warehouseAddresses: Joi.array().items(Joi.object()).optional(),
  bankDetails: Joi.object().optional(),
  commissionRate: Joi.number().min(0).max(100).optional(),
});

export const updateVendorStatusSchema = Joi.object({
    status: Joi.string().valid('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED').required()
});
