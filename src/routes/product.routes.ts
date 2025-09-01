import { Router } from 'express';
import multer from 'multer';

// Controllers
import { ProductController } from '../controllers/product.controllers';
import { VariantController } from '../controllers/product.controllers';
import { AttributeController } from '../controllers/product.controllers';
import { RelationController } from '../controllers/product.controllers';
// import { ReviewController } from '../controllers/product.controllers';
// import { ReportController } from '../controllers/product.controllers';

const router = Router();
const upload = multer();

// Instantiate controllers
const productController = new ProductController();
const variantController = new VariantController();
const attributeController = new AttributeController();
const relationController = new RelationController();
// const reviewController = new ReviewController();
// const reportController = new ReportController();

/**
 * PRODUCT ROUTES
 */
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.softDeleteProduct);
router.patch('/:id/restore', productController.restoreProduct);

// Images
router.post(
  '/:productId/images',
  upload.single('file'),
  productController.addImage
);
router.post(
  '/:productId/images/bulk',
  upload.array('files'),
  productController.addImagesBulk
);
router.delete('/images/:imageId', productController.deleteImage);
router.patch(
  '/:productId/images/:imageId/primary',
  productController.setPrimaryImage
);

/**
 * VARIANT ROUTES
 */
router.get('/:id/variants', variantController.getProductVariants);
router.post('/:id/variants', variantController.createVariant);
router.put('/variants/:id', variantController.updateVariant);
router.delete('/variants/:id', variantController.deleteVariant);
router.patch('/variants/:id/toggle', variantController.toggleVariantActive);

/**
 * ATTRIBUTE ROUTES
 */
router.get('/attributes', attributeController.getAllAttributes);
router.post('/attributes', attributeController.createAttribute);
router.put('/attributes/:id', attributeController.updateAttribute);
router.delete('/attributes/:id', attributeController.deleteAttribute);

// Product attributes
router.post('/:id/attributes', attributeController.addToProduct);
router.delete('/attributes/:attrId', attributeController.removeFromProduct);

// Category attributes
router.post('/categories/:id/attributes', attributeController.assignToCategory);
router.delete(
  '/categories/:id/attributes/:attrId',
  attributeController.removeFromCategory
);

/**
 * RELATION ROUTES
 */
router.get('/:id/relations', relationController.getProductRelations);
router.post('/:id/relations', relationController.createRelation);
router.delete('/relations/:id', relationController.deleteRelation);

// /**
//  * REVIEW ROUTES
//  */
// router.get('/reviews', reviewController.getAllReviews);
// router.patch('/reviews/:id/approve', reviewController.approveReview);
// router.patch('/reviews/:id/reject', reviewController.rejectReview);
// router.delete('/reviews/:id', reviewController.deleteReview);
// router.post('/reviews/:id/reply', reviewController.replyToReview);

// /**
//  * REPORT ROUTES
//  */
// router.get('/reports/sales', reportController.getSalesReport);
// router.get('/reports/best-sellers', reportController.getBestSellers);
// router.get('/reports/category-sales', reportController.getCategorySales);
// router.get('/reports/returns', reportController.getReturnsReport);

export { router as productRoutes };
