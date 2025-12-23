import { Router } from 'express';
import { ReferralHistoryController } from '../controllers/referralHistory.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createReferralHistorySchema,
  updateReferralHistorySchema,
} from '../validators/referralHistory.validation';

const router = Router();
const referralHistoryController = new ReferralHistoryController();

/**
 * REFERRAL HISTORY MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/referral-histories', referralHistoryController.listReferralHistories);
router.get('/admin/referral-histories/:id', referralHistoryController.getReferralHistory);
router.post('/admin/referral-histories', validateJoi(createReferralHistorySchema), referralHistoryController.createReferralHistory);
router.put('/admin/referral-histories/:id', validateJoi(updateReferralHistorySchema), referralHistoryController.updateReferralHistory);
router.delete('/admin/referral-histories/:id', referralHistoryController.deleteReferralHistory);

// Customer routes
router.get('/customers/:customerId/referral-histories', referralHistoryController.getCustomerReferralHistory);
router.get('/users/:userId/referral-history', referralHistoryController.getReferredUserHistory);

export { router as referralHistoryRoutes };