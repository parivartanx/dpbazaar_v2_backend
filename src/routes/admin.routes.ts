import { Router } from 'express';
// import { AdminController } from '../controllers/admin.controller';
import { DepartmentController } from '../controllers/employee.controller';
import { EmployeeController } from '../controllers/employee.controller';
import { PermissionController } from '../controllers/employee.controller';
import { EmployeePermissionController } from '../controllers/employee.controller';
import { BrandController } from '../controllers/brand.controller';
import { CategoryController } from '../controllers/categoryController';
import { ProductController } from '../controllers/product.controllers';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validaton';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/product.validation';
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
const categoryController = new CategoryController();
const productController = new ProductController();

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

router.get('/permissions', permissionController.getAllPermissions);
router.get('/permissions/:id', permissionController.getPermissionById);
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
 * CATEGORY MANAGEMENT
 */
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
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
router.get('/products', productController.getAllProducts);
router.get('/products/slug/:slug', productController.getProductBySlug);
router.get('/products/:id', productController.getProductById);
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createProductSchema),
  productController.createProduct
);
router.put(
  '/products/:id',
  isAccessAllowed('ADMIN'),
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
router.get('/products/category/:id', productController.getProductsByCategory);
router.get('/products/brand/:id', productController.getProductsByBrand);
router.get('/products/featured', productController.getFeaturedProducts);
router.get('/products/new-arrivals', productController.getNewArrivals);
router.get('/products/best-sellers', productController.getBestSellers);
router.get('/products/:id/related', productController.getRelatedProducts);

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
 * ATTRIBUTE MANAGEMENT
 */

// router.get("/attributes", attributeController.getAllAttributes);
// router.get("/attributes/:id", attributeController.getAttributeById);
// router.post(
//   "/attributes",
//   isAccessAllowed("ADMIN"),
//   validateJoi(createAttributeSchema),
//   attributeController.createAttribute
// );
// router.put(
//   "/attributes/:id",
//   isAccessAllowed("ADMIN"),
//   validateJoi(updateAttributeSchema),
//   attributeController.updateAttribute
// );
// router.delete(
//   "/attributes/:id",
//   isAccessAllowed("ADMIN"),
//   attributeController.deleteAttribute
// );
// router.post(
//   "/categories/:id/attributes",
//   isAccessAllowed("ADMIN"),
//   attributeController.assignToCategory
// );
// router.delete(
//   "/categories/:id/attributes/:attrId",
//   isAccessAllowed("ADMIN"),
//   attributeController.removeFromCategory
// );

/**
 * VARIANT MANAGEMENT
 */
// router.get("/products/:id/variants", variantController.getProductVariants);
// router.post(
//   "/products/:id/variants",
//   isAccessAllowed("ADMIN"),
//   validateJoi(createVariantSchema),
//   variantController.createVariant
// );
// router.put(
//   "/variants/:id",
//   isAccessAllowed("ADMIN"),
//   validateJoi(updateVariantSchema),
//   variantController.updateVariant
// );
// router.delete(
//   "/variants/:id",
//   isAccessAllowed("ADMIN"),
//   variantController.deleteVariant
// );
// router.patch(
//   "/variants/:id/activate",
//   isAccessAllowed("ADMIN"),
//   variantController.toggleVariantActive
// );

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
 * PRODUCT RELATIONS
 */
// router.get("/products/:id/relations", relationController.getProductRelations);
// router.post(
//   "/products/:id/relations",
//   isAccessAllowed("ADMIN"),
//   validateJoi(createRelationSchema),
//   relationController.createRelation
// );
// router.delete(
//   "/relations/:id",
//   isAccessAllowed("ADMIN"),
//   relationController.deleteRelation
// );

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

/**
 * REPORTS
 */
// router.get("/reports/sales", reportController.getSalesReport);
// router.get("/reports/bestsellers", reportController.getBestSellers);
// router.get("/reports/category-sales", reportController.getCategorySales);
// router.get("/reports/returns", reportController.getReturnsReport);
