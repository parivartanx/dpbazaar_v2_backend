// src/routes/cardRoutes.ts
import { Router } from 'express';
import { CardController } from '../controllers/card.contoller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
// import { validateJoi } from '../middlewares/validateJoi';
// import {
//   createCardSchema,
//   updateCardSchema,
// } from '../validators/card.validaton';

const router = Router();
const cardController = new CardController();

// /** ----------- ADMIN ROUTES ----------- */ (Already added in admin route)
// router.get('/admin/cards', isAccessAllowed('ADMIN'), cardController.listCards);
// router.get(
//   '/admin/cards/:id',
//   isAccessAllowed('ADMIN'),
//   cardController.getCard
// );
// router.post(
//   '/admin/cards',
//   isAccessAllowed('ADMIN'),
//   validateJoi(createCardSchema),
//   cardController.createCard
// );
// router.put(
//   '/admin/cards/:id',
//   isAccessAllowed('ADMIN'),
//   validateJoi(updateCardSchema),
//   cardController.updateCard
// );
// router.delete(
//   '/admin/cards/:id',
//   isAccessAllowed('ADMIN'),
//   cardController.deleteCard
// );
// router.patch(
//   '/admin/cards/:id/restore',
//   isAccessAllowed('ADMIN'),
//   cardController.restoreCard
// );

/** ----------- CUSTOMER ROUTES ----------- */
router.get('/', isAccessAllowed('ADMIN'), cardController.listVisibleCards);
router.get('/:id', isAccessAllowed('ADMIN'), cardController.getCardDetails);

export { router as cardRouter };
