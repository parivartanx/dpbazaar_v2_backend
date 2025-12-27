import { Router } from 'express';
import { SubscriptionCardController } from '../controllers/subscriptionCard.controller';
import { UserSubscriptionCardController } from '../controllers/userSubscriptionCard.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import { purchaseSubscriptionCardSchema } from '../validators/userSubscriptionCard.validation';
const router = Router();
const subscriptionCardController = new SubscriptionCardController();
const userSubscriptionCardController = new UserSubscriptionCardController();


// ------------ PUBLIC SUBSCRIPTION ROUTES -------------

// Customer routes
router.get('/', subscriptionCardController.listVisibleCards);
router.get('/:id', subscriptionCardController.getCardDetails);

// Subscription card purchase route
router.post('/purchase', isAccessAllowed('CUSTOMER'), validateJoi(purchaseSubscriptionCardSchema), userSubscriptionCardController.purchaseSubscriptionCard);


// ------------ PRIVATE SUBSCRIPTION ROUTES -------------
router.get('/my-cards', isAccessAllowed('CUSTOMER'), userSubscriptionCardController.getCustomerCards);
router.get('/my-cards/:id', isAccessAllowed('CUSTOMER'), userSubscriptionCardController.getCustomerCardById);



export { router as subscriptionCardRoutes };