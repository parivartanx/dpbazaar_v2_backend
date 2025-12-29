import Joi from 'joi';

export const createInventorySchema = Joi.object({
  productId: Joi.string().optional(),
  variantId: Joi.string().optional(),
  warehouseId: Joi.string().required().messages({
    'any.required': 'Warehouse ID is required',
  }),
  availableQuantity: Joi.number().integer().min(0).default(0),
  reservedQuantity: Joi.number().integer().min(0).default(0),
  damagedQuantity: Joi.number().integer().min(0).default(0),
  minStockLevel: Joi.number().integer().min(0).default(10),
  maxStockLevel: Joi.number().integer().min(0).default(1000),
  reorderPoint: Joi.number().integer().min(0).default(20),
  reorderQuantity: Joi.number().integer().min(0).default(100),
  rack: Joi.string().optional().allow('', null),
  shelf: Joi.string().optional().allow('', null),
  bin: Joi.string().optional().allow('', null),
}).or('productId', 'variantId').messages({
  'object.missing': 'Either Product ID or Variant ID must be provided'
});

export const updateInventorySchema = Joi.object({
  availableQuantity: Joi.number().integer().min(0),
  reservedQuantity: Joi.number().integer().min(0),
  damagedQuantity: Joi.number().integer().min(0),
  minStockLevel: Joi.number().integer().min(0),
  maxStockLevel: Joi.number().integer().min(0),
  reorderPoint: Joi.number().integer().min(0),
  reorderQuantity: Joi.number().integer().min(0),
  rack: Joi.string().optional().allow('', null),
  shelf: Joi.string().optional().allow('', null),
  bin: Joi.string().optional().allow('', null),
});
