import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

/**
 * ADMIN DASHBOARD
 */
// router.post('/dashboard', adminController.dashboard);

/**
 * USER MANAGEMENT
 */
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

/**
 * EMPLOYEE MANAGEMENT
 */
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getAllEmployees);
router.get('/employees/:id', adminController.getEmployeeById);
router.put('/employees/:id', adminController.updateEmployee);
router.patch('/employees/:id/status', adminController.updateEmployeeStatus);
router.delete('/employees/:id', adminController.deleteEmployee);

/**
 * EMPLOYEE PERMISSIONS
 */
router.get(
  '/employees/:id/permissions',
  adminController.getEmployeePermissions
);
router.post('/employees/:id/permissions', adminController.assignPermission);
router.delete(
  '/employees/:id/permissions/:permissionId',
  adminController.revokePermission
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
 * BRAND MANAGEMENT
 */

// router.post('/brands', brandController.createBrand);
// router.get('/brands', brandController.getAllBrands);
// router.get('/brands/:id', brandController.getBrandById);
// router.put('/brands/:id', brandController.updateBrand);
// router.delete('/brands/:id', brandController.deleteBrand);

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
