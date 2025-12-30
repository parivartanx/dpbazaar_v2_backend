import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { DeliveryAgentController } from '../controllers/deliveryAgent.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { UserRole } from '../types/common';

const router = Router();
const authController = new AuthController();
const deliveryAgentController = new DeliveryAgentController();

// Auth routes (Reusing AuthController)
// Client should send { email, password, role: 'DELIVERY_AGENT' }
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', isAccessAllowed(UserRole.DELIVERY_AGENT), authController.logout);

// Profile routes
router.get('/profile', isAccessAllowed(UserRole.DELIVERY_AGENT), deliveryAgentController.getMe);
router.put('/availability', isAccessAllowed(UserRole.DELIVERY_AGENT), deliveryAgentController.toggleAvailability);

// Delivery routes
router.get('/deliveries', isAccessAllowed(UserRole.DELIVERY_AGENT), deliveryAgentController.getMyDeliveries);
router.put('/deliveries/:id/status', isAccessAllowed(UserRole.DELIVERY_AGENT), deliveryAgentController.updateDeliveryStatus);

export { router as deliveryAgentRoutes };
