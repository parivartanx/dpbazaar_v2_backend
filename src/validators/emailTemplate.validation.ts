import Joi from 'joi';

export const createEmailTemplateSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'Code is required',
    'string.empty': 'Code cannot be empty'
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required'
  }),
  subject: Joi.string().required().messages({
    'any.required': 'Subject is required'
  }),
  body: Joi.string().required().messages({
    'any.required': 'Body is required'
  }),
  variables: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().default(true)
});

export const updateEmailTemplateSchema = Joi.object({
  code: Joi.string().optional(),
  name: Joi.string().optional(),
  subject: Joi.string().optional(),
  body: Joi.string().optional(),
  variables: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional()
});
