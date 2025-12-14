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
// import {
//   createAddressSchema,
//   updateAddressSchema,
// } from '../validators/address.validation';

const router = Router();
const customerCtrl = new CustomerController();
const segmentCtrl = new CustomerSegmentController();

// router.use(isAccessAllowed('CUSTOMER'));

/** CUSTOMER ROUTES */
router.get('/', customerCtrl.listCustomers);
router.get('/:id', customerCtrl.getCustomer);
router.post(
  '/',
  validateJoi(createCustomerSchema),
  customerCtrl.createCustomer
);
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

// Address routes (customer self-service)
// router.get('/me/addresses', customerCtrl.getMyAddresses);
// router.post(
//   '/me/addresses',
//   validateJoi(createAddressSchema),
//   customerCtrl.createMyAddress
// );
// router.put(
//   '/me/addresses/:id',
//   validateJoi(updateAddressSchema),
//   customerCtrl.updateMyAddress
// );
// router.delete('/me/addresses/:id', customerCtrl.deleteMyAddress);

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