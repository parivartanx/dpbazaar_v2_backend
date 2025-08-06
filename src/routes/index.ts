import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { productRoutes } from './product.routes';

const router = Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount route modules
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/products`, productRoutes);

export { router as routes }; 