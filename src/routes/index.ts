import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { adminRoutes } from './admin.routes';
import { orderRoutes } from './order.routes';
import { customerRouter } from './customer.routes';
import { addressRouter } from './address.routes';
import { desktopRoutes } from './desktop.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRouter);
router.use('/addresses', addressRouter);
router.use('/desktop', desktopRoutes);

// API version prefix
const apiRouter = Router();
apiRouter.use('/v1', router);

export { apiRouter as routes };