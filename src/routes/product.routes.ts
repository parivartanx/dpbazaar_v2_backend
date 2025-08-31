import { Router } from 'express';
import { ProductController } from '../controllers/product.controllers';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/product.validation';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createProductSchema),
  productController.createProduct
);
router.put('/:id', isAccessAllowed('ADMIN'), productController.updateProduct);
router.delete(
  '/:id',
  isAccessAllowed('ADMIN'),
  productController.softDeleteProduct
);
router.patch(
  '/:id/restore',
  isAccessAllowed('ADMIN'),
  validateJoi(updateProductSchema),
  productController.restoreProduct
);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/brand/:id', productController.getProductsByBrand);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/best-sellers', productController.getBestSellers);
router.get('/:id/related', productController.getRelatedProducts);

// Publish product
// router.patch("/:id/publish",isAccessAllowed("ADMIN") , productController.publishProduct);

// Unpublish product
// router.patch("/:id/unpublish",isAccessAllowed("ADMIN") , productController.unpublishProduct);

export { router as productRoutes };
