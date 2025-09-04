import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerSegmentController } from '../controllers/customerSegment.controller';
// import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createCustomerSchema,
  updateCustomerSchema,
} from '../validators/customer.validaton';
import {
  createSegmentSchema,
  updateSegmentSchema,
} from '../validators/cuctomerSegment.validaton';

const router = Router();
const customerCtrl = new CustomerController();
const segmentCtrl = new CustomerSegmentController();

/** CUSTOMER ROUTES */
// Admin
router.get('/', customerCtrl.listCustomers);
router.get('/:id', customerCtrl.getCustomer);
router.post(
  '/',
  validateJoi(createCustomerSchema),
  customerCtrl.createCustomer
); // ✅ add create route with validation
router.put(
  '/:id',
  validateJoi(updateCustomerSchema),
  customerCtrl.updateCustomer
);
router.delete('/:id', customerCtrl.deleteCustomer);
router.post('/:id/restore', customerCtrl.restoreCustomer);

// Customer (self-service)
router.get('/me/profile', customerCtrl.getMyProfile);
router.put(
  '/me/profile',
  validateJoi(updateCustomerSchema),
  customerCtrl.updateMyProfile
);

/** CUSTOMER SEGMENT ROUTES */
router.get('/:customerId/segments', segmentCtrl.listByCustomer);
router.post(
  '/:customerId/segments',
  validateJoi(createSegmentSchema),
  segmentCtrl.createSegment
);
router.put(
  '/segments/:id',
  validateJoi(updateSegmentSchema),
  segmentCtrl.updateSegment
);
router.delete('/segments/:id', segmentCtrl.deleteSegment);

export { router as customerRouter };
