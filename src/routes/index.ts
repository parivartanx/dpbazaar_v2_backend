import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { productRoutes } from './product.routes';
import { orgRoutes } from './org.routes';
import { customerRouter } from './customer.routes';
import { desktopRoutes } from './desktop.routes';
import { subscriptionCardRoutes } from './subscriptionCard.routes';
import { deliveryAgentRoutes } from './deliveryAgent.routes';
import { publicRoutes } from './public.routes';
import { fileUploadRoutes } from './fileUpload.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/org', orgRoutes);
router.use('/customer', customerRouter);
router.use('/desktop', desktopRoutes);
router.use('/subscription-cards', subscriptionCardRoutes);
router.use('/delivery-agents', deliveryAgentRoutes);
router.use('/public', publicRoutes);
router.use('/file-upload', fileUploadRoutes);

// API version prefix
const apiRouter = Router();
apiRouter.use('/v1', router);

export { apiRouter as routes };