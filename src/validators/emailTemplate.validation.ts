import Joi from 'joi';

export const createEmailTemplateSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'any.required': 'Code is required',
    'string.empty': 'Code cannot be empty'
  }),
  name: Joi.string().trim().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name cannot be empty'
  }),
  subject: Joi.string().trim().required().messages({
    'any.required': 'Subject is required',
    'string.empty': 'Subject cannot be empty'
  }),
  body: Joi.string().trim().required().messages({
    'any.required': 'Body is required',
    'string.empty': 'Body cannot be empty'
  }),
  variables: Joi.array().items(Joi.string().trim()).optional().default([]),
  isActive: Joi.boolean().default(true).optional()
});

export const updateEmailTemplateSchema = Joi.object({
  code: Joi.string().trim().optional(),
  name: Joi.string().trim().optional(),
  subject: Joi.string().trim().optional(),
  body: Joi.string().trim().optional(),
  variables: Joi.array().items(Joi.string().trim()).optional(),
  isActive: Joi.boolean().optional()
});
