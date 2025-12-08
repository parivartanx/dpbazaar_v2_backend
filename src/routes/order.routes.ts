import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  // createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  orderFilterSchema,
} from '../validators/order.validation';

const router = Router();

// Instantiate controller
const orderController = new OrderController();

/**
 * DASHBOARD & ANALYTICS ROUTES
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
 * ORDER FILTER & SEARCH ROUTES
 */
router.get('/filter', validateJoi(orderFilterSchema), orderController.filterOrders);

/**
 * ORDER CRUD ROUTES
 */
router.get('/', validateJoi(orderFilterSchema), orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/',
  //  validateJoi(createOrderSchema),
   orderController.createOrder);
router.put('/:id', validateJoi(updateOrderSchema), orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

/**
 * ORDER STATUS MANAGEMENT ROUTES
 */
router.patch(
  '/:id/status',
  validateJoi(updateOrderStatusSchema),
  orderController.updateOrderStatus
);
router.patch(
  '/:id/cancel',
  validateJoi(cancelOrderSchema),
  orderController.cancelOrder
);
router.patch('/:id/confirm', orderController.confirmOrder);
router.patch('/:id/restore', orderController.restoreOrder);

export { router as orderRoutes };