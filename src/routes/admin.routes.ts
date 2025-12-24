import { Router } from 'express';
import multer from 'multer';
import { AdminController } from '../controllers/admin.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { authValidation } from '../validators/auth.validation';
import { AnalyticsController } from '../controllers/analytics.contoller';
import { UserController } from '../controllers/user.controller';
import { CardController } from '../controllers/card.contoller';
import {
  DepartmentController,
  EmployeePermissionController,
  PermissionController,
  EmployeeController,
} from '../controllers/employee.controller';
import { BrandController } from '../controllers/brand.controller';
import { CategoryController } from '../controllers/categoryController';
import {
  ProductController,
  // ReportController,
  VariantController,
  AttributeController,
  RelationController,
  // ReviewController,
} from '../controllers/product.controllers';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerSegmentController } from '../controllers/customerSegment.controller';
// import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validaton';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
} from '../validators/product.validation';
import {
  createBrandSchema,
  updateBrandSchema,
} from '../validators/brand.validaton';
import {
  createAttributeSchema,
  updateAttributeSchema,
  addProductAttributeSchema,
  assignCategoryAttributeSchema,
} from '../validators/attribute.validaton';
import {
  createCardSchema,
  updateCardSchema,
} from '../validators/card.validaton';
import { createRelationSchema } from '../validators/relation.validaton';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  createPermissionSchema,
  updatePermissionSchema,
  employeePermissionSchema,
} from '../validators/employee.validaton';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../validators/customer.validaton';
import {
  createSegmentSchema,
  updateSegmentSchema,
} from '../validators/cuctomerSegment.validaton';

const router = Router();
const upload = multer();

// Instantiate controllers
const adminController = new AdminController();
const analyticsController = new AnalyticsController();
const userController = new UserController();


const departmentController = new DepartmentController();
const employeeController = new EmployeeController();
const permissionController = new PermissionController();
const employeePermissionController = new EmployeePermissionController();
const brandController = new BrandController();
const categoryController = new CategoryController();
const productController = new ProductController();
const variantController = new VariantController();
const attributeController = new AttributeController();
const relationController = new RelationController();
const cardController = new CardController();
const customerCtrl = new CustomerController();
const segmentCtrl = new CustomerSegmentController();
// const reviewController = new ReviewController();
// const reportController = new ReportController();

/** Centralised Access Control Middleware */
// router.use(isAccessAllowed('ADMIN'));

/**
 * ADMIN LOGIN
 */
router.post('/login', validateRequest(authValidation.login), adminController.adminLogin);

/**
 * ADMIN DASHBOARD
 */
router.get(
  '/dashboard',
  adminController.getDashboard
);

router.get(
  '/analytics',
  analyticsController.getAnalyticsDashboard
);

/** User Management Routes */
router.get("/users/counts", userController.getUserCounts);
router.get("/users/filter", userController.filterUsers);
router.get("/users", userController.listUsers);
router.post("/users", userController.createUser);
router.get("/users/:id", userController.getUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.patch("/users/:id/restore", userController.restoreUser);
router.patch("/users/:id/lock", userController.lockUser);
router.patch("/users/:id/unlock", userController.unlockUser);
router.patch("/users/:id/reset-password", userController.resetPassword);

/**
 * Department Routes
 */
router.get('/department',departmentController.getAllDepartments);
router.get('/department/:id',departmentController.getDepartmentById);
router.post('/department',validateJoi(createDepartmentSchema),departmentController.createDepartment);
router.put('/department/:id',validateJoi(updateDepartmentSchema),departmentController.updateDepartment);
router.delete('/department/:id',departmentController.deleteDepartment);

/**
 * Employees Routes
 */
router.get('/employees',employeeController.getAllEmployees);
router.get('/employees/:id',employeeController.getEmployeeById);
router.post('/employees',validateJoi(createEmployeeSchema),employeeController.createEmployee);
router.put('/employees/:id',validateJoi(updateEmployeeSchema),employeeController.updateEmployee);
router.delete('/employees/:id',employeeController.deleteEmployee);
router.patch('/employees/:id/status',employeeController.updateEmployeeStatus);
router.patch('/employees/:id/department',employeeController.assignDepartment);

/**
 * Permissions Routes
 */
router.get('/permissions',permissionController.getAllPermissions);
router.get('/permissions/:id',permissionController.getPermissionById);
router.post('/permissions',validateJoi(createPermissionSchema),permissionController.createPermission);
router.put('/permissions/:id',validateJoi(updatePermissionSchema),permissionController.updatePermission);
router.delete('/permissions/:id',permissionController.deletePermission);

/**
 * EmployeePermission Routes
 */
router.get('/employee/permissions/:employeeId',employeePermissionController.getEmployeePermissions);
router.post('/employee/permissions',validateJoi(employeePermissionSchema),employeePermissionController.assignPermission);
router.delete('/employee/permissions/:id',employeePermissionController.revokePermission);

/**
 * BRAND MANAGEMENT (Admin Access)
 */
router.post('/brands',validateJoi(createBrandSchema),brandController.createBrand);
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id',brandController.getBrandById);
router.put('/brands/:id',validateJoi(updateBrandSchema),brandController.updateBrand);
router.delete('/brands/:id',brandController.deleteBrand);

/**
 * CATEGORY MANAGEMENT
 */
router.get('/categories',categoryController.getAllCategories);
router.get('/categories/:id',categoryController.getCategoryById);
router.post('/categories',validateJoi(createCategorySchema),categoryController.createCategory);
router.put('/categories/:id',validateJoi(updateCategorySchema),categoryController.updateCategory);
router.delete('/categories/:id',categoryController.deleteCategory);
router.patch('/categories/:id/feature',categoryController.toggleFeature);
router.patch('/categories/:id/activate',categoryController.toggleActive);

/**
 * PRODUCT MANAGEMENT
 */
router.get('/products',productController.getAllProducts);
// router.get('/products/slug/:slug', productController.getProductBySlug);
router.get('/products/:id',productController.getProductById);
router.post('/products',validateJoi(createProductSchema),productController.createProduct);
router.put('/products/:id',validateJoi(updateProductSchema),productController.updateProduct);
router.delete('/products/:id',productController.softDeleteProduct);
router.patch('/products/:id/restore',validateJoi(updateProductSchema),productController.restoreProduct);

// Images
router.post('/:productId/images',upload.single('file'),productController.addImage);
router.post('/:productId/images/bulk',upload.array('files'),productController.addImagesBulk);
router.delete('/images/:imageId',productController.deleteImage);
router.patch('/:productId/images/:imageId/primary',productController.setPrimaryImage);

/**
 * VARIANT ROUTES
 */
router.get('/:id/variants',variantController.getProductVariants);
router.post('/:id/variants',validateJoi(createVariantSchema),variantController.createVariant);
router.put('/variants/:id',validateJoi(updateVariantSchema),variantController.updateVariant);
router.delete('/variants/:id',variantController.deleteVariant);
router.patch('/variants/:id/toggle',variantController.toggleVariantActive);

/**
 * ATTRIBUTE ROUTES
 */
router.get('/attributes',attributeController.getAllAttributes);
router.post('/attributes',validateJoi(createAttributeSchema),attributeController.createAttribute);
router.put('/attributes/:id',validateJoi(updateAttributeSchema),attributeController.updateAttribute);
router.delete('/attributes/:id',attributeController.deleteAttribute);

// Product attributes
router.post('/:id/attributes',validateJoi(addProductAttributeSchema),attributeController.addToProduct);
router.delete('/attributes/:attrId',attributeController.removeFromProduct);

// Category attributes
router.post('/categories/:id/attributes',validateJoi(assignCategoryAttributeSchema),attributeController.assignToCategory);
router.delete('/categories/:id/attributes/:attrId',attributeController.removeFromCategory);

/**
 * RELATION ROUTES
 */
router.get('/:id/relations',relationController.getProductRelations);
router.post('/:id/relations',validateJoi(createRelationSchema),relationController.createRelation);
router.delete('/relations/:id',relationController.deleteRelation);

/** ----------- ADMIN ROUTES ----------- */
router.get('/admin/cards', cardController.listCards);
router.get('/admin/cards/:id',cardController.getCard);
router.post('/admin/cards',validateJoi(createCardSchema),cardController.createCard);
router.put('/admin/cards/:id',validateJoi(updateCardSchema),cardController.updateCard);
router.delete('/admin/cards/:id',cardController.deleteCard);
router.patch('/admin/cards/:id/restore',cardController.restoreCard);

/** CUSTOMER ROUTES */
// Admin
router.get('/',  customerCtrl.listCustomers);
router.get('/:id',  customerCtrl.getCustomer);
router.post('/',validateJoi(createCustomerSchema),customerCtrl.createCustomer);
router.put('/:id',validateJoi(updateCustomerSchema),customerCtrl.updateCustomer);
router.delete('/:id',  customerCtrl.deleteCustomer);
router.post('/:id/restore',customerCtrl.restoreCustomer);

/** CUSTOMER SEGMENT ROUTES */
router.get('/:customerId/segments',segmentCtrl.listByCustomer);
router.post('/:customerId/segments',validateJoi(createSegmentSchema),segmentCtrl.createSegment);
router.put('/segments/:id',validateJoi(updateSegmentSchema),segmentCtrl.updateSegment);
router.delete('/segments/:id',segmentCtrl.deleteSegment);

// /**
//  * REVIEW ROUTES
//  */
// router.get('/reviews', reviewController.getAllReviews);
// router.patch('/reviews/:id/approve', reviewController.approveReview);
// router.patch('/reviews/:id/reject', reviewController.rejectReview);
// router.delete('/reviews/:id', reviewController.deleteReview);
// router.post('/reviews/:id/reply', reviewController.replyToReview);

// /**
//  * REPORT ROUTES
//  */
// router.get('/reports/sales', reportController.getSalesReport);
// router.get('/reports/best-sellers', reportController.getBestSellers);
// router.get('/reports/category-sales', reportController.getCategorySales);
// router.get('/reports/returns', reportController.getReturnsReport);

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

/**
 * INVENTORY MANAGEMENT
 */
// router.get(
//   "/products/:id/inventory",
//   inventoryController.getProductInventory
// );
// router.post(
//   "/inventory",
//   isAccessAllowed("ADMIN"),
//   validateJoi(updateInventorySchema),
//   inventoryController.addInventory
// );
// router.patch(
//   "/inventory/:id",
//   isAccessAllowed("ADMIN"),
//   validateJoi(updateInventorySchema),
//   inventoryController.updateInventory
// );
// router.get(
//   "/products/:id/price-history",
//   inventoryController.getProductPriceHistory
// );
// router.get("/reports/low-stock", reportController.getLowStockProducts);

// // ========================
// // RELATED PRODUCTS
// // ========================
// router.get("/:productId/related", controller.listRelations.bind(controller));
// router.post("/:productId/related", isAccessAllowed("ADMIN"), controller.addRelation.bind(controller));
// router.delete("/relations/:relationId", isAccessAllowed("ADMIN"), controller.deleteRelation.bind(controller));
