// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Authentication Types
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Database Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// File Upload Types
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
} 