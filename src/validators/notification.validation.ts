import Joi from 'joi';

export const createNotificationSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  }),
  title: Joi.string().required().messages({
    'any.required': 'Title is required'
  }),
  message: Joi.string().required().messages({
    'any.required': 'Message is required'
  }),
  type: Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'IN_APP').required(),
  isRead: Joi.boolean().default(false)
});

export const updateNotificationSchema = Joi.object({
  title: Joi.string().optional(),
  message: Joi.string().optional(),
  type: Joi.string().valid('EMAIL', 'SMS', 'PUSH', 'IN_APP').optional(),
  isRead: Joi.boolean().optional()
});
