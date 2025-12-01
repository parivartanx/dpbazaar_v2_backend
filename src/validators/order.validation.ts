import Joi from 'joi';

/**
 * ORDER VALIDATION SCHEMAS
 */

export const createOrderSchema = Joi.object({
  customerId: Joi.string().trim().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),
  vendorId: Joi.string().trim().optional().allow(null, ''),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().trim().required().messages({
          'string.empty': 'Product ID is required',
          'any.required': 'Product ID is required',
        }),
        variantId: Joi.string().trim().optional().allow(null, ''),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number',
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Order items are required',
    }),
  shippingAddressId: Joi.string().trim().required().messages({
    'string.empty': 'Shipping address ID is required',
    'any.required': 'Shipping address ID is required',
  }),
  billingAddressId: Joi.string().trim().required().messages({
    'string.empty': 'Billing address ID is required',
    'any.required': 'Billing address ID is required',
  }),
  customerNotes: Joi.string().trim().optional().allow('', null),
  discountCode: Joi.string().trim().optional().allow('', null),
  source: Joi.string()
    .trim()
    .valid('WEBSITE', 'APP', 'POS', 'PHONE')
    .optional()
    .default('WEBSITE'),
  deviceInfo: Joi.object().optional().allow(null),
});

export const updateOrderSchema = Joi.object({
  shippingAddress: Joi.object().optional(),
  billingAddress: Joi.object().optional(),
  customerNotes: Joi.string().optional(),
  adminNotes: Joi.string().optional(),
  trackingNumber: Joi.string().optional(),
  courierPartner: Joi.string().optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'DRAFT',
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'FAILED',
      'RETURNED',
      'REFUNDED'
    )
    .required(),
});

export const cancelOrderSchema = Joi.object({
  reason: Joi.string().optional(),
});

export const orderFilterSchema = Joi.object({
  status: Joi.string()
    .valid(
      'DRAFT',
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
      'FAILED',
      'RETURNED',
      'REFUNDED'
    )
    .optional(),
  paymentStatus: Joi.string()
    .valid(
      'PENDING',
      'PROCESSING',
      'SUCCESS',
      'FAILED',
      'CANCELLED',
      'REFUNDED',
      'PARTIALLY_REFUNDED'
    )
    .optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  search: Joi.string().optional(),
  customerId: Joi.string().optional(),
  vendorId: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export const monthlyStatsSchema = Joi.object({
  months: Joi.number().integer().min(1).max(24).optional().default(6),
});

export const revenueStatsSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});
