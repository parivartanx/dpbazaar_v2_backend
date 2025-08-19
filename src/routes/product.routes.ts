// routes/product.routes.ts
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

// Get all products (with filters/pagination)
router.get('/', productController.getAllProducts);

// Get product by slug
router.get('/slug/:slug', productController.getProductBySlug);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create product
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createProductSchema),
  productController.createProduct
);

// Update product
router.put('/:id', isAccessAllowed('ADMIN'), productController.updateProduct);

// Publish product
// router.patch("/:id/publish",isAccessAllowed("ADMIN") , productController.publishProduct);

// Unpublish product
// router.patch("/:id/unpublish",isAccessAllowed("ADMIN") , productController.unpublishProduct);

// Soft delete product
router.delete(
  '/:id',
  isAccessAllowed('ADMIN'),
  productController.softDeleteProduct
);

// Restore soft-deleted product
router.patch(
  '/:id/restore',
  isAccessAllowed('ADMIN'),
  validateJoi(updateProductSchema),
  productController.restoreProduct
);

// Get products by category
router.get('/category/:id', productController.getProductsByCategory);

// Get products by brand
router.get('/brand/:id', productController.getProductsByBrand);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get new arrivals
router.get('/new-arrivals', productController.getNewArrivals);

// Get best sellers
router.get('/best-sellers', productController.getBestSellers);

// Get related products
router.get('/:id/related', productController.getRelatedProducts);

export { router as productRoutes };
