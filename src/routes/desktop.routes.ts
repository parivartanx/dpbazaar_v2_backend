import { Router } from 'express';
import { DesktopController } from '../controllers/desktop.controller';

const router = Router();
const desktopController = new DesktopController();

// Product search API
router.get('/products', desktopController.searchProducts);

// Bill history API
router.get('/bills', desktopController.getBillHistory);

// Dashboard API
router.get('/dashboard', desktopController.getDashboardData);

// Analytics APIs
router.get('/analytics/daily-sales', desktopController.getDailySales);
router.get('/analytics/payment-methods', desktopController.getPaymentMethods);
router.get('/analytics/monthly-trend', desktopController.getMonthlyTrend);
router.get('/analytics/top-products', desktopController.getTopSellingProducts);

// Authentication APIs
router.post('/auth/login', desktopController.login);
router.post('/auth/logout', desktopController.logout);
router.post('/auth/refresh', desktopController.refreshToken);

export { router as desktopRoutes };