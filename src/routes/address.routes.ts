import { Router } from 'express';
import { AddressController } from '../controllers/address.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createAddressSchema,
  updateAddressSchema,
} from '../validators/address.validation';

const router = Router();
const addressCtrl = new AddressController();

/** ADDRESS ROUTES */
// Admin
router.get('/', addressCtrl.listAddresses);
router.get('/:id', addressCtrl.getAddress);
router.post(
  '/',
  validateJoi(createAddressSchema),
  addressCtrl.createAddress
);
router.put(
  '/:id',
  validateJoi(updateAddressSchema),
  addressCtrl.updateAddress
);
router.delete('/:id', addressCtrl.deleteAddress);
router.post('/:id/restore', addressCtrl.restoreAddress);

// Customer (self-service)
router.get('/me', addressCtrl.getMyAddresses);
router.post(
  '/me',
  validateJoi(createAddressSchema),
  addressCtrl.createMyAddress
);
router.put(
  '/me/:id',
  validateJoi(updateAddressSchema),
  addressCtrl.updateMyAddress
);
router.delete('/me/:id', addressCtrl.deleteMyAddress);

export { router as addressRouter };