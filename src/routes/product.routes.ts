import { Router } from 'express';

// Controllers
import { ProductController } from '../controllers/product.controllers';
import { BrandController } from '../controllers/brand.controller';
import { CategoryController } from '../controllers/categoryController';
import { CartController } from '../controllers/cart.controller';
import { OrderController } from '../controllers/order.controller';
import { WishlistController } from '../controllers/wishlist.controller';
import { DiscountController } from '../controllers/discount.controller';
import { ProductReviewController } from '../controllers/productReview.controller';


const router = Router();

// Instantiate controllers
const productController = new ProductController();
const brandController = new BrandController();
const categoryController = new CategoryController();
const cartCtrl = new CartController();
const orderCtrl = new OrderController();
const wishlistCtrl = new WishlistController();
const discountCtrl = new DiscountController();
const productReviewCtrl = new ProductReviewController();

// ---------- PUBLIC PRODUCT ROUTES --------------
router.get('/brands', brandController.getAllBrands);
router.get('/categories', categoryController.getAllCategories);

router.get('/', productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);

// get product reviews
router.get('/:id/reviews', productReviewCtrl.getProductReviews);

// Discount Offers
router.get('/discounts', discountCtrl.getDiscountOffers);
router.get('/discounts/:code', discountCtrl.getDiscountOfferByCode);


// ---------- CUSTOMER PRIVATE PRODUCT ROUTES --------------

// Customer Wishlist
router.post('/wishlist/items', wishlistCtrl.addToWishlist);
router.delete('/wishlist/items/:productId', wishlistCtrl.removeFromWishlist);
router.get('/wishlist/items', wishlistCtrl.getWishlistItems);

// Customer Cart
router.get('/cart', cartCtrl.getCustomerCart);
router.post('/cart', cartCtrl.addToCart);
router.put('/cart', cartCtrl.updateCart);
router.delete('/cart', cartCtrl.clearCart);
router.delete('/cart/items/:productId/:variantId?', cartCtrl.removeFromCart);
router.post('/cart/buy', cartCtrl.buyProductsFromCart);

// Customer Buy Products - ORDERS
router.post('/orders', orderCtrl.createCustomerOrder);
router.get('/orders', orderCtrl.getCustomerOrders);
router.get('/orders/:id', orderCtrl.getCustomerOrderById);

// Return Requests
router.post('/returns', orderCtrl.createReturnRequest);
router.get('/returns', orderCtrl.getCustomerReturns);
router.get('/returns/:id', orderCtrl.getCustomerReturnById);

// Product Review
router.post('/reviews', productReviewCtrl.createProductReview);


export { router as productRoutes };