import Joi from 'joi';

export const createDeliverySchema = Joi.object({
  orderId: Joi.string().required().messages({
    'any.required': 'Order ID is required'
  }),
  trackingId: Joi.string().trim().required().messages({
    'any.required': 'Tracking ID is required'
  }),
  deliveryType: Joi.string().valid('HOME_DELIVERY', 'PICKUP_POINT', 'LOCKER').default('HOME_DELIVERY'),
  deliveryAddress: Joi.object().required().messages({
    'any.required': 'Delivery address is required'
  }),
  pickupAddress: Joi.object().optional().allow(null),
  scheduledDate: Joi.date().iso().optional().allow(null),
  scheduledSlot: Joi.string().optional().allow(null, ''),
  deliveryCharge: Joi.number().min(0).default(0),
  codAmount: Joi.number().min(0).default(0),
  deliveryAgentId: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED').default('PENDING'),
  maxAttempts: Joi.number().integer().min(1).max(10).default(3).optional(),
});

export const updateDeliverySchema = Joi.object({
  status: Joi.string().valid('PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED', 'CANCELLED').optional(),
  deliveryAgentId: Joi.string().optional().allow(null, ''),
  trackingId: Joi.string().trim().optional(),
  deliveryType: Joi.string().valid('HOME_DELIVERY', 'PICKUP_POINT', 'LOCKER').optional(),
  deliveryAddress: Joi.object().optional(),
  pickupAddress: Joi.object().optional().allow(null),
  pickupTime: Joi.date().iso().optional().allow(null),
  pickupOtp: Joi.string().optional().allow(null, ''),
  scheduledDate: Joi.date().iso().optional().allow(null),
  scheduledSlot: Joi.string().optional().allow(null, ''),
  deliveryTime: Joi.date().iso().optional().allow(null),
  deliveryOtp: Joi.string().optional().allow(null, ''),
  deliveryCharge: Joi.number().min(0).optional(),
  codAmount: Joi.number().min(0).optional(),
  codCollected: Joi.number().min(0).optional(),
  distance: Joi.number().min(0).optional().allow(null),
  duration: Joi.number().integer().min(0).optional().allow(null),
  attemptCount: Joi.number().integer().min(0).optional(),
  maxAttempts: Joi.number().integer().min(1).max(10).optional(),
  failureReason: Joi.string().optional().allow('', null),
  failureNotes: Joi.string().optional().allow('', null),
  receiverName: Joi.string().optional().allow('', null),
  receiverRelation: Joi.string().valid('SELF', 'FAMILY', 'NEIGHBOR', 'SECURITY').optional().allow('', null),
  deliveryProof: Joi.string().uri().optional().allow('', null),
  signature: Joi.string().uri().optional().allow('', null),
  customerRating: Joi.number().integer().min(1).max(5).optional().allow(null),
  customerFeedback: Joi.string().optional().allow('', null),
});
