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
  userId: Joi.string().required(),
  employeeCode: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  middleName: Joi.string().allow(null, ''),

  // Contact
  personalEmail: Joi.string().email().allow(null, ''),
  workPhone: Joi.string().allow(null, ''),

  // Employment details
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
  profileImage: Joi.string().uri().allow(null, ''),
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
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  middleName: Joi.string().allow(null, ''),
  personalEmail: Joi.string().email().allow(null, ''),
  workPhone: Joi.string().allow(null, ''),
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
  profileImage: Joi.string().uri().allow(null, ''),
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
  action: Joi.string().valid('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'),
  description: Joi.string().allow(null, ''),
});

export const employeePermissionSchema = Joi.object({
  employeeId: Joi.string().required(),
  permissionId: Joi.string().required(),
  grantedBy: Joi.string().required(),
  grantedAt: Joi.date().default(Date.now),
  expiresAt: Joi.date().allow(null),
});
