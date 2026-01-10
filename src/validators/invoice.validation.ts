import Joi from 'joi';

export const createInvoiceSchema = Joi.object({
  orderId: Joi.string().trim().required().messages({
    'string.empty': 'Order ID is required',
    'any.required': 'Order ID is required',
  }),
  invoiceNumber: Joi.string().trim().required().messages({
    'string.empty': 'Invoice Number is required',
    'any.required': 'Invoice Number is required',
  }),
  type: Joi.string().valid('TAX_INVOICE', 'PROFORMA', 'CREDIT_NOTE').default('TAX_INVOICE').optional(),
  subtotal: Joi.number().min(0).required().messages({
    'number.base': 'Subtotal must be a number',
    'number.min': 'Subtotal cannot be negative',
    'any.required': 'Subtotal is required',
  }),
  taxAmount: Joi.number().min(0).required().messages({
    'number.base': 'Tax Amount must be a number',
    'number.min': 'Tax Amount cannot be negative',
    'any.required': 'Tax Amount is required',
  }),
  totalAmount: Joi.number().min(0).required().messages({
    'number.base': 'Total Amount must be a number',
    'number.min': 'Total Amount cannot be negative',
    'any.required': 'Total Amount is required',
  }),
  taxDetails: Joi.object().required().messages({
    'object.base': 'Tax Details must be an object',
    'any.required': 'Tax Details is required',
  }),
  status: Joi.string().valid('DRAFT', 'ISSUED', 'PAID', 'CANCELLED').default('DRAFT').optional(),
  issuedAt: Joi.date().iso().optional().allow(null),
  dueDate: Joi.date().iso().optional().allow(null),
  paidAt: Joi.date().iso().optional().allow(null),
  pdfUrl: Joi.string().uri().optional().allow(null, ''),
});

export const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'ISSUED', 'PAID', 'CANCELLED').optional(),
  issuedAt: Joi.date().iso().optional().allow(null),
  paidAt: Joi.date().iso().optional().allow(null),
  pdfUrl: Joi.string().uri().optional().allow(null, ''),
  dueDate: Joi.date().iso().optional().allow(null),
  subtotal: Joi.number().min(0).optional(),
  taxAmount: Joi.number().min(0).optional(),
  totalAmount: Joi.number().min(0).optional(),
  taxDetails: Joi.object().optional(),
  type: Joi.string().valid('TAX_INVOICE', 'PROFORMA', 'CREDIT_NOTE').optional(),
});
