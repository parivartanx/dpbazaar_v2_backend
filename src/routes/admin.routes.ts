import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

// USER MANAGEMENT
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// EMPLOYEE MANAGEMENT
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getAllEmployees);
router.get('/employees/:id', adminController.getEmployeeById);
router.put('/employees/:id', adminController.updateEmployee);
router.patch('/employees/:id/status', adminController.updateEmployeeStatus);
router.delete('/employees/:id', adminController.deleteEmployee);

// EMPLOYEE PERMISSIONS
router.get(
  '/employees/:id/permissions',
  adminController.getEmployeePermissions
);
router.post('/employees/:id/permissions', adminController.assignPermission);
router.delete(
  '/employees/:id/permissions/:permissionId',
  adminController.revokePermission
);

export { router as adminRoutes };

// import { Router } from 'express';
// import { AdminController } from '../controllers/admin.controller';
// import { validateRequest } from '../middlewares/validateRequest';
// // import { adminValidation } from '../validators/admin.validation';
// // import { authenticateToken } from '../middlewares/auth';
// // import { authorize } from '../middlewares/authorize';

// const router = Router();
// const adminController = new AdminController();

// // All admin routes require authentication and admin role
// // router.use(authenticateToken);
// // router.use(authorize(['ADMIN', 'MANAGER']));

// // =====================================================
// // USER MANAGEMENT ROUTES
// // =====================================================

// router.get('/users', adminController.getAllUsers);
// router.get('/users/:id', adminController.getUserById);
// router.patch(
//   '/users/:id/status',
//   validateRequest(adminValidation.updateUserStatus),
//   adminController.updateUserStatus
// );
// router.delete('/users/:id', adminController.deleteUser);

// // =====================================================
// // EMPLOYEE MANAGEMENT ROUTES
// // =====================================================

// router.post(
//   '/employees',
//   validateRequest(adminValidation.createEmployee),
//   adminController.createEmployee
// );
// router.get('/employees', adminController.getAllEmployees);
// router.get('/employees/:id', adminController.getEmployeeById);
// router.patch(
//   '/employees/:id',
//   validateRequest(adminValidation.updateEmployee),
//   adminController.updateEmployee
// );
// router.patch(
//   '/employees/:id/status',
//   validateRequest(adminValidation.updateEmployeeStatus),
//   adminController.updateEmployeeStatus
// );
// router.delete('/employees/:id', adminController.deleteEmployee);

// // Employee permissions
// router.get(
//   '/employees/:id/permissions',
//   adminController.getEmployeePermissions
// );
// router.post(
//   '/employees/:id/permissions',
//   validateRequest(adminController.assignPermission),
//   adminController.assignPermission
// );
// router.delete(
//   '/employees/:id/permissions/:permissionId',
//   adminController.revokePermission
// );

// // =====================================================
// // PRODUCT MANAGEMENT ROUTES
// // =====================================================

// // router.post(
// //   '/products',
// //   validateRequest(adminValidation.createProduct),
// //   adminController.createProduct
// // );
// // router.get('/products', adminController.getAllProducts);
// // router.get('/products/:id', adminController.getProductById);
// // router.patch(
// //   '/products/:id',
// //   validateRequest(adminValidation.updateProduct),
// //   adminController.updateProduct
// // );
// // router.patch(
// //   '/products/:id/status',
// //   validateRequest(adminValidation.updateProductStatus),
// //   adminController.updateProductStatus
// // );
// // router.delete('/products/:id', adminController.deleteProduct);

// // // Product variants
// // router.post(
// //   '/products/:id/variants',
// //   validateRequest(adminValidation.createVariant),
// //   adminController.createProductVariant
// // );
// // router.patch(
// //   '/products/:productId/variants/:variantId',
// //   validateRequest(adminValidation.updateVariant),
// //   adminController.updateProductVariant
// // );
// // router.delete(
// //   '/products/:productId/variants/:variantId',
// //   adminController.deleteProductVariant
// // );

// // // =====================================================
// // // CATEGORY MANAGEMENT ROUTES
// // // =====================================================

// // router.post(
// //   '/categories',
// //   validateRequest(adminValidation.createCategory),
// //   adminController.createCategory
// // );
// // router.get('/categories', adminController.getAllCategories);
// // router.get('/categories/:id', adminController.getCategoryById);
// // router.patch(
// //   '/categories/:id',
// //   validateRequest(adminValidation.updateCategory),
// //   adminController.updateCategory
// // );
// // router.delete('/categories/:id', adminController.deleteCategory);

// // // =====================================================
// // // BRAND MANAGEMENT ROUTES
// // // =====================================================

// // router.post(
// //   '/brands',
// //   validateRequest(adminValidation.createBrand),
// //   adminController.createBrand
// // );
// // router.get('/brands', adminController.getAllBrands);
// // router.get('/brands/:id', adminController.getBrandById);
// // router.patch(
// //   '/brands/:id',
// //   validateRequest(adminValidation.updateBrand),
// //   adminController.updateBrand
// // );
// // router.delete('/brands/:id', adminController.deleteBrand);

// // // =====================================================
// // // ORDER MANAGEMENT ROUTES
// // // =====================================================

// // router.get('/orders', adminController.getAllOrders);
// // router.get('/orders/:id', adminController.getOrderById);
// // router.patch(
// //   '/orders/:id/status',
// //   validateRequest(adminValidation.updateOrderStatus),
// //   adminController.updateOrderStatus
// // );
// // router.post(
// //   '/orders/:id/notes',
// //   validateRequest(adminValidation.addOrderNote),
// //   adminController.addOrderNote
// // );

// // // =====================================================
// // // VENDOR MANAGEMENT ROUTES
// // // =====================================================

// // router.get('/vendors', adminController.getAllVendors);
// // router.get('/vendors/:id', adminController.getVendorById);
// // router.patch(
// //   '/vendors/:id/status',
// //   validateRequest(adminValidation.updateVendorStatus),
// //   adminController.updateVendorStatus
// // );
// // router.patch(
// //   '/vendors/:id/commission',
// //   validateRequest(adminValidation.updateVendorCommission),
// //   adminController.updateVendorCommission
// // );

// // // =====================================================
// // // INVENTORY MANAGEMENT ROUTES
// // // =====================================================

// // router.get('/inventory', adminController.getAllInventory);
// // router.get('/inventory/low-stock', adminController.getLowStockItems);
// // router.patch(
// //   '/inventory/:id',
// //   validateRequest(adminValidation.updateInventory),
// //   adminController.updateInventory
// // );
// // router.post(
// //   '/inventory/stock-movement',
// //   validateRequest(adminValidation.createStockMovement),
// //   adminController.createStockMovement
// // );

// // // =====================================================
// // // DISCOUNT MANAGEMENT ROUTES
// // // =====================================================

// // router.post(
// //   '/discounts',
// //   validateRequest(adminValidation.createDiscount),
// //   adminController.createDiscount
// // );
// // router.get('/discounts', adminController.getAllDiscounts);
// // router.get('/discounts/:id', adminController.getDiscountById);
// // router.patch(
// //   '/discounts/:id',
// //   validateRequest(adminValidation.updateDiscount),
// //   adminController.updateDiscount
// // );
// // router.delete('/discounts/:id', adminController.deleteDiscount);

// // // =====================================================
// // // ANALYTICS & REPORTS ROUTES
// // // =====================================================

// // router.get('/analytics/dashboard', adminController.getDashboardStats);
// // router.get('/analytics/sales', adminController.getSalesAnalytics);
// // router.get('/analytics/products', adminController.getProductAnalytics);
// // router.get('/analytics/customers', adminController.getCustomerAnalytics);

// // // =====================================================
// // // SYSTEM SETTINGS ROUTES
// // // =====================================================

// // router.get('/settings', adminController.getAllSettings);
// // router.patch(
// //   '/settings/:key',
// //   validateRequest(adminValidation.updateSetting),
// //   adminController.updateSetting
// // );

// // // =====================================================
// // // NOTIFICATION MANAGEMENT ROUTES
// // // =====================================================

// // router.get('/notifications', adminController.getAllNotifications);
// // router.post(
// //   '/notifications',
// //   validateRequest(adminValidation.createNotification),
// //   adminController.createNotification
// // );

// export { router as adminRoutes };
