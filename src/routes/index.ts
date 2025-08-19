import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

// API version prefix
const apiRouter = Router();
apiRouter.use('/v1', router);

export { apiRouter as routes };
