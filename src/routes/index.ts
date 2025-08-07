import { Router } from 'express';
import { authRoutes } from './auth.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);

// API version prefix
const apiRouter = Router();
apiRouter.use('/v1', router);

export { apiRouter as routes }; 