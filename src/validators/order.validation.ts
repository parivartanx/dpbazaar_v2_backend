import Joi from 'joi';

/**
 * ORDER VALIDATION SCHEMAS
 */

export const createOrderSchema = Joi.object({
  customerId: Joi.string().required(),
  vendorId: Joi.string().optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        variantId: Joi.string().optional(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    alternatePhone: Joi.string().optional(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    landmark: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    deliveryInstructions: Joi.string().optional(),
  }).required(),
  billingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    alternatePhone: Joi.string().optional(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional(),
    landmark: Joi.string().optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
  customerName: Joi.string().required(),
  customerEmail: Joi.string().email().required(),
  customerPhone: Joi.string().required(),
  customerNotes: Joi.string().optional(),
  discountCode: Joi.string().optional(),
  source: Joi.string()
    .valid('WEBSITE', 'APP', 'POS', 'PHONE')
    .optional()
    .default('WEBSITE'),
  deviceInfo: Joi.object().optional(),
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
