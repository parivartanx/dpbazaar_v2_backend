import {
  IAdminRepository,
  GetAllUsersParams,
  GetAllEmployeesParams,
} from '../repositories/interfaces/IAdminRepository';

export class AdminService {
  private adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  // ============== USER MANAGEMENT ==============
  async getAllUsers(params: GetAllUsersParams) {
    return this.adminRepository.getAllUsers(params);
  }

  async getUserById(id: string) {
    const user = await this.adminRepository.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserStatus(id: string, status: string) {
    return this.adminRepository.updateUserStatus(id, status);
  }

  async deleteUser(id: string) {
    return this.adminRepository.deleteUser(id);
  }

  // ============== EMPLOYEE MANAGEMENT ==============
  async createEmployee(data: Record<string, any>) {
    return this.adminRepository.createEmployee(data);
  }

  async getAllEmployees(params: GetAllEmployeesParams) {
    return this.adminRepository.getAllEmployees(params);
  }

  async getEmployeeById(id: string) {
    const employee = await this.adminRepository.getEmployeeById(id);
    if (!employee) throw new Error('Employee not found');
    return employee;
  }

  async updateEmployee(id: string, data: Record<string, any>) {
    return this.adminRepository.updateEmployee(id, data);
  }

  async updateEmployeeStatus(id: string, status: string) {
    return this.adminRepository.updateEmployeeStatus(id, status);
  }

  async deleteEmployee(id: string) {
    return this.adminRepository.deleteEmployee(id);
  }

  // ============== EMPLOYEE PERMISSIONS ==============
  async getEmployeePermissions(id: string) {
    return this.adminRepository.getEmployeePermissions(id);
  }

  async assignPermission(id: string, permissionId: string) {
    return this.adminRepository.assignPermission(id, permissionId);
  }

  async revokePermission(id: string, permissionId: string) {
    return this.adminRepository.revokePermission(id, permissionId);
  }
}

// import { IAdminRepository } from '../repositories/interfaces/IAdminRepository';

// export class AdminService {
//   private adminRepository: IAdminRepository;

//   constructor(adminRepository: IAdminRepository) {
//     this.adminRepository = adminRepository;
//   }

//   // ============== USER MANAGEMENT ==============
//   async getAllUsers(params: any) {
//     return this.adminRepository.getAllUsers(params);
//   }

//   async getUserById(id: string) {
//     const user = await this.adminRepository.getUserById(id);
//     if (!user) throw new Error('User not found');
//     return user;
//   }

//   async updateUserStatus(id: string, status: string) {
//     return this.adminRepository.updateUserStatus(id, status);
//   }

//   async deleteUser(id: string) {
//     return this.adminRepository.deleteUser(id);
//   }

//   // ============== EMPLOYEE MANAGEMENT ==============
//   async createEmployee(data: any) {
//     return this.adminRepository.createEmployee(data);
//   }

//   async getAllEmployees(params: any) {
//     return this.adminRepository.getAllEmployees(params);
//   }

//   async getEmployeeById(id: string) {
//     const employee = await this.adminRepository.getEmployeeById(id);
//     if (!employee) throw new Error('Employee not found');
//     return employee;
//   }

//   async updateEmployee(id: string, data: any) {
//     return this.adminRepository.updateEmployee(id, data);
//   }

//   async updateEmployeeStatus(id: string, status: string) {
//     return this.adminRepository.updateEmployeeStatus(id, status);
//   }

//   async deleteEmployee(id: string) {
//     return this.adminRepository.deleteEmployee(id);
//   }

//   // ============== EMPLOYEE PERMISSIONS ==============
//   async getEmployeePermissions(id: string) {
//     return this.adminRepository.getEmployeePermissions(id);
//   }

//   async assignPermission(id: string, permissionId: string) {
//     return this.adminRepository.assignPermission(id, permissionId);
//   }

//   async revokePermission(id: string, permissionId: string) {
//     return this.adminRepository.revokePermission(id, permissionId);
//   }
// }

// import {
//   IAdminRepository,
//   IUserRepository,
//   IEmployeeRepository,
//   IProductRepository,
//   ICategoryRepository,
//   IBrandRepository,
//   IOrderRepository,
//   IVendorRepository,
//   IInventoryRepository,
//   IDiscountRepository,
//   INotificationRepository,
//   ISettingsRepository,
//   IPermissionRepository
// } from '../repositories/interfaces';
// import { logger } from '../utils/logger';
// import bcrypt from 'bcryptjs';
// import { config } from '../config/environment';

// // Types
// interface PaginationParams {
//   page: number;
//   limit: number;
//   search?: string;
//   [key: string]: any;
// }

// interface PaginatedResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// interface DashboardStats {
//   totalUsers: number;
//   totalOrders: number;
//   totalRevenue: number;
//   totalProducts: number;
//   recentOrders: any[];
//   topProducts: any[];
//   userGrowth: any[];
//   salesGrowth: any[];
// }

// interface AnalyticsParams {
//   period?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

// export class AdminService {
//   private adminRepository: IAdminRepository;
//   private userRepository: IUserRepository;
//   private employeeRepository: IEmployeeRepository;
//   private productRepository: IProductRepository;
//   private categoryRepository: ICategoryRepository;
//   private brandRepository: IBrandRepository;
//   private orderRepository: IOrderRepository;
//   private vendorRepository: IVendorRepository;
//   private inventoryRepository: IInventoryRepository;
//   private discountRepository: IDiscountRepository;
//   private notificationRepository: INotificationRepository;
//   private settingsRepository: ISettingsRepository;
//   private permissionRepository: IPermissionRepository;

//   constructor(
//     adminRepository: IAdminRepository,
//     userRepository?: IUserRepository,
//     employeeRepository?: IEmployeeRepository,
//     productRepository?: IProductRepository,
//     categoryRepository?: ICategoryRepository,
//     brandRepository?: IBrandRepository,
//     orderRepository?: IOrderRepository,
//     vendorRepository?: IVendorRepository,
//     inventoryRepository?: IInventoryRepository,
//     discountRepository?: IDiscountRepository,
//     notificationRepository?: INotificationRepository,
//     settingsRepository?: ISettingsRepository,
//     permissionRepository?: IPermissionRepository
//   ) {
//     this.adminRepository = adminRepository;
//     this.userRepository = userRepository!;
//     this.employeeRepository = employeeRepository!;
//     this.productRepository = productRepository!;
//     this.categoryRepository = categoryRepository!;
//     this.brandRepository = brandRepository!;
//     this.orderRepository = orderRepository!;
//     this.vendorRepository = vendorRepository!;
//     this.inventoryRepository = inventoryRepository!;
//     this.discountRepository = discountRepository!;
//     this.notificationRepository = notificationRepository!;
//     this.settingsRepository = settingsRepository!;
//     this.permissionRepository = permissionRepository!;
//   }

//   // =====================================================
//   // USER MANAGEMENT
//   // =====================================================

//   public async getAllUsers(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, role, status } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (role) {
//         filters.role = role;
//       }
//       if (status) {
//         filters.status = status;
//       }

//       const offset = (page - 1) * limit;
//       const users = await this.userRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.userRepository.count(filters);

//       return {
//         data: users.map(user => this.sanitizeUser(user)),
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching users:', error);
//       throw new Error('Failed to fetch users');
//     }
//   }

//   public async getUserById(id: string): Promise<any> {
//     try {
//       const user = await this.userRepository.findById(id);

//       if (!user) {
//         throw new Error('User not found');
//       }

//       return this.sanitizeUser(user);
//     } catch (error) {
//       logger.error('Error fetching user by id:', error);
//       throw error;
//     }
//   }

//   public async updateUserStatus(id: string, status: string): Promise<any> {
//     try {
//       const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BLOCKED'];

//       if (!validStatuses.includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const user = await this.userRepository.findById(id);
//       if (!user) {
//         throw new Error('User not found');
//       }

//       const updatedUser = await this.userRepository.update(id, { status });

//       return this.sanitizeUser(updatedUser);
//     } catch (error) {
//       logger.error('Error updating user status:', error);
//       throw error;
//     }
//   }

//   public async deleteUser(id: string): Promise<void> {
//     try {
//       const user = await this.userRepository.findById(id);
//       if (!user) {
//         throw new Error('User not found');
//       }

//       // Soft delete - update status instead of actual deletion
//       await this.userRepository.update(id, {
//         status: 'DELETED',
//         deletedAt: new Date()
//       });
//     } catch (error) {
//       logger.error('Error deleting user:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // EMPLOYEE MANAGEMENT
//   // =====================================================

//   public async createEmployee(employeeData: any): Promise<any> {
//     try {
//       // Validate required fields
//       const requiredFields = ['firstName', 'lastName', 'email', 'department', 'position'];
//       for (const field of requiredFields) {
//         if (!employeeData[field]) {
//           throw new Error(`${field} is required`);
//         }
//       }

//       // Check if employee with email already exists
//       const existingEmployee = await this.employeeRepository.findByEmail(employeeData.email);
//       if (existingEmployee) {
//         throw new Error('Employee with this email already exists');
//       }

//       // Hash password if provided
//       if (employeeData.password) {
//         const saltRounds = config.security.bcryptRounds || 10;
//         employeeData.password = await bcrypt.hash(employeeData.password, saltRounds);
//       }

//       // Create employee
//       const employee = await this.employeeRepository.create({
//         ...employeeData,
//         status: 'ACTIVE',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return this.sanitizeEmployee(employee);
//     } catch (error) {
//       logger.error('Error creating employee:', error);
//       throw error;
//     }
//   }

//   public async getAllEmployees(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, department, status } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (department) {
//         filters.department = department;
//       }
//       if (status) {
//         filters.status = status;
//       }

//       const offset = (page - 1) * limit;
//       const employees = await this.employeeRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.employeeRepository.count(filters);

//       return {
//         data: employees.map(emp => this.sanitizeEmployee(emp)),
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching employees:', error);
//       throw new Error('Failed to fetch employees');
//     }
//   }

//   public async getEmployeeById(id: string): Promise<any> {
//     try {
//       const employee = await this.employeeRepository.findById(id);

//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       return this.sanitizeEmployee(employee);
//     } catch (error) {
//       logger.error('Error fetching employee by id:', error);
//       throw error;
//     }
//   }

//   public async updateEmployee(id: string, updateData: any): Promise<any> {
//     try {
//       const employee = await this.employeeRepository.findById(id);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       // If email is being updated, check for duplicates
//       if (updateData.email && updateData.email !== employee.email) {
//         const existingEmployee = await this.employeeRepository.findByEmail(updateData.email);
//         if (existingEmployee) {
//           throw new Error('Email already in use');
//         }
//       }

//       // Hash password if being updated
//       if (updateData.password) {
//         const saltRounds = config.security.bcryptRounds || 10;
//         updateData.password = await bcrypt.hash(updateData.password, saltRounds);
//       }

//       const updatedEmployee = await this.employeeRepository.update(id, {
//         ...updateData,
//         updatedAt: new Date(),
//       });

//       return this.sanitizeEmployee(updatedEmployee);
//     } catch (error) {
//       logger.error('Error updating employee:', error);
//       throw error;
//     }
//   }

//   public async updateEmployeeStatus(id: string, status: string): Promise<any> {
//     try {
//       const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE'];

//       if (!validStatuses.includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const employee = await this.employeeRepository.findById(id);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       const updatedEmployee = await this.employeeRepository.update(id, {
//         status,
//         updatedAt: new Date()
//       });

//       return this.sanitizeEmployee(updatedEmployee);
//     } catch (error) {
//       logger.error('Error updating employee status:', error);
//       throw error;
//     }
//   }

//   public async deleteEmployee(id: string): Promise<void> {
//     try {
//       const employee = await this.employeeRepository.findById(id);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       // Soft delete
//       await this.employeeRepository.update(id, {
//         status: 'DELETED',
//         deletedAt: new Date()
//       });
//     } catch (error) {
//       logger.error('Error deleting employee:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // EMPLOYEE PERMISSIONS
//   // =====================================================

//   public async getEmployeePermissions(employeeId: string): Promise<any[]> {
//     try {
//       const employee = await this.employeeRepository.findById(employeeId);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       const permissions = await this.permissionRepository.findByEmployeeId(employeeId);
//       return permissions;
//     } catch (error) {
//       logger.error('Error fetching employee permissions:', error);
//       throw error;
//     }
//   }

//   public async assignPermission(employeeId: string, permissionId: string): Promise<any> {
//     try {
//       const employee = await this.employeeRepository.findById(employeeId);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       const permission = await this.permissionRepository.findById(permissionId);
//       if (!permission) {
//         throw new Error('Permission not found');
//       }

//       // Check if permission already assigned
//       const existingAssignment = await this.permissionRepository.findAssignment(employeeId, permissionId);
//       if (existingAssignment) {
//         throw new Error('Permission already assigned');
//       }

//       const assignment = await this.permissionRepository.assignToEmployee(employeeId, permissionId);
//       return assignment;
//     } catch (error) {
//       logger.error('Error assigning permission:', error);
//       throw error;
//     }
//   }

//   public async revokePermission(employeeId: string, permissionId: string): Promise<void> {
//     try {
//       const employee = await this.employeeRepository.findById(employeeId);
//       if (!employee) {
//         throw new Error('Employee not found');
//       }

//       await this.permissionRepository.revokeFromEmployee(employeeId, permissionId);
//     } catch (error) {
//       logger.error('Error revoking permission:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // PRODUCT MANAGEMENT
//   // =====================================================

//   public async createProduct(productData: any): Promise<any> {
//     try {
//       // Validate required fields
//       const requiredFields = ['name', 'price', 'category', 'sku'];
//       for (const field of requiredFields) {
//         if (!productData[field]) {
//           throw new Error(`${field} is required`);
//         }
//       }

//       // Check for duplicate SKU
//       const existingProduct = await this.productRepository.findBySku(productData.sku);
//       if (existingProduct) {
//         throw new Error('Product with this SKU already exists');
//       }

//       const product = await this.productRepository.create({
//         ...productData,
//         status: 'ACTIVE',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return product;
//     } catch (error) {
//       logger.error('Error creating product:', error);
//       throw error;
//     }
//   }

//   public async getAllProducts(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, category, brand, status } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (category) {
//         filters.category = category;
//       }
//       if (brand) {
//         filters.brand = brand;
//       }
//       if (status) {
//         filters.status = status;
//       }

//       const offset = (page - 1) * limit;
//       const products = await this.productRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.productRepository.count(filters);

//       return {
//         data: products,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching products:', error);
//       throw new Error('Failed to fetch products');
//     }
//   }

//   public async getProductById(id: string): Promise<any> {
//     try {
//       const product = await this.productRepository.findById(id);

//       if (!product) {
//         throw new Error('Product not found');
//       }

//       return product;
//     } catch (error) {
//       logger.error('Error fetching product by id:', error);
//       throw error;
//     }
//   }

//   public async updateProduct(id: string, updateData: any): Promise<any> {
//     try {
//       const product = await this.productRepository.findById(id);
//       if (!product) {
//         throw new Error('Product not found');
//       }

//       // Check for duplicate SKU if updating
//       if (updateData.sku && updateData.sku !== product.sku) {
//         const existingProduct = await this.productRepository.findBySku(updateData.sku);
//         if (existingProduct) {
//           throw new Error('SKU already in use');
//         }
//       }

//       const updatedProduct = await this.productRepository.update(id, {
//         ...updateData,
//         updatedAt: new Date(),
//       });

//       return updatedProduct;
//     } catch (error) {
//       logger.error('Error updating product:', error);
//       throw error;
//     }
//   }

//   public async updateProductStatus(id: string, status: string): Promise<any> {
//     try {
//       const validStatuses = ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'];

//       if (!validStatuses.includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const product = await this.productRepository.findById(id);
//       if (!product) {
//         throw new Error('Product not found');
//       }

//       const updatedProduct = await this.productRepository.update(id, {
//         status,
//         updatedAt: new Date()
//       });

//       return updatedProduct;
//     } catch (error) {
//       logger.error('Error updating product status:', error);
//       throw error;
//     }
//   }

//   public async deleteProduct(id: string): Promise<void> {
//     try {
//       const product = await this.productRepository.findById(id);
//       if (!product) {
//         throw new Error('Product not found');
//       }

//       // Soft delete
//       await this.productRepository.update(id, {
//         status: 'DELETED',
//         deletedAt: new Date()
//       });
//     } catch (error) {
//       logger.error('Error deleting product:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // PRODUCT VARIANTS
//   // =====================================================

//   public async createProductVariant(productId: string, variantData: any): Promise<any> {
//     try {
//       const product = await this.productRepository.findById(productId);
//       if (!product) {
//         throw new Error('Product not found');
//       }

//       const variant = await this.productRepository.createVariant(productId, {
//         ...variantData,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return variant;
//     } catch (error) {
//       logger.error('Error creating product variant:', error);
//       throw error;
//     }
//   }

//   public async updateProductVariant(variantId: string, updateData: any): Promise<any> {
//     try {
//       const variant = await this.productRepository.findVariantById(variantId);
//       if (!variant) {
//         throw new Error('Product variant not found');
//       }

//       const updatedVariant = await this.productRepository.updateVariant(variantId, {
//         ...updateData,
//         updatedAt: new Date(),
//       });

//       return updatedVariant;
//     } catch (error) {
//       logger.error('Error updating product variant:', error);
//       throw error;
//     }
//   }

//   public async deleteProductVariant(variantId: string): Promise<void> {
//     try {
//       const variant = await this.productRepository.findVariantById(variantId);
//       if (!variant) {
//         throw new Error('Product variant not found');
//       }

//       await this.productRepository.deleteVariant(variantId);
//     } catch (error) {
//       logger.error('Error deleting product variant:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // CATEGORY MANAGEMENT
//   // =====================================================

//   public async createCategory(categoryData: any): Promise<any> {
//     try {
//       const requiredFields = ['name', 'slug'];
//       for (const field of requiredFields) {
//         if (!categoryData[field]) {
//           throw new Error(`${field} is required`);
//         }
//       }

//       // Check for duplicate slug
//       const existingCategory = await this.categoryRepository.findBySlug(categoryData.slug);
//       if (existingCategory) {
//         throw new Error('Category with this slug already exists');
//       }

//       const category = await this.categoryRepository.create({
//         ...categoryData,
//         status: 'ACTIVE',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return category;
//     } catch (error) {
//       logger.error('Error creating category:', error);
//       throw error;
//     }
//   }

//   public async getAllCategories(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, level } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (level) {
//         filters.level = level;
//       }

//       const offset = (page - 1) * limit;
//       const categories = await this.categoryRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.categoryRepository.count(filters);

//       return {
//         data: categories,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching categories:', error);
//       throw new Error('Failed to fetch categories');
//     }
//   }

//   public async getCategoryById(id: string): Promise<any> {
//     try {
//       const category = await this.categoryRepository.findById(id);

//       if (!category) {
//         throw new Error('Category not found');
//       }

//       return category;
//     } catch (error) {
//       logger.error('Error fetching category by id:', error);
//       throw error;
//     }
//   }

//   public async updateCategory(id: string, updateData: any): Promise<any> {
//     try {
//       const category = await this.categoryRepository.findById(id);
//       if (!category) {
//         throw new Error('Category not found');
//       }

//       // Check for duplicate slug if updating
//       if (updateData.slug && updateData.slug !== category.slug) {
//         const existingCategory = await this.categoryRepository.findBySlug(updateData.slug);
//         if (existingCategory) {
//           throw new Error('Slug already in use');
//         }
//       }

//       const updatedCategory = await this.categoryRepository.update(id, {
//         ...updateData,
//         updatedAt: new Date(),
//       });

//       return updatedCategory;
//     } catch (error) {
//       logger.error('Error updating category:', error);
//       throw error;
//     }
//   }

//   public async deleteCategory(id: string): Promise<void> {
//     try {
//       const category = await this.categoryRepository.findById(id);
//       if (!category) {
//         throw new Error('Category not found');
//       }

//       // Check if category has products
//       const productCount = await this.productRepository.countByCategory(id);
//       if (productCount > 0) {
//         throw new Error('Cannot delete category with associated products');
//       }

//       await this.categoryRepository.delete(id);
//     } catch (error) {
//       logger.error('Error deleting category:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // BRAND MANAGEMENT
//   // =====================================================

//   public async createBrand(brandData: any): Promise<any> {
//     try {
//       const requiredFields = ['name', 'slug'];
//       for (const field of requiredFields) {
//         if (!brandData[field]) {
//           throw new Error(`${field} is required`);
//         }
//       }

//       // Check for duplicate slug
//       const existingBrand = await this.brandRepository.findBySlug(brandData.slug);
//       if (existingBrand) {
//         throw new Error('Brand with this slug already exists');
//       }

//       const brand = await this.brandRepository.create({
//         ...brandData,
//         status: 'ACTIVE',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return brand;
//     } catch (error) {
//       logger.error('Error creating brand:', error);
//       throw error;
//     }
//   }

//   public async getAllBrands(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }

//       const offset = (page - 1) * limit;
//       const brands = await this.brandRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.brandRepository.count(filters);

//       return {
//         data: brands,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching brands:', error);
//       throw new Error('Failed to fetch brands');
//     }
//   }

//   public async getBrandById(id: string): Promise<any> {
//     try {
//       const brand = await this.brandRepository.findById(id);

//       if (!brand) {
//         throw new Error('Brand not found');
//       }

//       return brand;
//     } catch (error) {
//       logger.error('Error fetching brand by id:', error);
//       throw error;
//     }
//   }

//   public async updateBrand(id: string, updateData: any): Promise<any> {
//     try {
//       const brand = await this.brandRepository.findById(id);
//       if (!brand) {
//         throw new Error('Brand not found');
//       }

//       // Check for duplicate slug if updating
//       if (updateData.slug && updateData.slug !== brand.slug) {
//         const existingBrand = await this.brandRepository.findBySlug(updateData.slug);
//         if (existingBrand) {
//           throw new Error('Slug already in use');
//         }
//       }

//       const updatedBrand = await this.brandRepository.update(id, {
//         ...updateData,
//         updatedAt: new Date(),
//       });

//       return updatedBrand;
//     } catch (error) {
//       logger.error('Error updating brand:', error);
//       throw error;
//     }
//   }

//   public async deleteBrand(id: string): Promise<void> {
//     try {
//       const brand = await this.brandRepository.findById(id);
//       if (!brand) {
//         throw new Error('Brand not found');
//       }

//       // Check if brand has products
//       const productCount = await this.productRepository.countByBrand(id);
//       if (productCount > 0) {
//         throw new Error('Cannot delete brand with associated products');
//       }

//       await this.brandRepository.delete(id);
//     } catch (error) {
//       logger.error('Error deleting brand:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // ORDER MANAGEMENT
//   // =====================================================

//   public async getAllOrders(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, status, dateFrom, dateTo } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (status) {
//         filters.status = status;
//       }
//       if (dateFrom) {
//         filters.dateFrom = new Date(dateFrom);
//       }
//       if (dateTo) {
//         filters.dateTo = new Date(dateTo);
//       }

//       const offset = (page - 1) * limit;
//       const orders = await this.orderRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.orderRepository.count(filters);

//       return {
//         data: orders,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching orders:', error);
//       throw new Error('Failed to fetch orders');
//     }
//   }

//   public async getOrderById(id: string): Promise<any> {
//     try {
//       const order = await this.orderRepository.findById(id);

//       if (!order) {
//         throw new Error('Order not found');
//       }

//       return order;
//     } catch (error) {
//       logger.error('Error fetching order by id:', error);
//       throw error;
//     }
//   }

//   public async updateOrderStatus(id: string, status: string, notes?: string): Promise<any> {
//     try {
//       const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

//       if (!validStatuses.includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const order = await this.orderRepository.findById(id);
//       if (!order) {
//         throw new Error('Order not found');
//       }

//       const updatedOrder = await this.orderRepository.update(id, {
//         status,
//         statusNotes: notes,
//         updatedAt: new Date()
//       });

//       // Create order history entry
//       await this.orderRepository.createHistory(id, {
//         status,
//         notes,
//         createdAt: new Date(),
//       });

//       return updatedOrder;
//     } catch (error) {
//       logger.error('Error updating order status:', error);
//       throw error;
//     }
//   }

//   public async addOrderNote(id: string, notes: string): Promise<any> {
//     try {
//       const order = await this.orderRepository.findById(id);
//       if (!order) {
//         throw new Error('Order not found');
//       }

//       const note = await this.orderRepository.createNote(id, {
//         notes,
//         createdAt: new Date(),
//       });

//       return note;
//     } catch (error) {
//       logger.error('Error adding order note:', error);
//       throw error;
//     }
//   }

//   // =====================================================
//   // VENDOR MANAGEMENT
//   // =====================================================

//   public async getAllVendors(params: PaginationParams): Promise<PaginatedResult<any>> {
//     try {
//       const { page, limit, search, status } = params;

//       const filters: any = {};
//       if (search) {
//         filters.search = search;
//       }
//       if (status) {
//         filters.status = status;
//       }

//       const offset = (page - 1) * limit;
//       const vendors = await this.vendorRepository.findAll({
//         filters,
//         limit,
//         offset,
//       });

//       const total = await this.vendorRepository.count(filters);

//       return {
//         data: vendors,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       };
//     } catch (error) {
//       logger.error('Error fetching vendors:', error);
//       throw new Error('Failed to fetch vendors');
//     }
//   }

//   public async getVendorById(id: string): Promise<any> {
//     try {
//       const vendor = await this.vendorRepository.findById(id);

//       if (!vendor) {
//         throw new Error('Vendor not found');
//       }

//       return vendor;
//     } catch (error) {
//       logger.error('Error fetching vendor by id:', error);
//       throw error;
//     }
//   }

//   public async updateVendorStatus(id: string, status: string): Promise<any> {
//     try {
//       const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'];

//       if (!validStatuses.includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const vendor = await this.vendorRepository.findById(id);
//       if (!vendor) {
//         throw new Error('Vendor not found');
//       }

//       const updatedVendor = await this.vendorRepository.update(id, {
//         status,
//         updatedAt: new Date()
//       });

//       return updatedVendor;
//     } catch (error) {
//       logger.error('Error updating vendor status:', error);
//       throw
