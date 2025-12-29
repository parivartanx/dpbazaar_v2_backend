import Joi from 'joi';

export const createDeliverySchema = Joi.object({
  orderId: Joi.string().required().messages({
    'any.required': 'Order ID is required'
  }),
  trackingId: Joi.string().required().messages({
    'any.required': 'Tracking ID is required'
  }),
  deliveryType: Joi.string().default('HOME_DELIVERY'),
  deliveryAddress: Joi.object().required().messages({
    'any.required': 'Delivery address is required'
  }),
  scheduledDate: Joi.date().optional(),
  scheduledSlot: Joi.string().optional(),
  deliveryCharge: Joi.number().min(0).default(0),
  codAmount: Joi.number().min(0).default(0),
  deliveryAgentId: Joi.string().optional(),
  status: Joi.string().valid('PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED').default('PENDING')
});

export const updateDeliverySchema = Joi.object({
  status: Joi.string().valid('PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED').optional(),
  deliveryAgentId: Joi.string().optional().allow(null),
  trackingId: Joi.string().optional(),
  scheduledDate: Joi.date().optional(),
  scheduledSlot: Joi.string().optional(),
  deliveryTime: Joi.date().optional(),
  failureReason: Joi.string().optional().allow('', null),
  failureNotes: Joi.string().optional().allow('', null),
  receiverName: Joi.string().optional().allow('', null),
  receiverRelation: Joi.string().optional().allow('', null),
  deliveryProof: Joi.string().optional().allow('', null)
});
