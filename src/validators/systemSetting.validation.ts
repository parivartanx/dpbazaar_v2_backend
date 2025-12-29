import Joi from 'joi';

export const createSystemSettingSchema = Joi.object({
  key: Joi.string().required(),
  value: Joi.any().required(),
  description: Joi.string().optional(),
});

export const updateSystemSettingSchema = Joi.object({
  value: Joi.any().required(),
  description: Joi.string().optional(),
  updatedBy: Joi.string().optional(),
});
