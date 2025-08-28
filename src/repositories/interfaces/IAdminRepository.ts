import { User, Employee, Permission } from '@prisma/client';
import { PaginatedResponse, PaginationParams } from '../../types/common';

export interface GetAllUsersParams extends PaginationParams {
  search?: string;
  role?: string;
  status?: string;
}

export interface GetAllEmployeesParams extends PaginationParams {
  search?: string;
  department?: string;
  status?: string;
}

export interface IAdminRepository {
  // USER MANAGEMENT
  getAllUsers(params: GetAllUsersParams): Promise<PaginatedResponse<User>>;
  getUserById(id: string): Promise<User | null>;
  updateUserStatus(id: string, status: string): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // EMPLOYEE MANAGEMENT
  createEmployee(data: Partial<Employee>): Promise<Employee>;
  getAllEmployees(
    params: GetAllEmployeesParams
  ): Promise<PaginatedResponse<Employee>>;
  getEmployeeById(id: string): Promise<Employee | null>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
  updateEmployeeStatus(id: string, status: string): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;

  // PERMISSIONS
  getEmployeePermissions(employeeId: string): Promise<Permission[]>;
  assignPermission(employeeId: string, permissionId: string): Promise<void>;
  revokePermission(employeeId: string, permissionId: string): Promise<void>;
}

// import { User, Employee, Permission } from '@prisma/client';
// import { PaginationParams, PaginatedResponse } from '../../types/common';

// export interface IAdminRepository {
//   // USER MANAGEMENT
//   getAllUsers(params: {
//     page: number;
//     limit: number;
//     search?: string;
//     role?: string;
//     status?: string;
//   }): Promise<PaginatedResponse<User>>;

//   getUserById(id: string): Promise<User | null>;
//   updateUserStatus(id: string, status: string): Promise<User>;
//   deleteUser(id: string): Promise<void>;

//   // EMPLOYEE MANAGEMENT
//   createEmployee(data: Partial<Employee>): Promise<Employee>;
//   getAllEmployees(params: {
//     page: number;
//     limit: number;
//     search?: string;
//     department?: string;
//     status?: string;
//   }): Promise<PaginatedResponse<Employee>>;

//   getEmployeeById(id: string): Promise<Employee | null>;
//   updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
//   updateEmployeeStatus(id: string, status: string): Promise<Employee>;
//   deleteEmployee(id: string): Promise<void>;

//   // PERMISSIONS
//   getEmployeePermissions(employeeId: string): Promise<Permission[]>;
//   assignPermission(employeeId: string, permissionId: string): Promise<void>;
//   revokePermission(employeeId: string, permissionId: string): Promise<void>;
// }

// import {
//   User,
//   Employee,
//   Product,
//   Category,
//   Brand,
//   Order,
//   Vendor,
//   Inventory,
//   Discount,
//   Notification,
//   UserStatus,
//   EmployeeStatus,
//   ProductStatus,
//   OrderStatus,
//   ProductVariant,
//   SystemSetting,
// } from '@prisma/client';

// // =====================================================
// // FILTER INTERFACES
// // =====================================================

// export interface PaginationParams {
//   page: number;
//   limit: number;
// }

// export interface UserFilters extends PaginationParams {
//   search?: string;
//   role?: string;
//   status?: string;
// }

// export interface EmployeeFilters extends PaginationParams {
//   search?: string;
//   department?: string;
//   status?: string;
// }

// export interface ProductFilters extends PaginationParams {
//   search?: string;
//   category?: string;
//   brand?: string;
//   status?: string;
// }

// export interface CategoryFilters extends PaginationParams {
//   search?: string;
//   level?: number;
// }

// export interface BrandFilters extends PaginationParams {
//   search?: string;
// }

// export interface OrderFilters extends PaginationParams {
//   search?: string;
//   status?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

// export interface VendorFilters extends PaginationParams {
//   search?: string;
//   status?: string;
// }

// export interface InventoryFilters extends PaginationParams {
//   search?: string;
//   warehouseId?: string;
//   status?: string;
// }

// export interface DiscountFilters extends PaginationParams {
//   search?: string;
//   status?: string;
// }

// export interface NotificationFilters extends PaginationParams {
//   type?: string;
// }

// export interface SalesAnalyticsFilters {
//   period?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

// // =====================================================
// // CREATE DATA INTERFACES
// // =====================================================

// export interface CreateEmployeeData {
//   userId: string;
//   employeeCode: string;
//   firstName: string;
//   lastName: string;
//   middleName?: string;
//   personalEmail?: string;
//   workPhone?: string;
//   departmentId?: string;
//   designation: string;
//   reportingTo?: string;
//   joiningDate: Date;
//   salary?: number;
// }

// export interface CreateProductData {
//   sku: string;
//   name: string;
//   slug: string;
//   description: string;
//   shortDescription?: string;
//   mrp: number;
//   sellingPrice: number;
//   costPrice?: number;
//   taxRate?: number;
//   hsnCode?: string;
//   brandId?: string;
//   vendorId?: string;
//   weight?: number;
//   dimensions?: any;
//   categoryIds: string[];
// }

// export interface CreateCategoryData {
//   name: string;
//   slug: string;
//   description?: string;
//   image?: string;
//   icon?: string;
//   parentId?: string;
//   level: number;
//   path: string;
//   displayOrder?: number;
//   metaTitle?: string;
//   metaDescription?: string;
//   metaKeywords?: string[];
//   commissionRate?: number;
// }

// export interface CreateBrandData {
//   name: string;
//   slug: string;
//   logo?: string;
//   description?: string;
//   website?: string;
// }

// export interface CreateDiscountData {
//   code: string;
//   description: string;
//   type: any;
//   value: number;
//   minOrderAmount?: number;
//   maxDiscountAmount?: number;
//   usageLimit?: number;
//   usagePerCustomer?: number;
//   validFrom: Date;
//   validUntil: Date;
//   applicableCategories?: string[];
//   applicableProducts?: string[];
//   applicableBrands?: string[];
//   customerSegments?: string[];
// }

// export interface CreateNotificationData {
//   userId: string;
//   type: any;
//   title: string;
//   message: string;
//   data?: any;
//   expiresAt?: Date;
// }

// export interface CreateStockMovementData {
//   inventoryId: string;
//   warehouseId: string;
//   type: string;
//   quantity: number;
//   referenceType?: string;
//   referenceId?: string;
//   fromWarehouseId?: string;
//   toWarehouseId?: string;
//   reason?: string;
//   notes?: string;
//   performedBy?: string;
// }

// // =====================================================
// // ADMIN REPOSITORY INTERFACE
// // =====================================================

// export interface IAdminRepository {
//   // =====================================================
//   // USER MANAGEMENT
//   // =====================================================
//   getAllUsers(
//     filters: UserFilters
//   ): Promise<{ users: User[]; total: number; totalPages: number }>;
//   getUserById(id: string): Promise<User | null>;
//   updateUserStatus(id: string, status: UserStatus): Promise<User>;
//   deleteUser(id: string): Promise<void>;

//   // =====================================================
//   // EMPLOYEE MANAGEMENT
//   // =====================================================
//   createEmployee(data: CreateEmployeeData): Promise<Employee>;
//   getAllEmployees(
//     filters: EmployeeFilters
//   ): Promise<{ employees: Employee[]; total: number; totalPages: number }>;
//   getEmployeeById(id: string): Promise<Employee | null>;
//   getEmployeeByCode(code: string): Promise<Employee | null>;
//   updateEmployee(
//     id: string,
//     data: Partial<CreateEmployeeData>
//   ): Promise<Employee>;
//   updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<Employee>;
//   deleteEmployee(id: string): Promise<void>;

//   // Employee Permissions
//   getEmployeePermissions(employeeId: string): Promise<any[]>;
//   checkEmployeePermission(
//     employeeId: string,
//     permissionId: string
//   ): Promise<any | null>;
//   assignPermission(employeeId: string, permissionId: string): Promise<any>;
//   revokePermission(employeeId: string, permissionId: string): Promise<void>;

//   // =====================================================
//   // PRODUCT MANAGEMENT
//   // =====================================================
//   createProduct(data: CreateProductData): Promise<Product>;
//   getAllProducts(
//     filters: ProductFilters
//   ): Promise<{ products: Product[]; total: number; totalPages: number }>;
//   getProductById(id: string): Promise<Product | null>;
//   getProductBySku(sku: string): Promise<Product | null>;
//   getProductBySlug(slug: string): Promise<Product | null>;
//   updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product>;
//   updateProductStatus(id: string, status: ProductStatus): Promise<Product>;
//   deleteProduct(id: string): Promise<void>;

//   // Product Variants
//   createProductVariant(productId: string, data: any): Promise<ProductVariant>;
//   getVariantById(id: string): Promise<ProductVariant | null>;
//   getVariantBySku(sku: string): Promise<ProductVariant | null>;
//   updateProductVariant(id: string, data: any): Promise<ProductVariant>;
//   deleteProductVariant(id: string): Promise<void>;

//   // =====================================================
//   // CATEGORY MANAGEMENT
//   // =====================================================
//   createCategory(data: CreateCategoryData): Promise<Category>;
//   getAllCategories(
//     filters: CategoryFilters
//   ): Promise<{ categories: Category[]; total: number; totalPages: number }>;
//   getCategoryById(id: string): Promise<Category | null>;
//   getCategoryBySlug(slug: string): Promise<Category | null>;
//   updateCategory(
//     id: string,
//     data: Partial<CreateCategoryData>
//   ): Promise<Category>;
//   deleteCategory(id: string): Promise<void>;
//   getCategoryProductsCount(categoryId: string): Promise<number>;

//   // =====================================================
//   // BRAND MANAGEMENT
//   // =====================================================
//   createBrand(data: CreateBrandData): Promise<Brand>;
//   getAllBrands(
//     filters: BrandFilters
//   ): Promise<{ brands: Brand[]; total: number; totalPages: number }>;
//   getBrandById(id: string): Promise<Brand | null>;
//   getBrandBySlug(slug: string): Promise<Brand | null>;
//   updateBrand(id: string, data: Partial<CreateBrandData>): Promise<Brand>;
//   deleteBrand(id: string): Promise<void>;
//   getBrandProductsCount(brandId: string): Promise<number>;

//   // =====================================================
//   // ORDER MANAGEMENT
//   // =====================================================
//   getAllOrders(
//     filters: OrderFilters
//   ): Promise<{ orders: Order[]; total: number; totalPages: number }>;
//   getOrderById(id: string): Promise<Order | null>;
//   updateOrderStatus(
//     id: string,
//     status: OrderStatus,
//     notes?: string
//   ): Promise<Order>;
//   addOrderNote(id: string, notes: string): Promise<Order>;

//   // =====================================================
//   // VENDOR MANAGEMENT
//   // =====================================================
//   getAllVendors(
//     filters: VendorFilters
//   ): Promise<{ vendors: Vendor[]; total: number; totalPages: number }>;
//   getVendorById(id: string): Promise<Vendor | null>;
//   updateVendorStatus(id: string, status: string): Promise<Vendor>;
//   updateVendorCommission(id: string, commissionRate: number): Promise<Vendor>;

//   // =====================================================
//   // INVENTORY MANAGEMENT
//   // =====================================================
//   getAllInventory(
//     filters: InventoryFilters
//   ): Promise<{ inventory: Inventory[]; total: number; totalPages: number }>;
//   getInventoryById(id: string): Promise<Inventory | null>;
//   getLowStockItems(
//     filters: PaginationParams
//   ): Promise<{ inventory: Inventory[]; total: number; totalPages: number }>;
//   updateInventory(id: string, data: any): Promise<Inventory>;
//   createStockMovement(data: CreateStockMovementData): Promise<any>;

//   // =====================================================
//   // DISCOUNT MANAGEMENT
//   // =====================================================
//   createDiscount(data: CreateDiscountData): Promise<Discount>;
//   getAllDiscounts(
//     filters: DiscountFilters
//   ): Promise<{ discounts: Discount[]; total: number; totalPages: number }>;
//   getDiscountById(id: string): Promise<Discount | null>;
//   getDiscountByCode(code: string): Promise<Discount | null>;
//   updateDiscount(
//     id: string,
//     data: Partial<CreateDiscountData>
//   ): Promise<Discount>;
//   deleteDiscount(id: string): Promise<void>;

//   // =====================================================
//   // ANALYTICS & REPORTS
//   // =====================================================
//   getDashboardStats(): Promise<{
//     totalUsers: number;
//     totalOrders: number;
//     totalProducts: number;
//     totalRevenue: number;
//     recentOrders: Order[];
//   }>;

//   getSalesAnalytics(filters: SalesAnalyticsFilters): Promise<{
//     totalSales: number;
//     totalOrders: number;
//     averageOrderValue: number;
//     salesData: any[];
//   }>;

//   getTopSellingProducts(
//     limit: number
//   ): Promise<{ product: Product; totalSold: number; revenue: number }[]>;

//   getTopVendors(
//     limit: number
//   ): Promise<{ vendor: Vendor; totalSales: number; revenue: number }[]>;

//   // =====================================================
//   // NOTIFICATION MANAGEMENT
//   // =====================================================
//   createNotification(data: CreateNotificationData): Promise<Notification>;
//   getAllNotifications(
//     filters: NotificationFilters
//   ): Promise<{
//     notifications: Notification[];
//     total: number;
//     totalPages: number;
//   }>;
//   getNotificationById(id: string): Promise<Notification | null>;
//   markNotificationAsRead(id: string): Promise<Notification>;
//   deleteNotification(id: string): Promise<void>;

//   // =====================================================
//   // SYSTEM SETTINGS
//   // =====================================================
//   getAllSystemSettings(): Promise<SystemSetting[]>;
//   getSystemSettingByKey(key: string): Promise<SystemSetting | null>;
//   updateSystemSetting(key: string, value: any): Promise<SystemSetting>;
// }
