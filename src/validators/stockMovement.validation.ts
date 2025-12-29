import Joi from 'joi';

export const createStockMovementSchema = Joi.object({
  inventoryId: Joi.string().required(),
  warehouseId: Joi.string().required(),
  type: Joi.string().valid('IN', 'OUT', 'TRANSFER', 'ADJUSTMENT', 'DAMAGE', 'RETURN').required(),
  quantity: Joi.number().integer().required(), // Can be negative for OUT? Usually quantity is positive and type determines direction.
  referenceType: Joi.string().optional(),
  referenceId: Joi.string().optional(),
  fromWarehouseId: Joi.string().optional(),
  toWarehouseId: Joi.string().optional(),
  reason: Joi.string().optional(),
  notes: Joi.string().optional(),
  performedBy: Joi.string().optional(),
});
