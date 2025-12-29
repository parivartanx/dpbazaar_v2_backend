import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { adminRoutes } from './admin.routes';
import { customerRouter } from './customer.routes';
import { desktopRoutes } from './desktop.routes';
import { subscriptionCardRoutes } from './subscriptionCard.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/admin', adminRoutes);
router.use('/customer', customerRouter);
router.use('/desktop', desktopRoutes);
router.use('/subscription-cards', subscriptionCardRoutes);

// API version prefix
const apiRouter = Router();
apiRouter.use('/v1', router);

export { apiRouter as routes };