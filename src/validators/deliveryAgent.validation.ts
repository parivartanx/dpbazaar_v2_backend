import Joi from 'joi';

export const createDeliveryAgentSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'any.required': 'Last name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
    'string.pattern.base': 'Phone number must contain only digits',
    'string.min': 'Phone number must be at least 10 digits',
    'string.max': 'Phone number cannot exceed 15 digits',
    'any.required': 'Phone number is required'
  }),
  agentCode: Joi.string().required().messages({
    'any.required': 'Agent code is required'
  }),
  vehicleType: Joi.string().optional().allow(null, ''),
  vehicleNumber: Joi.string().optional().allow(null, ''),
  licenseNumber: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED').default('ACTIVE'),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT').default('CONTRACT'),
  zones: Joi.array().items(Joi.string()).optional(),
  isAvailable: Joi.boolean().default(true),
  bankDetails: Joi.object().optional(),
  identityProof: Joi.object().optional(),
  addressProof: Joi.object().optional(),
});

export const updateDeliveryAgentSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
  vehicleType: Joi.string().optional().allow(null, ''),
  vehicleNumber: Joi.string().optional().allow(null, ''),
  licenseNumber: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED').optional(),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT').optional(),
  zones: Joi.array().items(Joi.string()).optional(),
  isAvailable: Joi.boolean().optional(),
  bankDetails: Joi.object().optional(),
  identityProof: Joi.object().optional(),
  addressProof: Joi.object().optional(),
});
