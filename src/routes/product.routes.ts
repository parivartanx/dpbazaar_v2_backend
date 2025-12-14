import { Router } from 'express';
import multer from 'multer';

// Controllers
import { ProductController } from '../controllers/product.controllers';
import { VariantController } from '../controllers/product.controllers';
import { AttributeController } from '../controllers/product.controllers';
import { RelationController } from '../controllers/product.controllers';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
} from '../validators/product.validation';
import {
  createAttributeSchema,
  updateAttributeSchema,
  addProductAttributeSchema,
  assignCategoryAttributeSchema,
} from '../validators/attribute.validaton';
import { createRelationSchema } from '../validators/relation.validaton';
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
router.get('/filtered', productController.getProductsFiltered);
router.get('/dashboard-stats', productController.getDashboardStats);
router.get('/', productController.getAllProducts);
// More specific route pattern to avoid conflicts with static routes
router.get('/:id([0-9a-fA-F-]+)', productController.getProductById);
router.post('/', validateJoi(createProductSchema), productController.createProduct);
router.put('/:id', validateJoi(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.softDeleteProduct);
router.patch('/:id/restore', productController.restoreProduct);

// Images
router.post('/:productId/images',upload.single('file'),productController.addImage);
router.post('/:productId/images/bulk',upload.array('files'),productController.addImagesBulk);
router.delete('/images/:imageId', productController.deleteImage);
router.patch('/:productId/images/:imageId/primary',productController.setPrimaryImage);

/**
 * VARIANT ROUTES
 */
router.get('/:id/variants', variantController.getProductVariants);
router.post('/:id/variants', validateJoi(createVariantSchema), variantController.createVariant);
router.put('/variants/:id', validateJoi(updateVariantSchema), variantController.updateVariant);
router.delete('/variants/:id', variantController.deleteVariant);
router.patch('/variants/:id/toggle', variantController.toggleVariantActive);

/**
 * ATTRIBUTE ROUTES
 */
router.get('/attributes', attributeController.getAllAttributes);
router.post('/attributes', validateJoi(createAttributeSchema), attributeController.createAttribute);
router.put('/attributes/:id', validateJoi(updateAttributeSchema), attributeController.updateAttribute);
router.delete('/attributes/:id', attributeController.deleteAttribute);

// Product attributes
router.post('/:id/attributes', validateJoi(addProductAttributeSchema), attributeController.addToProduct);
router.delete('/attributes/:attrId', attributeController.removeFromProduct);

// Category attributes
router.post('/categories/:id/attributes', validateJoi(assignCategoryAttributeSchema), attributeController.assignToCategory);
router.delete('/categories/:id/attributes/:attrId',attributeController.removeFromCategory);

/**
 * RELATION ROUTES
 */
router.get('/:id/relations', relationController.getProductRelations);
router.post('/:id/relations', validateJoi(createRelationSchema), relationController.createRelation);
router.delete('/relations/:id', relationController.deleteRelation);

/**
 * REVIEW ROUTES
 */
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
