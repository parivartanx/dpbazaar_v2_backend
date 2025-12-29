import Joi from 'joi';

export const createInvoiceSchema = Joi.object({
  orderId: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  type: Joi.string().valid('TAX_INVOICE', 'PROFORMA', 'CREDIT_NOTE').default('TAX_INVOICE'),
  subtotal: Joi.number().positive().required(),
  taxAmount: Joi.number().min(0).required(),
  totalAmount: Joi.number().positive().required(),
  taxDetails: Joi.object().required(),
  status: Joi.string().valid('DRAFT', 'ISSUED', 'PAID', 'CANCELLED').default('DRAFT'),
  dueDate: Joi.date().optional(),
});

export const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('DRAFT', 'ISSUED', 'PAID', 'CANCELLED'),
  paidAt: Joi.date().optional(),
  pdfUrl: Joi.string().uri().optional(),
  dueDate: Joi.date().optional(),
});
