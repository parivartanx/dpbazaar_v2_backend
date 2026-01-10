import Joi from 'joi';

/**
 * CREATE SEGMENT SCHEMA
 * Note: customerId comes from route param :customerId, not from body
 */
export const createSegmentSchema = Joi.object({
  segmentName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Segment name is required',
    'string.min': 'Segment name must be at least 2 characters',
    'string.max': 'Segment name must be at most 50 characters',
    'any.required': 'Segment name is required',
  }),
  segmentValue: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Segment value is required',
    'string.min': 'Segment value must be at least 1 character',
    'string.max': 'Segment value must be at most 100 characters',
    'any.required': 'Segment value is required',
  }),
});

/**
 * UPDATE SEGMENT SCHEMA
 */
export const updateSegmentSchema = Joi.object({
  segmentName: Joi.string().trim().min(2).max(50).optional(),
  segmentValue: Joi.string().trim().min(1).max(100).optional(),
});
