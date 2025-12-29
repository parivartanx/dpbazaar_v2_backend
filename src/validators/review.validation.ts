import Joi from 'joi';

export const replyReviewSchema = Joi.object({
  reply: Joi.string().trim().required().messages({
    'string.base': 'Reply must be a string',
    'string.empty': 'Reply is required',
    'any.required': 'Reply is required',
  }),
});
