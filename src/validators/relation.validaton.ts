import Joi from 'joi';

/**
 * CREATE PRODUCT RELATION
 */
const createRelationSchema = Joi.object({
  relatedProductId: Joi.string().uuid().required().messages({
    'string.guid': 'Related Product ID must be a valid UUID',
    'any.required': 'Related Product ID is required',
  }),
  relationType: Joi.string()
    .valid('SIMILAR', 'ACCESSORY', 'BUNDLE', 'FREQUENTLY_BOUGHT')
    .required()
    .messages({
      'any.only':
        'Relation type must be one of SIMILAR, ACCESSORY, BUNDLE, FREQUENTLY_BOUGHT',
      'any.required': 'Relation type is required',
    }),
  score: Joi.number().min(0).max(100).precision(2).optional().messages({
    'number.base': 'Score must be a number',
    'number.min': 'Score cannot be negative',
    'number.max': 'Score cannot exceed 100',
    'number.precision': 'Score can have at most 2 decimal places',
  }),
});

export { createRelationSchema };
