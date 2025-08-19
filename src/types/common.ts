import { UserRole as PrismaUserRole } from '@prisma/client';
// Common API response interface

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: PrismaUserRole;
  status: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginUser {
  email: string;
  id: string;
  role: PrismaUserRole;
  status: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER',
}

// JWT related types
export interface JwtPayload {
  userId: string;
  email: string;
  role: PrismaUserRole;
  iat?: number;
  exp?: number;
}

// Authentication related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Database related types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK',
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;

  mrp?: number;
  sellingPrice?: number;
  costPrice?: number;

  taxRate?: number;
  hsnCode?: string;

  brandId?: string | null;
  vendorId?: string | null;

  status: ProductStatus;
  stockStatus?: StockStatus;

  weight?: number;
  dimensions?: Record<string, any> | null;

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isReturnable?: boolean;
  returnPeriodDays?: number;

  viewCount?: number;
  salesCount?: number;
  avgRating?: number;
  totalReviews?: number;

  tags?: string[];
  metadata?: Record<string, any> | null;
  deletedAt?: Date | null;

  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
