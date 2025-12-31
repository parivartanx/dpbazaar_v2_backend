import Joi from 'joi';

export const generatePresignedUrl = Joi.object({
  fileName: Joi.string().required().messages({
    'any.required': 'File name is required',
    'string.empty': 'File name cannot be empty',
  }),
  fileType: Joi.string().required().messages({
    'any.required': 'File type is required',
    'string.empty': 'File type cannot be empty',
  }),
  folderPath: Joi.string().optional().allow('').messages({
    'string.empty': 'Folder path cannot be empty',
  }),
});

export const uploadFileValidation = Joi.object({
  folderPath: Joi.string().optional(),
});

export const fileUploadValidation = {
  generatePresignedUrl,
  uploadFile: uploadFileValidation,
};