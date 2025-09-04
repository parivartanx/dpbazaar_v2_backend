import Joi from 'joi';

/**
 * CREATE SEGMENT SCHEMA
 */
export const createSegmentSchema = Joi.object({
  segmentName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Segment name is required',
  }),
  segmentValue: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'Segment value is required',
  }),
});

/**
 * UPDATE SEGMENT SCHEMA
 */
export const updateSegmentSchema = Joi.object({
  segmentName: Joi.string().min(2).max(50).optional(),
  segmentValue: Joi.string().min(1).max(100).optional(),
});
