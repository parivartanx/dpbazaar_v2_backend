import Joi from 'joi';

export const createDepartmentSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow(null, ''),
  parentId: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
});

export const updateDepartmentSchema = Joi.object({
  name: Joi.string().optional(),
  code: Joi.string().optional(),
  description: Joi.string().allow(null, ''),
  parentId: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

export const createEmployeeSchema = Joi.object({
  // User details (required for auto-creating user)
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Phone number must be 10–15 digits',
    }),
  middleName: Joi.string().optional().allow(null, ''),

  // Employee details
  employeeCode: Joi.string().optional(),
  departmentId: Joi.string().allow(null, ''),
  designation: Joi.string().required(),
  reportingTo: Joi.string().allow(null, ''),
  status: Joi.string()
    .valid('ACTIVE', 'INACTIVE', 'SUSPENDED')
    .default('ACTIVE'),
  employmentType: Joi.string()
    .valid('FULL_TIME', 'PART_TIME', 'CONTRACT')
    .default('FULL_TIME'),

  // Dates
  joiningDate: Joi.date().required(),
  confirmationDate: Joi.date().optional(),
  lastWorkingDate: Joi.date().optional(),

  // Compensation
  salary: Joi.number().precision(2).allow(null),
  currency: Joi.string().default('INR'),

  // Documents
  // Note: profileImage removed - use User.avatar
  documents: Joi.object().pattern(Joi.string(), Joi.string().uri()).allow(null),

  // Emergency contact
  emergencyContactName: Joi.string().allow(null, ''),
  emergencyContactPhone: Joi.string().allow(null, ''),
  emergencyContactRelation: Joi.string().allow(null, ''),

  // Address
  currentAddress: Joi.object().allow(null),
  permanentAddress: Joi.object().allow(null),

  // Metadata
  metadata: Joi.object().allow(null),
});

export const updateEmployeeSchema = Joi.object({
  // Note: firstName, lastName, middleName are now in User model
  // Note: personalEmail, workPhone removed - use User.email and User.phone
  departmentId: Joi.string().allow(null, ''),
  designation: Joi.string().optional(),
  reportingTo: Joi.string().allow(null, ''),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED'),
  employmentType: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'FREELANCE'),
  joiningDate: Joi.date().optional(),
  confirmationDate: Joi.date().optional(),
  lastWorkingDate: Joi.date().optional(),
  salary: Joi.number().precision(2).allow(null),
  currency: Joi.string().optional(),
  // Note: profileImage removed - use User.avatar
  documents: Joi.object().pattern(Joi.string(), Joi.string().uri()).allow(null),
  emergencyContactName: Joi.string().allow(null, ''),
  emergencyContactPhone: Joi.string().allow(null, ''),
  emergencyContactRelation: Joi.string().allow(null, ''),
  currentAddress: Joi.object().allow(null),
  permanentAddress: Joi.object().allow(null),
  metadata: Joi.object().allow(null),
});

export const createPermissionSchema = Joi.object({
  resource: Joi.string().required(), // e.g., "products"
  action: Joi.string()
    .valid('CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT')
    .required(),
  description: Joi.string().allow(null, ''),
});

export const updatePermissionSchema = Joi.object({
  resource: Joi.string().optional(),
  action: Joi.string().valid('CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT').optional(),
  description: Joi.string().optional().allow(null, ''),
});

export const employeePermissionSchema = Joi.object({
  employeeId: Joi.string().required(),
  permissionId: Joi.string().required(),
  grantedBy: Joi.string().required(),
  grantedAt: Joi.date().default(Date.now),
  expiresAt: Joi.date().allow(null),
});
