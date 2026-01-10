import Joi from 'joi';

export const createDeliveryAgentSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().trim().required().messages({
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
  agentCode: Joi.string().trim().required().messages({
    'any.required': 'Agent code is required'
  }),
  alternatePhone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional().allow(null, '').messages({
    'string.pattern.base': 'Alternate phone number must contain only digits',
  }),
  profileImage: Joi.string().uri().optional().allow(null, ''),
  vehicleType: Joi.string().valid('BIKE', 'SCOOTER', 'CAR', 'VAN').optional().allow(null, ''),
  vehicleNumber: Joi.string().optional().allow(null, ''),
  vehicleModel: Joi.string().optional().allow(null, ''),
  licenseNumber: Joi.string().optional().allow(null, ''),
  licenseExpiry: Joi.date().iso().optional().allow(null, ''),
  insuranceExpiry: Joi.date().iso().optional().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED').default('ACTIVE'),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT').default('CONTRACT'),
  zones: Joi.array().items(Joi.string()).optional().default([]),
  currentZone: Joi.string().optional().allow(null, ''),
  isAvailable: Joi.boolean().default(true),
  availableFrom: Joi.date().iso().optional().allow(null, ''),
  availableUntil: Joi.date().iso().optional().allow(null, ''),
  lastKnownLat: Joi.number().min(-90).max(90).optional().allow(null, ''),
  lastKnownLng: Joi.number().min(-180).max(180).optional().allow(null, ''),
  bankDetails: Joi.object().optional().allow(null),
  identityProof: Joi.object().optional().allow(null),
  addressProof: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});

export const updateDeliveryAgentSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
  alternatePhone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional().allow(null, ''),
  profileImage: Joi.string().uri().optional().allow(null, ''),
  vehicleType: Joi.string().valid('BIKE', 'SCOOTER', 'CAR', 'VAN').optional().allow(null, ''),
  vehicleNumber: Joi.string().optional().allow(null, ''),
  vehicleModel: Joi.string().optional().allow(null, ''),
  licenseNumber: Joi.string().optional().allow(null, ''),
  licenseExpiry: Joi.date().iso().optional().allow(null, ''),
  insuranceExpiry: Joi.date().iso().optional().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED').optional(),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT').optional(),
  zones: Joi.array().items(Joi.string()).optional(),
  currentZone: Joi.string().optional().allow(null, ''),
  isAvailable: Joi.boolean().optional(),
  availableFrom: Joi.date().iso().optional().allow(null, ''),
  availableUntil: Joi.date().iso().optional().allow(null, ''),
  lastKnownLat: Joi.number().min(-90).max(90).optional().allow(null, ''),
  lastKnownLng: Joi.number().min(-180).max(180).optional().allow(null, ''),
  bankDetails: Joi.object().optional().allow(null),
  identityProof: Joi.object().optional().allow(null),
  addressProof: Joi.object().optional().allow(null),
  metadata: Joi.object().optional().allow(null),
});
