import { Router } from 'express';
import { DesktopController } from '../controllers/desktop.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';

const router = Router();
const desktopController = new DesktopController();

// Authentication APIs
router.post('/auth/login', desktopController.login);
router.post('/auth/logout', desktopController.logout);
router.post('/auth/refresh', desktopController.refreshToken);

// Dashboard API
router.get('/dashboard', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getDashboardData);

// Product search API
router.get('/products', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.searchProducts);

// Discount APIs
router.get('/discounts', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getAllDiscounts);

// Wallet APIs
router.post('/verify-otp-and-get-wallet', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.verifyOtpAndGetWalletDetails);
router.post('/send-otp', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.sendOtpForWalletPayment);

// Order creation API for desktop sales
router.post('/generate-bill', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.createOrder);

// Bill history API
router.get('/bills', desktopController.getBillHistory);
router.get('/bills-excel', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getBillHistoryExcel);
// Get bill by order number API
router.get('/bills/:orderNumber', desktopController.getBillByOrderNumber);

// Return APIs
router.post('/create-return-request', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.createReturnRequest);
router.get('/get-returns', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getReturns);
router.get('/get-returns-excel', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getReturnsExcel);

// Analytics APIs
router.get('/analytics/daily-sales', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getDailySales);
router.get('/analytics/payment-methods', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getPaymentMethods);
router.get('/analytics/monthly-trend', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getMonthlyTrend);
router.get('/analytics/top-products', isAccessAllowed('MANAGER', 'ADMIN'), desktopController.getTopSellingProducts);


export { router as desktopRoutes };