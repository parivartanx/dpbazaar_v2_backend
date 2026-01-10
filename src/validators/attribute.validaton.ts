import Joi from 'joi';

const cuidRegex = /^c[^\s-]{8,}$/;

/**
 * ATTRIBUTE TYPE
 */
const createAttributeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.base': 'Attribute name must be a string',
    'string.empty': 'Attribute name is required',
    'string.min': 'Attribute name must be at least {#limit} characters',
    'string.max': 'Attribute name must be at most {#limit} characters',
    'any.required': 'Attribute name is required',
  }),
  dataType: Joi.string()
    .valid('TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'ENUM')
    .required()
    .messages({
      'any.only': 'Data type must be one of TEXT, NUMBER, BOOLEAN, DATE, ENUM',
      'any.required': 'Data type is required',
    }),
  isRequired: Joi.boolean().optional(),
  values: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Values must be an array of strings',
  }),
});

const updateAttributeSchema = createAttributeSchema.fork(
  Object.keys(createAttributeSchema.describe().keys),
  field => field.optional()
);

/**
 * PRODUCT ATTRIBUTE
 */
const addProductAttributeSchema = Joi.object({
  attributeTypeId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'AttributeType ID must be a valid CUID',
    'any.required': 'AttributeType ID is required',
  }),
  value: Joi.string().trim().required().messages({
    'string.base': 'Value must be a string',
    'string.empty': 'Value is required',
    'any.required': 'Value is required',
  }),
});

/**
 * CATEGORY ATTRIBUTE
 */
const assignCategoryAttributeSchema = Joi.object({
  attributeTypeId: Joi.string().pattern(cuidRegex).required().messages({
    'string.pattern.base': 'AttributeType ID must be a valid CUID',
    'any.required': 'AttributeType ID is required',
  }),
  isRequired: Joi.boolean().optional(),
  displayOrder: Joi.number().min(0).optional().messages({
    'number.base': 'Display order must be a number',
    'number.min': 'Display order cannot be negative',
  }),
});

export {
  createAttributeSchema,
  updateAttributeSchema,
  addProductAttributeSchema,
  assignCategoryAttributeSchema,
};
