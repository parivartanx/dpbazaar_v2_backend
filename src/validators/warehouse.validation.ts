import Joi from 'joi';

export const createWarehouseSchema = Joi.object({
  code: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Warehouse Code is required',
  }),
  name: Joi.string().trim().required().messages({
    'any.required': 'Warehouse Name is required',
  }),
  type: Joi.string().valid('MAIN', 'REGIONAL', 'LOCAL', 'VENDOR').required().messages({
    'any.only': 'Invalid warehouse type',
  }),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('India'),
  }).required().messages({
    'any.required': 'Address is required',
  }),
  lat: Joi.number().min(-90).max(90).optional().allow(null),
  lng: Joi.number().min(-180).max(180).optional().allow(null),
  managerId: Joi.string().optional().allow(null, ''),
  contactPhone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Contact Phone must be 10 digits',
    'any.required': 'Contact Phone is required',
  }),
  contactEmail: Joi.string().email().required().messages({
    'string.email': 'Contact Email must be a valid email',
    'any.required': 'Contact Email is required',
  }),
  totalCapacity: Joi.number().integer().min(0).optional().allow(null),
  isActive: Joi.boolean().default(true).optional(),
});

export const updateWarehouseSchema = createWarehouseSchema.fork(
  Object.keys(createWarehouseSchema.describe().keys),
  (schema) => schema.optional()
);
