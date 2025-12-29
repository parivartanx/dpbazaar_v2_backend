import Joi from 'joi';

export const createDeliveryEarningSchema = Joi.object({
  agentId: Joi.string().required(),
  deliveryId: Joi.string().optional(),
  type: Joi.string().required(), // DELIVERY, BONUS, PENALTY, ADJUSTMENT
  amount: Joi.number().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED').default('PENDING'),
});

export const updateDeliveryEarningSchema = Joi.object({
  amount: Joi.number().optional(),
  description: Joi.string().optional(),
  status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED').optional(),
  paidAt: Joi.date().optional(),
  paymentReference: Joi.string().optional(),
});
