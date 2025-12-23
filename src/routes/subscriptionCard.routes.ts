import { Router } from 'express';
import { SubscriptionCardController } from '../controllers/subscriptionCard.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createSubscriptionCardSchema,
  updateSubscriptionCardSchema,
} from '../validators/subscriptionCard.validation';

const router = Router();
const subscriptionCardController = new SubscriptionCardController();

/**
 * SUBSCRIPTION CARD MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/subscription-cards', subscriptionCardController.listCards);
router.get('/admin/subscription-cards/:id', subscriptionCardController.getCard);
router.post('/admin/subscription-cards', validateJoi(createSubscriptionCardSchema), subscriptionCardController.createCard);
router.put('/admin/subscription-cards/:id', validateJoi(updateSubscriptionCardSchema), subscriptionCardController.updateCard);
router.delete('/admin/subscription-cards/:id', subscriptionCardController.deleteCard);
router.patch('/admin/subscription-cards/:id/restore', subscriptionCardController.restoreCard);

// Customer routes
router.get('/subscription-cards', subscriptionCardController.listVisibleCards);
router.get('/subscription-cards/:id', subscriptionCardController.getCardDetails);

export { router as subscriptionCardRoutes };