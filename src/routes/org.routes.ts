import { Router } from 'express';
import multer from 'multer';
import { AdminController } from '../controllers/admin.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { authValidation } from '../validators/auth.validation';
import { AnalyticsController } from '../controllers/analytics.contoller';
import { UserController } from '../controllers/user.controller';
import { CardController } from '../controllers/card.contoller';
import { SubscriptionCardController } from '../controllers/subscriptionCard.controller';
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
  VariantController,
  AttributeController,
  RelationController,
} from '../controllers/product.controllers';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerSegmentController } from '../controllers/customerSegment.controller';
import { WalletController } from '../controllers/wallet.controller';
import { WalletTransactionController } from '../controllers/walletTransaction.controller';
import { OrderController } from '../controllers/order.controller';
import { validateJoi } from '../middlewares/validateJoi';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { checkPermission } from '../middlewares/checkPermission';
import { PermissionAction } from '@prisma/client';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.validaton';
import {
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
import {
  createSubscriptionCardSchema,
  updateSubscriptionCardSchema,
} from '../validators/subscriptionCard.validation';
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
import { UserSubscriptionCardController } from '../controllers/userSubscriptionCard.controller';
import { createUserSubscriptionCardSchema, updateUserSubscriptionCardSchema } from '../validators/userSubscriptionCard.validation';
import {
  createWalletSchema,
  updateWalletSchema,
} from '../validators/wallet.validation';
import {
  createWalletTransactionSchema,
  updateWalletTransactionSchema,
} from '../validators/walletTransaction.validation';
import { updateReturnStatusSchema, createOrderSchema, updateOrderSchema, updateOrderStatusSchema, cancelOrderSchema } from '../validators/order.validation';
import { DiscountController } from '../controllers/discount.controller';
import { ProductReviewController } from '../controllers/productReview.controller';
import { createDiscountSchema, updateDiscountSchema } from '../validators/discount.validation';
import { replyReviewSchema } from '../validators/review.validation';
import { VendorController } from '../controllers/vendor.controller';
import { createVendorSchema, updateVendorSchema, updateVendorStatusSchema } from '../validators/vendor.validation';
import { WarehouseController } from '../controllers/warehouse.controller';
import { createWarehouseSchema, updateWarehouseSchema } from '../validators/warehouse.validation';
import { InventoryController } from '../controllers/inventory.controller';
import { createInventorySchema, updateInventorySchema } from '../validators/inventory.validation';
import { DeliveryAgentController } from '../controllers/deliveryAgent.controller';
import { createDeliveryAgentSchema, updateDeliveryAgentSchema } from '../validators/deliveryAgent.validation';
import { DeliveryController } from '../controllers/delivery.controller';
import { createDeliverySchema, updateDeliverySchema } from '../validators/delivery.validation';

import { ReferralCodeController } from '../controllers/referralCode.controller';
import { ReferralHistoryController } from '../controllers/referralHistory.controller';
import { createReferralCodeSchema, updateReferralCodeSchema } from '../validators/referralCode.validation';
import { createReferralHistorySchema, updateReferralHistorySchema } from '../validators/referralHistory.validation';

import { NotificationController } from '../controllers/notification.controller';
import { createNotificationSchema, updateNotificationSchema } from '../validators/notification.validation';

import { EmailTemplateController } from '../controllers/emailTemplate.controller';
import { createEmailTemplateSchema, updateEmailTemplateSchema } from '../validators/emailTemplate.validation';

import { PaymentController } from '../controllers/payment.controller';
import { VendorPayoutController } from '../controllers/vendorPayout.controller';
import { createVendorPayoutSchema, updateVendorPayoutSchema, updateVendorPayoutStatusSchema } from '../validators/vendorPayout.validation';

import { SystemSettingController } from '../controllers/systemSetting.controller';
import { createSystemSettingSchema, updateSystemSettingSchema } from '../validators/systemSetting.validation';

import { AuditLogController } from '../controllers/auditLog.controller';

import { InvoiceController } from '../controllers/invoice.controller';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoice.validation';

import { DeliveryEarningController } from '../controllers/deliveryEarning.controller';
import { createDeliveryEarningSchema, updateDeliveryEarningSchema } from '../validators/deliveryEarning.validation';

import { PriceHistoryController } from '../controllers/priceHistory.controller';

import { StockMovementController } from '../controllers/stockMovement.controller';
import { createStockMovementSchema } from '../validators/stockMovement.validation';

import { RefundController } from '../controllers/refund.controller';
import { createRefundSchema, updateRefundSchema } from '../validators/refund.validation';

import { ReturnController } from '../controllers/return.controller';
import { createReturnSchema, updateReturnSchema } from '../validators/return.validation';

import { JobExecutionController } from '../controllers/jobExecution.controller';
import { EmployeeActivityController } from '../controllers/employeeActivity.controller';

import { AddressController } from '../controllers/address.controller';
import { createAddressSchema, updateAddressSchema } from '../validators/address.validation';
import { SessionController } from '../controllers/session.controller';
import { BannerController } from '../controllers/banner.controller';
import {
  createBannerValidation,
  updateBannerValidation,
} from '../validators/banner.validation';

const router = Router();
const upload = multer();

// Instantiate controllers
const adminController = new AdminController();
const analyticsController = new AnalyticsController();
const userController = new UserController();
const discountController = new DiscountController();
const productReviewController = new ProductReviewController();
const vendorController = new VendorController();
const warehouseController = new WarehouseController();
const inventoryController = new InventoryController();
const deliveryAgentController = new DeliveryAgentController();
const deliveryController = new DeliveryController();
const referralCodeController = new ReferralCodeController();
const referralHistoryController = new ReferralHistoryController();
const notificationController = new NotificationController();
const emailTemplateController = new EmailTemplateController();
const paymentController = new PaymentController();
const vendorPayoutController = new VendorPayoutController();
const systemSettingController = new SystemSettingController();
const auditLogController = new AuditLogController();
const invoiceController = new InvoiceController();
const deliveryEarningController = new DeliveryEarningController();
const priceHistoryController = new PriceHistoryController();
const stockMovementController = new StockMovementController();
const refundController = new RefundController();
const returnController = new ReturnController();
const jobExecutionController = new JobExecutionController();
const employeeActivityController = new EmployeeActivityController();

const addressController = new AddressController();
const sessionController = new SessionController();
const bannerController = new BannerController();

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
const subscriptionCardController = new SubscriptionCardController();
const userSubscriptionCardController = new UserSubscriptionCardController();
const customerCtrl = new CustomerController();
const segmentCtrl = new CustomerSegmentController();
const walletController = new WalletController();
const walletTransactionController = new WalletTransactionController();
const orderController = new OrderController();

/**
 * ADMIN LOGIN (Public)
 */
router.post('/login', validateRequest(authValidation.login), adminController.adminLogin);

/** Centralised Access Control Middleware */
// Allow all internal roles to access org routes, subject to permission checks
router.use(isAccessAllowed('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE'));

/**
 * ADMIN DASHBOARD
 */
router.get(
  '/dashboard',
  checkPermission('dashboard', PermissionAction.READ),
  adminController.getDashboard
);

router.get(
  '/analytics',
  checkPermission('analytics', PermissionAction.READ),
  analyticsController.getAnalyticsDashboard
);

/** User Management Routes */
router.get("/users/counts", checkPermission('users', PermissionAction.READ), userController.getUserCounts);
router.get("/users/filter", checkPermission('users', PermissionAction.READ), userController.filterUsers);
router.get("/users", checkPermission('users', PermissionAction.READ), userController.listUsers);
router.post("/users", checkPermission('users', PermissionAction.CREATE), userController.createUser);
router.get("/users/:id", checkPermission('users', PermissionAction.READ), userController.getUser);
router.put("/users/:id", checkPermission('users', PermissionAction.UPDATE), userController.updateUser);
router.delete("/users/:id", checkPermission('users', PermissionAction.DELETE), userController.deleteUser);
router.patch("/users/:id/restore", checkPermission('users', PermissionAction.UPDATE), userController.restoreUser);
router.patch("/users/:id/lock", checkPermission('users', PermissionAction.UPDATE), userController.lockUser);
router.patch("/users/:id/unlock", checkPermission('users', PermissionAction.UPDATE), userController.unlockUser);
router.patch("/users/:id/reset-password", checkPermission('users', PermissionAction.UPDATE), userController.resetPassword);

/**
 * Department Routes
 */
router.get('/department', checkPermission('departments', PermissionAction.READ), departmentController.getAllDepartments);
router.get('/department/:id', checkPermission('departments', PermissionAction.READ), departmentController.getDepartmentById);
router.post('/department', checkPermission('departments', PermissionAction.CREATE), validateJoi(createDepartmentSchema), departmentController.createDepartment);
router.put('/department/:id', checkPermission('departments', PermissionAction.UPDATE), validateJoi(updateDepartmentSchema), departmentController.updateDepartment);
router.delete('/department/:id', checkPermission('departments', PermissionAction.DELETE), departmentController.deleteDepartment);

/**
 * Employees Routes
 */
router.get('/employees', checkPermission('employees', PermissionAction.READ), employeeController.getAllEmployees);
router.get('/employees/:id', checkPermission('employees', PermissionAction.READ), employeeController.getEmployeeById);
router.post('/employees', checkPermission('employees', PermissionAction.CREATE), validateJoi(createEmployeeSchema), employeeController.createEmployee);
router.put('/employees/:id', checkPermission('employees', PermissionAction.UPDATE), validateJoi(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/employees/:id', checkPermission('employees', PermissionAction.DELETE), employeeController.deleteEmployee);
router.patch('/employees/:id/status', checkPermission('employees', PermissionAction.UPDATE), employeeController.updateEmployeeStatus);
router.patch('/employees/:id/department', checkPermission('employees', PermissionAction.UPDATE), employeeController.assignDepartment);

/**
 * Permissions Routes
 */
router.get('/permissions', checkPermission('permissions', PermissionAction.READ), permissionController.getAllPermissions);
router.get('/permissions/:id', checkPermission('permissions', PermissionAction.READ), permissionController.getPermissionById);
router.post('/permissions', checkPermission('permissions', PermissionAction.CREATE), validateJoi(createPermissionSchema), permissionController.createPermission);
router.put('/permissions/:id', checkPermission('permissions', PermissionAction.UPDATE), validateJoi(updatePermissionSchema), permissionController.updatePermission);
router.delete('/permissions/:id', checkPermission('permissions', PermissionAction.DELETE), permissionController.deletePermission);

/**
 * EmployeePermission Routes
 */
router.get('/employee/permissions/:employeeId', checkPermission('employee_permissions', PermissionAction.READ), employeePermissionController.getEmployeePermissions);
router.post('/employee/permissions', checkPermission('employee_permissions', PermissionAction.CREATE), validateJoi(employeePermissionSchema), employeePermissionController.assignPermission);
router.delete('/employee/permissions/:id', checkPermission('employee_permissions', PermissionAction.DELETE), employeePermissionController.revokePermission);

/**
 * BRAND MANAGEMENT
 */
router.post('/brands', checkPermission('brands', PermissionAction.CREATE), validateJoi(createBrandSchema), brandController.createBrand);
router.get('/brands', checkPermission('brands', PermissionAction.READ), brandController.getAllBrands);
router.get('/brands/:id', checkPermission('brands', PermissionAction.READ), brandController.getBrandById);
router.put('/brands/:id', checkPermission('brands', PermissionAction.UPDATE), validateJoi(updateBrandSchema), brandController.updateBrand);
router.delete('/brands/:id', checkPermission('brands', PermissionAction.DELETE), brandController.deleteBrand);

/**
 * CATEGORY MANAGEMENT
 */
router.get('/categories', checkPermission('categories', PermissionAction.READ), categoryController.getAllCategories);
router.get('/categories/:id', checkPermission('categories', PermissionAction.READ), categoryController.getCategoryById);
router.post('/categories', checkPermission('categories', PermissionAction.CREATE), validateJoi(createCategorySchema), categoryController.createCategory);
router.put('/categories/:id', checkPermission('categories', PermissionAction.UPDATE), validateJoi(updateCategorySchema), categoryController.updateCategory);
router.delete('/categories/:id', checkPermission('categories', PermissionAction.DELETE), categoryController.deleteCategory);
router.patch('/categories/:id/feature', checkPermission('categories', PermissionAction.UPDATE), categoryController.toggleFeature);
router.patch('/categories/:id/activate', checkPermission('categories', PermissionAction.UPDATE), categoryController.toggleActive);

/**
 * PRODUCT MANAGEMENT
 */
router.get('/products', checkPermission('products', PermissionAction.READ), productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', checkPermission('products', PermissionAction.CREATE), productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', checkPermission('products', PermissionAction.DELETE), productController.softDeleteProduct);
router.patch('/products/:id/restore', checkPermission('products', PermissionAction.UPDATE), productController.restoreProduct);

// Images
router.post('/:productId/images', upload.single('file'), productController.addImage);
router.post('/:productId/images/bulk', checkPermission('products', PermissionAction.UPDATE), upload.array('files'), productController.addImagesBulk);
router.delete('/images/:imageId', checkPermission('products', PermissionAction.UPDATE), productController.deleteImage);
router.patch('/:productId/images/:imageId/primary', checkPermission('products', PermissionAction.UPDATE), productController.setPrimaryImage);

/**
 * VARIANT ROUTES
 */
router.get('/:id/variants', checkPermission('variants', PermissionAction.READ), variantController.getProductVariants);
router.post('/:id/variants', checkPermission('variants', PermissionAction.CREATE), validateJoi(createVariantSchema), variantController.createVariant);
router.put('/variants/:id', checkPermission('variants', PermissionAction.UPDATE), validateJoi(updateVariantSchema), variantController.updateVariant);
router.delete('/variants/:id', checkPermission('variants', PermissionAction.DELETE), variantController.deleteVariant);
router.patch('/variants/:id/toggle', checkPermission('variants', PermissionAction.UPDATE), variantController.toggleVariantActive);

/**
 * ATTRIBUTE ROUTES
 */
router.get('/attributes', checkPermission('attributes', PermissionAction.READ), attributeController.getAllAttributes);
router.post('/attributes', checkPermission('attributes', PermissionAction.CREATE), validateJoi(createAttributeSchema), attributeController.createAttribute);
router.put('/attributes/:id', checkPermission('attributes', PermissionAction.UPDATE), validateJoi(updateAttributeSchema), attributeController.updateAttribute);
router.delete('/attributes/:id', checkPermission('attributes', PermissionAction.DELETE), attributeController.deleteAttribute);

// Product attributes
router.post('/:id/attributes', checkPermission('attributes', PermissionAction.CREATE), validateJoi(addProductAttributeSchema), attributeController.addToProduct);
router.delete('/attributes/:attrId', checkPermission('attributes', PermissionAction.DELETE), attributeController.removeFromProduct);

// Category attributes
router.post('/categories/:id/attributes', checkPermission('attributes', PermissionAction.CREATE), validateJoi(assignCategoryAttributeSchema), attributeController.assignToCategory);
router.delete('/categories/:id/attributes/:attrId', checkPermission('attributes', PermissionAction.DELETE), attributeController.removeFromCategory);

/**
 * RELATION ROUTES
 */
router.get('/:id/relations', checkPermission('relations', PermissionAction.READ), relationController.getProductRelations);
router.post('/:id/relations', checkPermission('relations', PermissionAction.CREATE), validateJoi(createRelationSchema), relationController.createRelation);
router.delete('/relations/:id', checkPermission('relations', PermissionAction.DELETE), relationController.deleteRelation);

/** ----------- CARD ROUTES ----------- */
router.get('/cards', checkPermission('cards', PermissionAction.READ), cardController.listCards);
router.get('/cards/:id', checkPermission('cards', PermissionAction.READ), cardController.getCard);
router.post('/cards', checkPermission('cards', PermissionAction.CREATE), validateJoi(createCardSchema), cardController.createCard);
router.put('/cards/:id', checkPermission('cards', PermissionAction.UPDATE), validateJoi(updateCardSchema), cardController.updateCard);
router.delete('/cards/:id', checkPermission('cards', PermissionAction.DELETE), cardController.deleteCard);
router.patch('/cards/:id/restore', checkPermission('cards', PermissionAction.UPDATE), cardController.restoreCard);

/** SUBSCRIPTION CARD MANAGEMENT */
router.get('/subscription-cards', checkPermission('subscription_cards', PermissionAction.READ), subscriptionCardController.listCards);
router.get('/subscription-cards/:id', checkPermission('subscription_cards', PermissionAction.READ), subscriptionCardController.getCard);
router.post('/subscription-cards', checkPermission('subscription_cards', PermissionAction.CREATE), validateJoi(createSubscriptionCardSchema), subscriptionCardController.createCard);
router.put('/subscription-cards/:id', checkPermission('subscription_cards', PermissionAction.UPDATE), validateJoi(updateSubscriptionCardSchema), subscriptionCardController.updateCard);
router.delete('/subscription-cards/:id', checkPermission('subscription_cards', PermissionAction.DELETE), subscriptionCardController.deleteCard);
router.patch('/subscription-cards/:id/restore', checkPermission('subscription_cards', PermissionAction.UPDATE), subscriptionCardController.restoreCard);

/* USER SUBSCRIPTION CARD MANAGEMENT ROUTES */
router.get('/user-subscription-cards', checkPermission('user_subscription_cards', PermissionAction.READ), userSubscriptionCardController.listUserCards);
router.get('/user-subscription-cards/:id', checkPermission('user_subscription_cards', PermissionAction.READ), userSubscriptionCardController.getUserCard);
router.post('/user-subscription-cards', checkPermission('user_subscription_cards', PermissionAction.CREATE), validateJoi(createUserSubscriptionCardSchema), userSubscriptionCardController.createUserCard);
router.put('/user-subscription-cards/:id', checkPermission('user_subscription_cards', PermissionAction.UPDATE), validateJoi(updateUserSubscriptionCardSchema), userSubscriptionCardController.updateUserCard);
router.delete('/user-subscription-cards/:id', checkPermission('user_subscription_cards', PermissionAction.DELETE), userSubscriptionCardController.deleteUserCard);


/** CUSTOMER ROUTES */
router.get('/customers', checkPermission('customers', PermissionAction.READ), customerCtrl.listCustomers);
router.get('/customers/:id', checkPermission('customers', PermissionAction.READ), customerCtrl.getCustomer);
router.post('/customers', checkPermission('customers', PermissionAction.CREATE), validateJoi(createCustomerSchema), customerCtrl.createCustomer);
router.put('/customers/:id', checkPermission('customers', PermissionAction.UPDATE), validateJoi(updateCustomerSchema), customerCtrl.updateCustomer);
router.delete('/customers/:id', checkPermission('customers', PermissionAction.DELETE), customerCtrl.deleteCustomer);
router.post('/customers/:id/restore', checkPermission('customers', PermissionAction.UPDATE), customerCtrl.restoreCustomer);

/** CUSTOMER SEGMENT ROUTES */
router.get('/:customerId/segments', checkPermission('segments', PermissionAction.READ), segmentCtrl.listByCustomer);
router.post('/:customerId/segments', checkPermission('segments', PermissionAction.CREATE), validateJoi(createSegmentSchema), segmentCtrl.createSegment);
router.put('/segments/:id', checkPermission('segments', PermissionAction.UPDATE), validateJoi(updateSegmentSchema), segmentCtrl.updateSegment);
router.delete('/segments/:id', checkPermission('segments', PermissionAction.DELETE), segmentCtrl.deleteSegment);

/** WALLET MANAGEMENT ROUTES */
router.get('/wallets', checkPermission('wallets', PermissionAction.READ), walletController.listWallets);
router.get('/wallets/:id', checkPermission('wallets', PermissionAction.READ), walletController.getWallet);
router.post('/wallets', checkPermission('wallets', PermissionAction.CREATE), validateJoi(createWalletSchema), walletController.createWallet);
router.put('/wallets/:id', checkPermission('wallets', PermissionAction.UPDATE), validateJoi(updateWalletSchema), walletController.updateWallet);
router.delete('/wallets/:id', checkPermission('wallets', PermissionAction.DELETE), walletController.deleteWallet);

/** WALLET TRANSACTION MANAGEMENT ROUTES */
router.get('/wallet-transactions', checkPermission('wallet_transactions', PermissionAction.READ), walletTransactionController.listTransactions);
router.get('/wallet-transactions/:id', checkPermission('wallet_transactions', PermissionAction.READ), walletTransactionController.getTransaction);
router.post('/wallet-transactions', checkPermission('wallet_transactions', PermissionAction.CREATE), validateJoi(createWalletTransactionSchema), walletTransactionController.createTransaction);
router.put('/wallet-transactions/:id', checkPermission('wallet_transactions', PermissionAction.UPDATE), validateJoi(updateWalletTransactionSchema), walletTransactionController.updateTransaction);
router.delete('/wallet-transactions/:id', checkPermission('wallet_transactions', PermissionAction.DELETE), walletTransactionController.deleteTransaction);

/**
 * ORDER MANAGEMENT
 */
router.get('/orders', checkPermission('orders', PermissionAction.READ), orderController.getAllOrders);
router.get('/orders/:id', checkPermission('orders', PermissionAction.READ), orderController.getOrderById);
router.post('/orders', checkPermission('orders', PermissionAction.CREATE), validateJoi(createOrderSchema), orderController.createOrder);
router.put('/orders/:id', checkPermission('orders', PermissionAction.UPDATE), validateJoi(updateOrderSchema), orderController.updateOrder);
router.delete('/orders/:id', checkPermission('orders', PermissionAction.DELETE), orderController.deleteOrder);
router.patch('/orders/:id/status', checkPermission('orders', PermissionAction.UPDATE), validateJoi(updateOrderStatusSchema), orderController.updateOrderStatus);
router.patch('/orders/:id/cancel', checkPermission('orders', PermissionAction.UPDATE), validateJoi(cancelOrderSchema), orderController.cancelOrder);
router.patch('/orders/:id/confirm', checkPermission('orders', PermissionAction.UPDATE), orderController.confirmOrder);
router.patch('/orders/:id/restore', checkPermission('orders', PermissionAction.UPDATE), orderController.restoreOrder);

/**
 * RETURN MANAGEMENT
 */
router.post('/returns', checkPermission('returns', PermissionAction.CREATE), validateJoi(createReturnSchema), orderController.createReturnRequest);
router.get('/returns/:returnId', checkPermission('returns', PermissionAction.READ), orderController.getReturnById);
router.get('/returns', checkPermission('returns', PermissionAction.READ), orderController.getAllReturns);
router.patch('/returns/:returnId/status', checkPermission('returns', PermissionAction.UPDATE), validateJoi(updateReturnStatusSchema), orderController.updateReturnStatus);

/**
 * DISCOUNT MANAGEMENT
 */
router.get('/discounts', checkPermission('discounts', PermissionAction.READ), discountController.getDiscountOffers);
router.get('/discounts/:id', checkPermission('discounts', PermissionAction.READ), discountController.getDiscountById);
router.post('/discounts', checkPermission('discounts', PermissionAction.CREATE), validateJoi(createDiscountSchema), discountController.createDiscount);
router.put('/discounts/:id', checkPermission('discounts', PermissionAction.UPDATE), validateJoi(updateDiscountSchema), discountController.updateDiscount);
router.delete('/discounts/:id', checkPermission('discounts', PermissionAction.DELETE), discountController.deleteDiscount);

/**
 * REVIEW MANAGEMENT
 */
router.get('/reviews', checkPermission('reviews', PermissionAction.READ), productReviewController.getAllReviews);
router.patch('/reviews/:id/approve', checkPermission('reviews', PermissionAction.APPROVE), productReviewController.approveReview);
router.patch('/reviews/:id/reject', checkPermission('reviews', PermissionAction.REJECT), productReviewController.rejectReview);
router.delete('/reviews/:id', checkPermission('reviews', PermissionAction.DELETE), productReviewController.deleteReview);
router.post('/reviews/:id/reply', checkPermission('reviews', PermissionAction.UPDATE), validateJoi(replyReviewSchema), productReviewController.replyToReview);

/**
 * VENDOR MANAGEMENT
 */
router.get('/vendors', checkPermission('vendors', PermissionAction.READ), vendorController.getAllVendors);
router.get('/vendors/:id', checkPermission('vendors', PermissionAction.READ), vendorController.getVendorById);
router.post('/vendors', checkPermission('vendors', PermissionAction.CREATE), validateJoi(createVendorSchema), vendorController.createVendor);
router.put('/vendors/:id', checkPermission('vendors', PermissionAction.UPDATE), validateJoi(updateVendorSchema), vendorController.updateVendor);
router.delete('/vendors/:id', checkPermission('vendors', PermissionAction.DELETE), vendorController.deleteVendor);
router.patch('/vendors/:id/status', checkPermission('vendors', PermissionAction.UPDATE), validateJoi(updateVendorStatusSchema), vendorController.updateVendorStatus);

/**
 * WAREHOUSE MANAGEMENT
 */
router.get('/warehouses', checkPermission('warehouses', PermissionAction.READ), warehouseController.getAllWarehouses);
router.get('/warehouses/:id', checkPermission('warehouses', PermissionAction.READ), warehouseController.getWarehouseById);
router.post('/warehouses', checkPermission('warehouses', PermissionAction.CREATE), validateJoi(createWarehouseSchema), warehouseController.createWarehouse);
router.put('/warehouses/:id', checkPermission('warehouses', PermissionAction.UPDATE), validateJoi(updateWarehouseSchema), warehouseController.updateWarehouse);
router.delete('/warehouses/:id', checkPermission('warehouses', PermissionAction.DELETE), warehouseController.deleteWarehouse);

/**
 * INVENTORY MANAGEMENT
 */
router.get('/inventories', checkPermission('inventories', PermissionAction.READ), inventoryController.getAllInventory);
router.get('/inventories/:id', checkPermission('inventories', PermissionAction.READ), inventoryController.getInventoryById);
router.post('/inventories', checkPermission('inventories', PermissionAction.CREATE), validateJoi(createInventorySchema), inventoryController.createInventory);
router.put('/inventories/:id', checkPermission('inventories', PermissionAction.UPDATE), validateJoi(updateInventorySchema), inventoryController.updateInventory);
router.delete('/inventories/:id', checkPermission('inventories', PermissionAction.DELETE), inventoryController.deleteInventory);

/**
 * DELIVERY AGENT MANAGEMENT
 */
router.get('/delivery-agents', checkPermission('delivery_agents', PermissionAction.READ), deliveryAgentController.getAllDeliveryAgents);
router.get('/delivery-agents/:id', checkPermission('delivery_agents', PermissionAction.READ), deliveryAgentController.getDeliveryAgentById);
router.post('/delivery-agents', checkPermission('delivery_agents', PermissionAction.CREATE), validateJoi(createDeliveryAgentSchema), deliveryAgentController.createDeliveryAgent);
router.put('/delivery-agents/:id', checkPermission('delivery_agents', PermissionAction.UPDATE), validateJoi(updateDeliveryAgentSchema), deliveryAgentController.updateDeliveryAgent);
router.delete('/delivery-agents/:id', checkPermission('delivery_agents', PermissionAction.DELETE), deliveryAgentController.deleteDeliveryAgent);

/**
 * DELIVERY MANAGEMENT
 */
router.get('/deliveries', checkPermission('deliveries', PermissionAction.READ), deliveryController.getAllDeliveries);
router.get('/deliveries/:id', checkPermission('deliveries', PermissionAction.READ), deliveryController.getDeliveryById);
router.post('/deliveries', checkPermission('deliveries', PermissionAction.CREATE), validateJoi(createDeliverySchema), deliveryController.createDelivery);
router.put('/deliveries/:id', checkPermission('deliveries', PermissionAction.UPDATE), validateJoi(updateDeliverySchema), deliveryController.updateDelivery);
router.delete('/deliveries/:id', checkPermission('deliveries', PermissionAction.DELETE), deliveryController.deleteDelivery);

/**
 * DELIVERY EARNING MANAGEMENT
 */
router.get('/delivery-earnings', checkPermission('delivery_earnings', PermissionAction.READ), deliveryEarningController.getAllEarnings);
router.get('/delivery-earnings/:id', checkPermission('delivery_earnings', PermissionAction.READ), deliveryEarningController.getEarningById);
router.post('/delivery-earnings', checkPermission('delivery_earnings', PermissionAction.CREATE), validateJoi(createDeliveryEarningSchema), deliveryEarningController.createEarning);
router.put('/delivery-earnings/:id', checkPermission('delivery_earnings', PermissionAction.UPDATE), validateJoi(updateDeliveryEarningSchema), deliveryEarningController.updateEarning);
router.delete('/delivery-earnings/:id', checkPermission('delivery_earnings', PermissionAction.DELETE), deliveryEarningController.deleteEarning);

/**
 * REFERRAL MANAGEMENT
 */
router.get('/referral-codes', checkPermission('referral_codes', PermissionAction.READ), referralCodeController.listReferralCodes);
router.get('/referral-codes/:id', checkPermission('referral_codes', PermissionAction.READ), referralCodeController.getReferralCode);
router.post('/referral-codes', checkPermission('referral_codes', PermissionAction.CREATE), validateJoi(createReferralCodeSchema), referralCodeController.createReferralCode);
router.put('/referral-codes/:id', checkPermission('referral_codes', PermissionAction.UPDATE), validateJoi(updateReferralCodeSchema), referralCodeController.updateReferralCode);
router.delete('/referral-codes/:id', checkPermission('referral_codes', PermissionAction.DELETE), referralCodeController.deleteReferralCode);
router.patch('/referral-codes/:id/deactivate', checkPermission('referral_codes', PermissionAction.UPDATE), referralCodeController.deactivateReferralCode);

router.get('/referral-history', checkPermission('referral_history', PermissionAction.READ), referralHistoryController.listReferralHistories);
router.get('/referral-history/:id', checkPermission('referral_history', PermissionAction.READ), referralHistoryController.getReferralHistory);
router.post('/referral-history', checkPermission('referral_history', PermissionAction.CREATE), validateJoi(createReferralHistorySchema), referralHistoryController.createReferralHistory);
router.put('/referral-history/:id', checkPermission('referral_history', PermissionAction.UPDATE), validateJoi(updateReferralHistorySchema), referralHistoryController.updateReferralHistory);
router.delete('/referral-history/:id', checkPermission('referral_history', PermissionAction.DELETE), referralHistoryController.deleteReferralHistory);

/**
 * NOTIFICATION MANAGEMENT
 */
router.get('/notifications', checkPermission('notifications', PermissionAction.READ), notificationController.getAllNotifications);
router.get('/notifications/:id', checkPermission('notifications', PermissionAction.READ), notificationController.getNotificationById);
router.post('/notifications', checkPermission('notifications', PermissionAction.CREATE), validateJoi(createNotificationSchema), notificationController.createNotification);
router.put('/notifications/:id', checkPermission('notifications', PermissionAction.UPDATE), validateJoi(updateNotificationSchema), notificationController.updateNotification);
router.delete('/notifications/:id', checkPermission('notifications', PermissionAction.DELETE), notificationController.deleteNotification);

/**
 * EMAIL TEMPLATE MANAGEMENT
 */
router.get('/email-templates', checkPermission('email_templates', PermissionAction.READ), emailTemplateController.getAllTemplates);
router.get('/email-templates/:id', checkPermission('email_templates', PermissionAction.READ), emailTemplateController.getTemplateById);
router.post('/email-templates', checkPermission('email_templates', PermissionAction.CREATE), validateJoi(createEmailTemplateSchema), emailTemplateController.createTemplate);
router.put('/email-templates/:id', checkPermission('email_templates', PermissionAction.UPDATE), validateJoi(updateEmailTemplateSchema), emailTemplateController.updateTemplate);
router.delete('/email-templates/:id', checkPermission('email_templates', PermissionAction.DELETE), emailTemplateController.deleteTemplate);

/**
 * ADDRESS MANAGEMENT
 */
router.get('/addresses', checkPermission('addresses', PermissionAction.READ), addressController.listAddresses);
router.get('/addresses/:id', checkPermission('addresses', PermissionAction.READ), addressController.getAddress);
router.post('/addresses', checkPermission('addresses', PermissionAction.CREATE), validateJoi(createAddressSchema), addressController.createAddress);
router.put('/addresses/:id', checkPermission('addresses', PermissionAction.UPDATE), validateJoi(updateAddressSchema), addressController.updateAddress);
router.delete('/addresses/:id', checkPermission('addresses', PermissionAction.DELETE), addressController.deleteAddress);
router.patch('/addresses/:id/restore', checkPermission('addresses', PermissionAction.UPDATE), addressController.restoreAddress);

/**
 * RETURN MANAGEMENT (Admin Specific - if different from orderController returns)
 */
// Reusing OrderController return methods or ReturnController methods?
// Previous lines 543 used returnController
router.get('/returns-admin', checkPermission('returns', PermissionAction.READ), returnController.getAllReturns); // Changed path slightly to avoid conflict if any
router.get('/returns-admin/:id', checkPermission('returns', PermissionAction.READ), returnController.getReturnById);
router.post('/returns-admin', checkPermission('returns', PermissionAction.CREATE), validateJoi(createReturnSchema), returnController.createReturn);
router.put('/returns-admin/:id', checkPermission('returns', PermissionAction.UPDATE), validateJoi(updateReturnSchema), returnController.updateReturn);
router.delete('/returns-admin/:id', checkPermission('returns', PermissionAction.DELETE), returnController.deleteReturn);

/**
 * REFUND MANAGEMENT
 */
router.get('/refunds', checkPermission('refunds', PermissionAction.READ), refundController.getAllRefunds);
router.get('/refunds/:id', checkPermission('refunds', PermissionAction.READ), refundController.getRefundById);
router.post('/refunds', checkPermission('refunds', PermissionAction.CREATE), validateJoi(createRefundSchema), refundController.createRefund);
router.put('/refunds/:id', checkPermission('refunds', PermissionAction.UPDATE), validateJoi(updateRefundSchema), refundController.updateRefund);

/**
 * JOB EXECUTION MANAGEMENT
 */
router.get('/job-executions', checkPermission('job_executions', PermissionAction.READ), jobExecutionController.getAllJobExecutions);
router.get('/job-executions/:id', checkPermission('job_executions', PermissionAction.READ), jobExecutionController.getJobExecutionById);

/**
 * EMPLOYEE ACTIVITY MANAGEMENT
 */
router.get('/employee-activities', checkPermission('employee_activities', PermissionAction.READ), employeeActivityController.getAllActivities);
router.get('/employee-activities/:id', checkPermission('employee_activities', PermissionAction.READ), employeeActivityController.getActivityById);

/**
 * SESSION MANAGEMENT
 */
router.get('/sessions', checkPermission('sessions', PermissionAction.READ), sessionController.listSessions);
router.get('/sessions/:id', checkPermission('sessions', PermissionAction.READ), sessionController.getSession);
router.delete('/sessions/:id', checkPermission('sessions', PermissionAction.DELETE), sessionController.deleteSession);
router.delete('/users/:userId/sessions', checkPermission('sessions', PermissionAction.DELETE), sessionController.deleteUserSessions);

/**
 * PAYMENT MANAGEMENT
 */
router.get('/payments', checkPermission('payments', PermissionAction.READ), paymentController.getAllPayments);
router.get('/payments/:id', checkPermission('payments', PermissionAction.READ), paymentController.getPaymentById);
router.patch('/payments/:id/status', checkPermission('payments', PermissionAction.UPDATE), paymentController.updatePaymentStatus);

/**
 * VENDOR PAYOUT MANAGEMENT
 */
router.get('/vendor-payouts', checkPermission('vendor_payouts', PermissionAction.READ), vendorPayoutController.getAllPayouts);
router.get('/vendor-payouts/:id', checkPermission('vendor_payouts', PermissionAction.READ), vendorPayoutController.getPayoutById);
router.post('/vendor-payouts', checkPermission('vendor_payouts', PermissionAction.CREATE), validateJoi(createVendorPayoutSchema), vendorPayoutController.createPayout);
router.put('/vendor-payouts/:id', checkPermission('vendor_payouts', PermissionAction.UPDATE), validateJoi(updateVendorPayoutSchema), vendorPayoutController.updatePayout);
router.delete('/vendor-payouts/:id', checkPermission('vendor_payouts', PermissionAction.DELETE), vendorPayoutController.deletePayout);
router.patch('/vendor-payouts/:id/status', checkPermission('vendor_payouts', PermissionAction.UPDATE), validateJoi(updateVendorPayoutStatusSchema), vendorPayoutController.updateStatus);

/**
 * INVOICE MANAGEMENT
 */
router.get('/invoices', checkPermission('invoices', PermissionAction.READ), invoiceController.getAllInvoices);
router.get('/invoices/:id', checkPermission('invoices', PermissionAction.READ), invoiceController.getInvoiceById);
router.post('/invoices', checkPermission('invoices', PermissionAction.CREATE), validateJoi(createInvoiceSchema), invoiceController.createInvoice);
router.put('/invoices/:id', checkPermission('invoices', PermissionAction.UPDATE), validateJoi(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/invoices/:id', checkPermission('invoices', PermissionAction.DELETE), invoiceController.deleteInvoice);

/**
 * STOCK MOVEMENT MANAGEMENT (INVENTORY HISTORY)
 */
router.get('/stock-movements', checkPermission('stock_movements', PermissionAction.READ), stockMovementController.getAllMovements);
router.get('/stock-movements/:id', checkPermission('stock_movements', PermissionAction.READ), stockMovementController.getMovementById);
router.post('/stock-movements', checkPermission('stock_movements', PermissionAction.CREATE), validateJoi(createStockMovementSchema), stockMovementController.createMovement);

/**
 * PRICE HISTORY MANAGEMENT
 */
router.get('/price-history', checkPermission('price_history', PermissionAction.READ), priceHistoryController.getAllPriceHistory);
router.get('/price-history/:id', checkPermission('price_history', PermissionAction.READ), priceHistoryController.getPriceHistoryById);

/**
 * SYSTEM SETTING MANAGEMENT
 */
router.get('/system-settings', checkPermission('system_settings', PermissionAction.READ), systemSettingController.getAllSettings);
router.get('/system-settings/:key', checkPermission('system_settings', PermissionAction.READ), systemSettingController.getSettingByKey);
router.post('/system-settings', checkPermission('system_settings', PermissionAction.CREATE), validateJoi(createSystemSettingSchema), systemSettingController.createSetting);
router.put('/system-settings/:key', checkPermission('system_settings', PermissionAction.UPDATE), validateJoi(updateSystemSettingSchema), systemSettingController.updateSetting);
router.delete('/system-settings/:key', checkPermission('system_settings', PermissionAction.DELETE), systemSettingController.deleteSetting);

/**
 * BANNER MANAGEMENT
 */
router.get('/banners', checkPermission('banners', PermissionAction.READ), bannerController.getAllBanners);
router.get('/banners/:id', checkPermission('banners', PermissionAction.READ), bannerController.getBannerById);
router.post('/banners', checkPermission('banners', PermissionAction.CREATE), validateJoi(createBannerValidation), bannerController.createBanner);
router.put('/banners/:id', checkPermission('banners', PermissionAction.UPDATE), validateJoi(updateBannerValidation), bannerController.updateBanner);
router.delete('/banners/:id', checkPermission('banners', PermissionAction.DELETE), bannerController.deleteBanner);

/**
 * AUDIT LOG MANAGEMENT
 */
router.get('/audit-logs', checkPermission('audit_logs', PermissionAction.READ), auditLogController.getAllLogs);
router.get('/audit-logs/:id', checkPermission('audit_logs', PermissionAction.READ), auditLogController.getLogById);
router.get('/audit-logs/:entityType/:entityId', checkPermission('audit_logs', PermissionAction.READ), auditLogController.getLogsByEntity);

export { router as orgRoutes };
