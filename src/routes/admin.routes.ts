import { Router } from 'express';
// import { AdminController } from '../controllers/admin.controller';
import { DepartmentController } from '../controllers/employee.controller';
import { EmployeeController } from '../controllers/employee.controller';
import { PermissionController } from '../controllers/employee.controller';
import { EmployeePermissionController } from '../controllers/employee.controller';
import { BrandController } from '../controllers/brand.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createBrandSchema,
  updateBrandSchema,
} from '../validators/brand.validaton';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  createPermissionSchema,
  updatePermissionSchema,
  employeePermissionSchema,
} from '../validators/employee.validaton';

const router = Router();
// const adminController = new AdminController();
const departmentController = new DepartmentController();
const employeeController = new EmployeeController();
const permissionController = new PermissionController();
const employeePermissionController = new EmployeePermissionController();
const brandController = new BrandController();

/**
 * ADMIN DASHBOARD
 */
// router.post('/dashboard', adminController.dashboard);

/**
 * USER MANAGEMENT
 */
// router.get('/users', adminController.getAllUsers);
// router.get('/users/:id', adminController.getUserById);
// router.patch('/users/:id/status', adminController.updateUserStatus);
// router.delete('/users/:id', adminController.deleteUser);

/**
 * Department Routes
 */

router.get('/department', departmentController.getAllDepartments);
router.get('/department/:id', departmentController.getDepartmentById);
router.post(
  '/department',
  // isAccessAllowed('ADMIN'),
  validateJoi(createDepartmentSchema),
  departmentController.createDepartment
);
router.put(
  '/department/:id',
  // isAccessAllowed('ADMIN'),
  validateJoi(updateDepartmentSchema),
  departmentController.updateDepartment
);
router.delete(
  '/department/:id',
  // isAccessAllowed('ADMIN'),
  departmentController.deleteDepartment
);

/**
 * Employees Routes
 */

router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);
router.post(
  '/employees',
  // isAccessAllowed('ADMIN'),
  validateJoi(createEmployeeSchema),
  employeeController.createEmployee
);

// Update employee
router.put(
  '/employees/:id',
  // isAccessAllowed('ADMIN'),
  validateJoi(updateEmployeeSchema),
  employeeController.updateEmployee
);
router.delete(
  '/employees/:id',
  // isAccessAllowed('ADMIN'),
  employeeController.deleteEmployee
);
router.patch(
  '/employees/:id/status',
  // isAccessAllowed('ADMIN'),
  employeeController.updateEmployeeStatus
);
router.patch(
  '/employees/:id/department',
  // isAccessAllowed('ADMIN'),
  employeeController.assignDepartment
);

/**
 * Permissions Routes
 */

router.get('/permissions', permissionController.getAllPermissions);
router.get('/permissions/:id', permissionController.getPermissionById);
router.post(
  '/permissions',
  // isAccessAllowed('ADMIN'),
  validateJoi(createPermissionSchema),
  permissionController.createPermission
);
router.put(
  '/permissions/:id',
  // isAccessAllowed('ADMIN'),
  validateJoi(updatePermissionSchema),
  permissionController.updatePermission
);
router.delete(
  '/permissions/:id',
  // isAccessAllowed('ADMIN'),
  permissionController.deletePermission
);

/**
 * EmployeePermission Routes
 */

router.get(
  '/employee/permissions/:employeeId',
  // isAccessAllowed('ADMIN'),
  employeePermissionController.getEmployeePermissions
);
router.post(
  '/employee/permissions',
  // isAccessAllowed('ADMIN'),
  validateJoi(employeePermissionSchema),
  employeePermissionController.assignPermission
);
router.delete(
  '/employee/permissions/:id',
  // isAccessAllowed('ADMIN'),
  employeePermissionController.revokePermission
);

/**
 * BRAND MANAGEMENT (Admin Access)
 */
router.post(
  '/brands',
  isAccessAllowed('ADMIN'),
  validateJoi(createBrandSchema),
  brandController.createBrand
);
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.put(
  '/brands/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateBrandSchema),
  brandController.updateBrand
);
router.delete(
  '/brands/:id',
  isAccessAllowed('ADMIN'),
  brandController.deleteBrand
);

/**
 * PRODUCT MANAGEMENT
 */
// router.post('/products', adminController.createProduct);
// router.get('/products', adminController.getAllProducts);
// router.get('/products/:id', adminController.getProductById);
// router.put('/products/:id', adminController.updateProduct);
// router.delete('/products/:id', adminController.deleteProduct);

/**
 * CATEGORY MANAGEMENT
 */
// router.get('/categories', adminController.getAllCategories);
// router.post('/categories', adminController.createCategory);
// router.put('/categories/:id', adminController.updateCategory);
// router.delete('/categories/:id', adminController.deleteCategory);

/**
 * ORDER MANAGEMENT
 */
// router.get('/orders', adminController.getAllOrders);
// router.get('/orders/:id', adminController.getOrderById);
// router.put('/orders/:id', adminController.updateOrder);
// router.delete('/orders/:id', adminController.deleteOrder);

/**
 * PAYMNET MANAGEMENT
 */

/**
 * COUPON MANAGEMENT
 */

/**
 * REVIEW MANAGEMENT
 */

/**
 * CMS MANAGEMENT
 */

// router.get('/banners', adminController.getAllBanners);
// router.post('/banners', adminController.createBanner);
// router.delete('/banners/:id', adminController.deleteBanner);
export { router as adminRoutes };
