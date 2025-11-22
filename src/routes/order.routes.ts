import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();

// Instantiate controller
const orderController = new OrderController();

/**
 * DASHBOARD & ANALYTICS ROUTES
 * Place before parameterized routes to avoid conflicts
 */
router.get('/dashboard-stats', orderController.getDashboardStats);
router.get('/monthly-stats', orderController.getMonthlyStats);
router.get('/status-count', orderController.getOrderCountByStatus);
router.get('/revenue-stats', orderController.getRevenueStats);

/**
 * CUSTOMER & VENDOR SPECIFIC ROUTES
 */
router.get('/customer/:customerId', orderController.getCustomerOrders);
router.get('/vendor/:vendorId', orderController.getVendorOrders);

/**
 * ORDER CRUD ROUTES
 */
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

/**
 * ORDER STATUS MANAGEMENT ROUTES
 */
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/confirm', orderController.confirmOrder);
router.patch('/:id/restore', orderController.restoreOrder);

export { router as orderRoutes };
