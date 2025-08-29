import { Router } from 'express';
import { BrandController } from '../controllers/brand.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createBrandSchema,
  updateBrandSchema,
} from '../validators/brand.validaton';

const router = Router();
const brandController = new BrandController();

/**
 * BRAND MANAGEMENT (Admin Access)
 */
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createBrandSchema),
  brandController.createBrand
);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.put(
  '/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateBrandSchema),
  brandController.updateBrand
);
router.delete('/:id', isAccessAllowed('ADMIN'), brandController.deleteBrand);

export { router as brandRoutes };
