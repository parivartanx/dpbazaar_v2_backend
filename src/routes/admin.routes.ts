import { Router } from 'express';
import multer from 'multer';
// import { AdminController } from '../controllers/admin.controller';
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
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
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
// const adminController = new AdminController();
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
router.get(
  '/department',
  isAccessAllowed('ADMIN'),
  departmentController.getAllDepartments
);
router.get(
  '/department/:id',
  isAccessAllowed('ADMIN'),
  departmentController.getDepartmentById
);
router.post(
  '/department',
  isAccessAllowed('ADMIN'),
  validateJoi(createDepartmentSchema),
  departmentController.createDepartment
);
router.put(
  '/department/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateDepartmentSchema),
  departmentController.updateDepartment
);
router.delete(
  '/department/:id',
  isAccessAllowed('ADMIN'),
  departmentController.deleteDepartment
);

/**
 * Employees Routes
 */

router.get(
  '/employees',
  isAccessAllowed('ADMIN'),
  employeeController.getAllEmployees
);
router.get(
  '/employees/:id',
  isAccessAllowed('ADMIN'),
  employeeController.getEmployeeById
);
router.post(
  '/employees',
  isAccessAllowed('ADMIN'),
  validateJoi(createEmployeeSchema),
  employeeController.createEmployee
);

// Update employee
router.put(
  '/employees/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateEmployeeSchema),
  employeeController.updateEmployee
);
router.delete(
  '/employees/:id',
  isAccessAllowed('ADMIN'),
  employeeController.deleteEmployee
);
router.patch(
  '/employees/:id/status',
  isAccessAllowed('ADMIN'),
  employeeController.updateEmployeeStatus
);
router.patch(
  '/employees/:id/department',
  isAccessAllowed('ADMIN'),
  employeeController.assignDepartment
);

/**
 * Permissions Routes
 */

router.get(
  '/permissions',
  isAccessAllowed('ADMIN'),
  permissionController.getAllPermissions
);
router.get(
  '/permissions/:id',
  isAccessAllowed('ADMIN'),
  permissionController.getPermissionById
);
router.post(
  '/permissions',
  isAccessAllowed('ADMIN'),
  validateJoi(createPermissionSchema),
  permissionController.createPermission
);
router.put(
  '/permissions/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updatePermissionSchema),
  permissionController.updatePermission
);
router.delete(
  '/permissions/:id',
  isAccessAllowed('ADMIN'),
  permissionController.deletePermission
);

/**
 * EmployeePermission Routes
 */

router.get(
  '/employee/permissions/:employeeId',
  isAccessAllowed('ADMIN'),
  employeePermissionController.getEmployeePermissions
);
router.post(
  '/employee/permissions',
  isAccessAllowed('ADMIN'),
  validateJoi(employeePermissionSchema),
  employeePermissionController.assignPermission
);
router.delete(
  '/employee/permissions/:id',
  isAccessAllowed('ADMIN'),
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
router.get('/brands', isAccessAllowed('ADMIN'), brandController.getAllBrands);
router.get(
  '/brands/:id',
  isAccessAllowed('ADMIN'),
  brandController.getBrandById
);
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
 * CATEGORY MANAGEMENT
 */
router.get(
  '/categories',
  isAccessAllowed('ADMIN'),
  categoryController.getAllCategories
);
router.get(
  '/categories/:id',
  isAccessAllowed('ADMIN'),
  categoryController.getCategoryById
);
router.post(
  '/categories',
  isAccessAllowed('ADMIN'),
  validateJoi(createCategorySchema),
  categoryController.createCategory
);
router.put(
  '/categories/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateCategorySchema),
  categoryController.updateCategory
);
router.delete(
  '/categories/:id',
  isAccessAllowed('ADMIN'),
  categoryController.deleteCategory
);
router.patch(
  '/categories/:id/feature',
  isAccessAllowed('ADMIN'),
  categoryController.toggleFeature
);
router.patch(
  '/categories/:id/activate',
  isAccessAllowed('ADMIN'),
  categoryController.toggleActive
);

/**
 * PRODUCT MANAGEMENT
 */
router.get(
  '/products',
  isAccessAllowed('ADMIN'),
  productController.getAllProducts
);
// router.get('/products/slug/:slug', productController.getProductBySlug);
router.get(
  '/products/:id',
  isAccessAllowed('ADMIN'),
  productController.getProductById
);
router.post(
  '/products',
  isAccessAllowed('ADMIN'),
  validateJoi(createProductSchema),
  productController.createProduct
);
router.put(
  '/products/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateProductSchema),
  productController.updateProduct
);
router.delete(
  '/products/:id',
  isAccessAllowed('ADMIN'),
  productController.softDeleteProduct
);
router.patch(
  '/products/:id/restore',
  isAccessAllowed('ADMIN'),
  validateJoi(updateProductSchema),
  productController.restoreProduct
);
// router.get('/products/category/:id', productController.getProductsByCategory);
// router.get('/products/brand/:id', productController.getProductsByBrand);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/new-arrivals', productController.getNewArrivals);
// router.get('/products/best-sellers', productController.getBestSellers);
// router.get('/products/:id/related', productController.getRelatedProducts);

// Images
router.post(
  '/:productId/images',
  isAccessAllowed('ADMIN'),
  upload.single('file'),
  productController.addImage
);
router.post(
  '/:productId/images/bulk',
  isAccessAllowed('ADMIN'),
  upload.array('files'),
  productController.addImagesBulk
);
router.delete(
  '/images/:imageId',
  isAccessAllowed('ADMIN'),
  productController.deleteImage
);
router.patch(
  '/:productId/images/:imageId/primary',
  isAccessAllowed('ADMIN'),
  productController.setPrimaryImage
);

/**
 * VARIANT ROUTES
 */
router.get(
  '/:id/variants',
  isAccessAllowed('ADMIN'),
  variantController.getProductVariants
);
router.post(
  '/:id/variants',
  isAccessAllowed('ADMIN'),
  validateJoi(createVariantSchema),
  variantController.createVariant
);
router.put(
  '/variants/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateVariantSchema),
  variantController.updateVariant
);
router.delete(
  '/variants/:id',
  isAccessAllowed('ADMIN'),
  variantController.deleteVariant
);
router.patch(
  '/variants/:id/toggle',
  isAccessAllowed('ADMIN'),
  variantController.toggleVariantActive
);

/**
 * ATTRIBUTE ROUTES
 */
router.get(
  '/attributes',
  isAccessAllowed('ADMIN'),
  attributeController.getAllAttributes
);
router.post(
  '/attributes',
  isAccessAllowed('ADMIN'),
  validateJoi(createAttributeSchema),
  attributeController.createAttribute
);
router.put(
  '/attributes/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateAttributeSchema),
  attributeController.updateAttribute
);
router.delete(
  '/attributes/:id',
  isAccessAllowed('ADMIN'),
  attributeController.deleteAttribute
);

// Product attributes
router.post(
  '/:id/attributes',
  isAccessAllowed('ADMIN'),
  validateJoi(addProductAttributeSchema),
  attributeController.addToProduct
);
router.delete(
  '/attributes/:attrId',
  isAccessAllowed('ADMIN'),
  attributeController.removeFromProduct
);

// Category attributes
router.post(
  '/categories/:id/attributes',
  isAccessAllowed('ADMIN'),
  validateJoi(assignCategoryAttributeSchema),
  attributeController.assignToCategory
);
router.delete(
  '/categories/:id/attributes/:attrId',
  isAccessAllowed('ADMIN'),
  attributeController.removeFromCategory
);

/**
 * RELATION ROUTES
 */
router.get(
  '/:id/relations',
  isAccessAllowed('ADMIN'),
  relationController.getProductRelations
);
router.post(
  '/:id/relations',
  isAccessAllowed('ADMIN'),
  validateJoi(createRelationSchema),
  relationController.createRelation
);
router.delete(
  '/relations/:id',
  isAccessAllowed('ADMIN'),
  relationController.deleteRelation
);

/** ----------- ADMIN ROUTES ----------- */
router.get('/admin/cards', isAccessAllowed('ADMIN'), cardController.listCards);
router.get(
  '/admin/cards/:id',
  isAccessAllowed('ADMIN'),
  cardController.getCard
);
router.post(
  '/admin/cards',
  isAccessAllowed('ADMIN'),
  validateJoi(createCardSchema),
  cardController.createCard
);
router.put(
  '/admin/cards/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateCardSchema),
  cardController.updateCard
);
router.delete(
  '/admin/cards/:id',
  isAccessAllowed('ADMIN'),
  cardController.deleteCard
);
router.patch(
  '/admin/cards/:id/restore',
  isAccessAllowed('ADMIN'),
  cardController.restoreCard
);

/** CUSTOMER ROUTES */
// Admin
router.get('/', isAccessAllowed('ADMIN'), customerCtrl.listCustomers);
router.get('/:id', isAccessAllowed('ADMIN'), customerCtrl.getCustomer);
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createCustomerSchema),
  customerCtrl.createCustomer
); // ✅ add create route with validation
router.put(
  '/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateCustomerSchema),
  customerCtrl.updateCustomer
);
router.delete('/:id', isAccessAllowed('ADMIN'), customerCtrl.deleteCustomer);
router.post(
  '/:id/restore',
  isAccessAllowed('ADMIN'),
  customerCtrl.restoreCustomer
);

/** CUSTOMER SEGMENT ROUTES */
router.get(
  '/:customerId/segments',
  isAccessAllowed('ADMIN'),
  segmentCtrl.listByCustomer
);
router.post(
  '/:customerId/segments',
  isAccessAllowed('ADMIN'),
  validateJoi(createSegmentSchema),
  segmentCtrl.createSegment
);
router.put(
  '/segments/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateSegmentSchema),
  segmentCtrl.updateSegment
);
router.delete(
  '/segments/:id',
  isAccessAllowed('ADMIN'),
  segmentCtrl.deleteSegment
);

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

/**
 * IMAGE MANAGEMENT
 */
// router.post(
//   "/products/:id/images",
//   isAccessAllowed("ADMIN"),
//   validateJoi(createImageSchema),
//   imageController.addProductImage
// );
// router.post(
//   "/variants/:id/images",
//   isAccessAllowed("ADMIN"),
//   validateJoi(createImageSchema),
//   imageController.addVariantImage
// );
// router.put(
//   "/images/:id",
//   isAccessAllowed("ADMIN"),
//   validateJoi(updateImageSchema),
//   imageController.updateImage
// );
// router.delete(
//   "/images/:id",
//   isAccessAllowed("ADMIN"),
//   imageController.deleteImage
// );
// router.patch(
//   "/images/:id/set-primary",
//   isAccessAllowed("ADMIN"),
//   imageController.setPrimaryImage
// );

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

/**
 * REVIEWS MODERATION
 */
// router.get("/reviews", reviewController.getAllReviews);
// router.patch(
//   "/reviews/:id/approve",
//   isAccessAllowed("ADMIN"),
//   validateJoi(reviewModerationSchema),
//   reviewController.approveReview
// );
// router.patch(
//   "/reviews/:id/reject",
//   isAccessAllowed("ADMIN"),
//   validateJoi(reviewModerationSchema),
//   reviewController.rejectReview
// );
// router.delete(
//   "/reviews/:id",
//   isAccessAllowed("ADMIN"),
//   reviewController.deleteReview
// );
// router.post(
//   "/reviews/:id/reply",
//   isAccessAllowed("ADMIN"),
//   reviewController.replyToReview
// );

// // ========================
// // RELATED PRODUCTS
// // ========================
// router.get("/:productId/related", controller.listRelations.bind(controller));
// router.post("/:productId/related", isAccessAllowed("ADMIN"), controller.addRelation.bind(controller));
// router.delete("/relations/:relationId", isAccessAllowed("ADMIN"), controller.deleteRelation.bind(controller));
