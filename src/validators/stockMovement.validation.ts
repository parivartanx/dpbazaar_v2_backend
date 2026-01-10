import Joi from 'joi';

export const createStockMovementSchema = Joi.object({
  inventoryId: Joi.string().trim().required().messages({
    'string.empty': 'Inventory ID is required',
    'any.required': 'Inventory ID is required',
  }),
  warehouseId: Joi.string().trim().required().messages({
    'string.empty': 'Warehouse ID is required',
    'any.required': 'Warehouse ID is required',
  }),
  type: Joi.string().valid('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'DAMAGE', 'RETURN').required().messages({
    'any.only': 'Type must be one of IN, OUT, TRANSFER, ADJUSTMENT, DAMAGE, RETURN',
    'any.required': 'Type is required',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required',
  }),
  referenceType: Joi.string().trim().optional().allow(null, ''),
  referenceId: Joi.string().trim().optional().allow(null, ''),
  fromWarehouseId: Joi.string().trim().optional().allow(null, ''),
  toWarehouseId: Joi.string().trim().optional().allow(null, ''),
  reason: Joi.string().trim().optional().allow(null, ''),
  notes: Joi.string().trim().optional().allow(null, ''),
  performedBy: Joi.string().trim().optional().allow(null, ''),
  performedAt: Joi.date().iso().optional().allow(null),
}).when('type', {
  is: 'TRANSFER',
  then: Joi.object({
    fromWarehouseId: Joi.string().trim().required(),
    toWarehouseId: Joi.string().trim().required(),
  }).or('fromWarehouseId', 'toWarehouseId'),
});
