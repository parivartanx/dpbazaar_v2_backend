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
  // ReportController,
  VariantController,
  AttributeController,
  RelationController,
  // ReviewController,
} from '../controllers/product.controllers';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerSegmentController } from '../controllers/customerSegment.controller';
import { WalletController } from '../controllers/wallet.controller';
import { WalletTransactionController } from '../controllers/walletTransaction.controller';
import { OrderController } from '../controllers/order.controller';
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

/** SUBSCRIPTION CARD MANAGEMENT */
router.get('/admin/subscription-cards', subscriptionCardController.listCards);
router.get('/admin/subscription-cards/:id', subscriptionCardController.getCard);
router.post('/admin/subscription-cards', validateJoi(createSubscriptionCardSchema), subscriptionCardController.createCard);
router.put('/admin/subscription-cards/:id', validateJoi(updateSubscriptionCardSchema), subscriptionCardController.updateCard);
router.delete('/admin/subscription-cards/:id', subscriptionCardController.deleteCard);
router.patch('/admin/subscription-cards/:id/restore', subscriptionCardController.restoreCard);

/* USER SUBSCRIPTION CARD MANAGEMENT ROUTES */

// Admin routes
router.get('/admin/user-subscription-cards', userSubscriptionCardController.listUserCards);
router.get('/admin/user-subscription-cards/:id', userSubscriptionCardController.getUserCard);
router.post('/admin/user-subscription-cards', validateJoi(createUserSubscriptionCardSchema), userSubscriptionCardController.createUserCard);
router.put('/admin/user-subscription-cards/:id', validateJoi(updateUserSubscriptionCardSchema), userSubscriptionCardController.updateUserCard);
router.delete('/admin/user-subscription-cards/:id', userSubscriptionCardController.deleteUserCard);


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

/** WALLET MANAGEMENT ROUTES */

// Admin routes
router.get('/admin/wallets', walletController.listWallets);
router.get('/admin/wallets/:id', walletController.getWallet);
router.post('/admin/wallets', validateJoi(createWalletSchema), walletController.createWallet);
router.put('/admin/wallets/:id', validateJoi(updateWalletSchema), walletController.updateWallet);
router.delete('/admin/wallets/:id', walletController.deleteWallet);

/** WALLET TRANSACTION MANAGEMENT ROUTES */

// Admin routes
router.get('/admin/wallet-transactions', walletTransactionController.listTransactions);
router.get('/admin/wallet-transactions/:id', walletTransactionController.getTransaction);
router.post('/admin/wallet-transactions', validateJoi(createWalletTransactionSchema), walletTransactionController.createTransaction);
router.put('/admin/wallet-transactions/:id', validateJoi(updateWalletTransactionSchema), walletTransactionController.updateTransaction);
router.delete('/admin/wallet-transactions/:id', walletTransactionController.deleteTransaction);

/**
 * ORDER MANAGEMENT
 */
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.post('/orders', validateJoi(createOrderSchema), orderController.createOrder);
router.put('/orders/:id', validateJoi(updateOrderSchema), orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);
router.patch('/orders/:id/status', validateJoi(updateOrderStatusSchema), orderController.updateOrderStatus);
router.patch('/orders/:id/cancel', validateJoi(cancelOrderSchema), orderController.cancelOrder);
router.patch('/orders/:id/confirm', orderController.confirmOrder);
router.patch('/orders/:id/restore', orderController.restoreOrder);

/**
 * RETURN MANAGEMENT
 */
router.post('/returns', validateJoi(createReturnSchema), orderController.createReturnRequest);
router.get('/returns/:returnId', orderController.getReturnById);
router.get('/returns', orderController.getAllReturns);
router.patch('/returns/:returnId/status', validateJoi(updateReturnStatusSchema), orderController.updateReturnStatus);

/**
 * DISCOUNT MANAGEMENT
 */
router.get('/discounts', discountController.getDiscountOffers);
router.get('/discounts/:id', discountController.getDiscountById);
router.post('/discounts', validateJoi(createDiscountSchema), discountController.createDiscount);
router.put('/discounts/:id', validateJoi(updateDiscountSchema), discountController.updateDiscount);
router.delete('/discounts/:id', discountController.deleteDiscount);

/**
 * REVIEW MANAGEMENT
 */
router.get('/reviews', productReviewController.getAllReviews);
router.patch('/reviews/:id/approve', productReviewController.approveReview);
router.patch('/reviews/:id/reject', productReviewController.rejectReview);
router.delete('/reviews/:id', productReviewController.deleteReview);
router.post('/reviews/:id/reply', validateJoi(replyReviewSchema), productReviewController.replyToReview);

/**
 * VENDOR MANAGEMENT
 */
router.get('/vendors', vendorController.getAllVendors);
router.get('/vendors/:id', vendorController.getVendorById);
router.post('/vendors', validateJoi(createVendorSchema), vendorController.createVendor);
router.put('/vendors/:id', validateJoi(updateVendorSchema), vendorController.updateVendor);
router.delete('/vendors/:id', vendorController.deleteVendor);
router.patch('/vendors/:id/status', validateJoi(updateVendorStatusSchema), vendorController.updateVendorStatus);

/**
 * WAREHOUSE MANAGEMENT
 */
router.get('/warehouses', warehouseController.getAllWarehouses);
router.get('/warehouses/:id', warehouseController.getWarehouseById);
router.post('/warehouses', validateJoi(createWarehouseSchema), warehouseController.createWarehouse);
router.put('/warehouses/:id', validateJoi(updateWarehouseSchema), warehouseController.updateWarehouse);
router.delete('/warehouses/:id', warehouseController.deleteWarehouse);

/**
 * INVENTORY MANAGEMENT
 */
router.get('/inventories', inventoryController.getAllInventory);
router.get('/inventories/:id', inventoryController.getInventoryById);
router.post('/inventories', validateJoi(createInventorySchema), inventoryController.createInventory);
router.put('/inventories/:id', validateJoi(updateInventorySchema), inventoryController.updateInventory);
router.delete('/inventories/:id', inventoryController.deleteInventory);

/**
 * DELIVERY AGENT MANAGEMENT
 */
router.get('/delivery-agents', deliveryAgentController.getAllDeliveryAgents);
router.get('/delivery-agents/:id', deliveryAgentController.getDeliveryAgentById);
router.post('/delivery-agents', validateJoi(createDeliveryAgentSchema), deliveryAgentController.createDeliveryAgent);
router.put('/delivery-agents/:id', validateJoi(updateDeliveryAgentSchema), deliveryAgentController.updateDeliveryAgent);
router.delete('/delivery-agents/:id', deliveryAgentController.deleteDeliveryAgent);

/**
 * DELIVERY MANAGEMENT
 */
router.get('/deliveries', deliveryController.getAllDeliveries);
router.get('/deliveries/:id', deliveryController.getDeliveryById);
router.post('/deliveries', validateJoi(createDeliverySchema), deliveryController.createDelivery);
router.put('/deliveries/:id', validateJoi(updateDeliverySchema), deliveryController.updateDelivery);
router.delete('/deliveries/:id', deliveryController.deleteDelivery);

/**
 * DELIVERY EARNING MANAGEMENT
 */
router.get('/delivery-earnings', deliveryEarningController.getAllEarnings);
router.get('/delivery-earnings/:id', deliveryEarningController.getEarningById);
router.post('/delivery-earnings', validateJoi(createDeliveryEarningSchema), deliveryEarningController.createEarning);
router.put('/delivery-earnings/:id', validateJoi(updateDeliveryEarningSchema), deliveryEarningController.updateEarning);
router.delete('/delivery-earnings/:id', deliveryEarningController.deleteEarning);

/**
 * REFERRAL MANAGEMENT
 */
router.get('/referral-codes', referralCodeController.listReferralCodes);
router.get('/referral-codes/:id', referralCodeController.getReferralCode);
router.post('/referral-codes', validateJoi(createReferralCodeSchema), referralCodeController.createReferralCode);
router.put('/referral-codes/:id', validateJoi(updateReferralCodeSchema), referralCodeController.updateReferralCode);
router.delete('/referral-codes/:id', referralCodeController.deleteReferralCode);
router.patch('/referral-codes/:id/deactivate', referralCodeController.deactivateReferralCode);

router.get('/referral-history', referralHistoryController.listReferralHistories);
router.get('/referral-history/:id', referralHistoryController.getReferralHistory);
router.post('/referral-history', validateJoi(createReferralHistorySchema), referralHistoryController.createReferralHistory);
router.put('/referral-history/:id', validateJoi(updateReferralHistorySchema), referralHistoryController.updateReferralHistory);
router.delete('/referral-history/:id', referralHistoryController.deleteReferralHistory);

/**
 * NOTIFICATION MANAGEMENT
 */
router.get('/notifications', notificationController.getAllNotifications);
router.get('/notifications/:id', notificationController.getNotificationById);
router.post('/notifications', validateJoi(createNotificationSchema), notificationController.createNotification);
router.put('/notifications/:id', validateJoi(updateNotificationSchema), notificationController.updateNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

/**
 * EMAIL TEMPLATE MANAGEMENT
 */
router.get('/email-templates', emailTemplateController.getAllTemplates);
router.get('/email-templates/:id', emailTemplateController.getTemplateById);
router.post('/email-templates', validateJoi(createEmailTemplateSchema), emailTemplateController.createTemplate);
router.put('/email-templates/:id', validateJoi(updateEmailTemplateSchema), emailTemplateController.updateTemplate);
router.delete('/email-templates/:id', emailTemplateController.deleteTemplate);

/**
 * RETURN MANAGEMENT
 */
router.get('/returns', returnController.getAllReturns);
router.get('/returns/:id', returnController.getReturnById);
router.post('/returns', validateJoi(createReturnSchema), returnController.createReturn);
router.put('/returns/:id', validateJoi(updateReturnSchema), returnController.updateReturn);
router.delete('/returns/:id', returnController.deleteReturn);

/**
 * REFUND MANAGEMENT
 */
router.get('/refunds', refundController.getAllRefunds);
router.get('/refunds/:id', refundController.getRefundById);
router.post('/refunds', validateJoi(createRefundSchema), refundController.createRefund);
router.put('/refunds/:id', validateJoi(updateRefundSchema), refundController.updateRefund);

/**
 * JOB EXECUTION MANAGEMENT
 */
router.get('/job-executions', jobExecutionController.getAllJobExecutions);
router.get('/job-executions/:id', jobExecutionController.getJobExecutionById);

/**
 * EMPLOYEE ACTIVITY MANAGEMENT
 */
router.get('/employee-activities', employeeActivityController.getAllActivities);
router.get('/employee-activities/:id', employeeActivityController.getActivityById);

/**
 * PAYMENT MANAGEMENT
 */
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.patch('/payments/:id/status', paymentController.updatePaymentStatus);

/**
 * VENDOR PAYOUT MANAGEMENT
 */
router.get('/vendor-payouts', vendorPayoutController.getAllPayouts);
router.get('/vendor-payouts/:id', vendorPayoutController.getPayoutById);
router.post('/vendor-payouts', validateJoi(createVendorPayoutSchema), vendorPayoutController.createPayout);
router.put('/vendor-payouts/:id', validateJoi(updateVendorPayoutSchema), vendorPayoutController.updatePayout);
router.delete('/vendor-payouts/:id', vendorPayoutController.deletePayout);
router.patch('/vendor-payouts/:id/status', validateJoi(updateVendorPayoutStatusSchema), vendorPayoutController.updateStatus);

/**
 * INVOICE MANAGEMENT
 */
router.get('/invoices', invoiceController.getAllInvoices);
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.post('/invoices', validateJoi(createInvoiceSchema), invoiceController.createInvoice);
router.put('/invoices/:id', validateJoi(updateInvoiceSchema), invoiceController.updateInvoice);
router.delete('/invoices/:id', invoiceController.deleteInvoice);

/**
 * STOCK MOVEMENT MANAGEMENT (INVENTORY HISTORY)
 */
router.get('/stock-movements', stockMovementController.getAllMovements);
router.get('/stock-movements/:id', stockMovementController.getMovementById);
router.post('/stock-movements', validateJoi(createStockMovementSchema), stockMovementController.createMovement);

/**
 * PRICE HISTORY MANAGEMENT
 */
router.get('/price-history', priceHistoryController.getAllPriceHistory);
router.get('/price-history/:id', priceHistoryController.getPriceHistoryById);

/**
 * SYSTEM SETTING MANAGEMENT
 */
router.get('/system-settings', systemSettingController.getAllSettings);
router.get('/system-settings/:key', systemSettingController.getSettingByKey);
router.post('/system-settings', validateJoi(createSystemSettingSchema), systemSettingController.createSetting);
router.put('/system-settings/:key', validateJoi(updateSystemSettingSchema), systemSettingController.updateSetting);
router.delete('/system-settings/:key', systemSettingController.deleteSetting);

/**
 * AUDIT LOG MANAGEMENT
 */
router.get('/audit-logs', auditLogController.getAllLogs);
router.get('/audit-logs/:id', auditLogController.getLogById);
router.get('/audit-logs/:entityType/:entityId', auditLogController.getLogsByEntity);

/**
 * CMS MANAGEMENT
 */

// router.get('/banners', adminController.getAllBanners);
// router.post('/banners', adminController.createBanner);
// router.delete('/banners/:id', adminController.deleteBanner);
export { router as adminRoutes };