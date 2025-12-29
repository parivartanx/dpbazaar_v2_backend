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
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
  managerId: Joi.string().optional().allow(null, ''),
  contactPhone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Contact Phone must be 10 digits',
  }),
  contactEmail: Joi.string().email().required(),
  totalCapacity: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().default(true),
});

export const updateWarehouseSchema = createWarehouseSchema.fork(
  Object.keys(createWarehouseSchema.describe().keys),
  (schema) => schema.optional()
);
