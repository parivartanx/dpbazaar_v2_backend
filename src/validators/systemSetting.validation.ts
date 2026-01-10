import Joi from 'joi';

export const createSystemSettingSchema = Joi.object({
  key: Joi.string().trim().required().messages({
    'string.empty': 'Key is required',
    'any.required': 'Key is required',
  }),
  value: Joi.any().required().messages({
    'any.required': 'Value is required',
  }),
  description: Joi.string().trim().optional().allow(null, ''),
  updatedBy: Joi.string().trim().optional().allow(null, ''),
});

export const updateSystemSettingSchema = Joi.object({
  value: Joi.any().optional(),
  description: Joi.string().trim().optional().allow(null, ''),
  updatedBy: Joi.string().trim().optional().allow(null, ''),
});
