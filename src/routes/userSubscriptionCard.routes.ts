import { Router } from 'express';
import { UserSubscriptionCardController } from '../controllers/userSubscriptionCard.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createUserSubscriptionCardSchema,
  updateUserSubscriptionCardSchema,
} from '../validators/userSubscriptionCard.validation';

const router = Router();
const userSubscriptionCardController = new UserSubscriptionCardController();

/**
 * USER SUBSCRIPTION CARD MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/user-subscription-cards', userSubscriptionCardController.listUserCards);
router.get('/admin/user-subscription-cards/:id', userSubscriptionCardController.getUserCard);
router.post('/admin/user-subscription-cards', validateJoi(createUserSubscriptionCardSchema), userSubscriptionCardController.createUserCard);
router.put('/admin/user-subscription-cards/:id', validateJoi(updateUserSubscriptionCardSchema), userSubscriptionCardController.updateUserCard);
router.delete('/admin/user-subscription-cards/:id', userSubscriptionCardController.deleteUserCard);

// Customer routes
router.get('/customers/:customerId/subscription-cards', userSubscriptionCardController.getCustomerCards);

export { router as userSubscriptionCardRoutes };