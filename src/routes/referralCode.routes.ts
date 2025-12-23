import { Router } from 'express';
import { ReferralCodeController } from '../controllers/referralCode.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createReferralCodeSchema,
  updateReferralCodeSchema,
} from '../validators/referralCode.validation';

const router = Router();
const referralCodeController = new ReferralCodeController();

/**
 * REFERRAL CODE MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/referral-codes', referralCodeController.listReferralCodes);
router.get('/admin/referral-codes/:id', referralCodeController.getReferralCode);
router.get('/admin/referral-codes/code/:code', referralCodeController.getReferralCodeByCode);
router.post('/admin/referral-codes', validateJoi(createReferralCodeSchema), referralCodeController.createReferralCode);
router.put('/admin/referral-codes/:id', validateJoi(updateReferralCodeSchema), referralCodeController.updateReferralCode);
router.delete('/admin/referral-codes/:id', referralCodeController.deleteReferralCode);
router.patch('/admin/referral-codes/:id/deactivate', referralCodeController.deactivateReferralCode);

// Customer routes
router.get('/customers/:customerId/referral-code', referralCodeController.getCustomerReferralCode);

export { router as referralCodeRoutes };