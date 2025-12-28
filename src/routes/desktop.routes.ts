import { Router } from 'express';
import { DesktopController } from '../controllers/desktop.controller';

const router = Router();
const desktopController = new DesktopController();

// Authentication APIs
router.post('/auth/login', desktopController.login);
router.post('/auth/logout', desktopController.logout);
router.post('/auth/refresh', desktopController.refreshToken);

// Dashboard API
router.get('/dashboard', desktopController.getDashboardData);

// Product search API
router.get('/products', desktopController.searchProducts);

// Discount APIs
router.get('/discounts', desktopController.getAllDiscounts);

// Wallet APIs
router.post('/verify-otp-and-get-wallet', desktopController.verifyOtpAndGetWalletDetails);
router.post('/send-otp', desktopController.sendOtpForWalletPayment);

// Order creation API for desktop sales
router.post('/generate-bill', desktopController.createOrder);

// Bill history API
router.get('/bills', desktopController.getBillHistory);
// Get bill by order number API
router.get('/bills/:orderNumber', desktopController.getBillByOrderNumber);

// Return APIs
router.post('/create-return-request', desktopController.createReturnRequest);
router.get('/get-returns', desktopController.getReturns);

// Analytics APIs
router.get('/analytics/daily-sales', desktopController.getDailySales);
router.get('/analytics/payment-methods', desktopController.getPaymentMethods);
router.get('/analytics/monthly-trend', desktopController.getMonthlyTrend);
router.get('/analytics/top-products', desktopController.getTopSellingProducts);


export { router as desktopRoutes };