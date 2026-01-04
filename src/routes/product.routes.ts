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

// Middlewares
import { isAccessAllowed } from '../middlewares/isAccessAllowed';


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
router.post('/wishlist/items', isAccessAllowed('CUSTOMER'), wishlistCtrl.addToWishlist);
router.delete('/wishlist/items/:productId', isAccessAllowed('CUSTOMER'), wishlistCtrl.removeFromWishlist);
router.get('/wishlist/items', isAccessAllowed('CUSTOMER'), wishlistCtrl.getWishlistItems);

// Customer Cart
router.get('/cart', isAccessAllowed('CUSTOMER'), cartCtrl.getCustomerCart);
router.post('/cart', isAccessAllowed('CUSTOMER'), cartCtrl.addToCart);
router.put('/cart', isAccessAllowed('CUSTOMER'), cartCtrl.updateCart);
router.delete('/cart', isAccessAllowed('CUSTOMER'), cartCtrl.clearCart);
router.delete('/cart/items/:productId/:variantId?', isAccessAllowed('CUSTOMER'), cartCtrl.removeFromCart);
router.post('/cart/buy', isAccessAllowed('CUSTOMER'), cartCtrl.buyProductsFromCart);

// Customer Buy Products - ORDERS
router.post('/orders', isAccessAllowed('CUSTOMER'), orderCtrl.createCustomerOrder);
router.get('/orders', isAccessAllowed('CUSTOMER'), orderCtrl.getCustomerOrders);
router.get('/orders/:id', isAccessAllowed('CUSTOMER'), orderCtrl.getCustomerOrderById);

// Return Requests
router.post('/returns', isAccessAllowed('CUSTOMER'), orderCtrl.createReturnRequest);
router.get('/returns', isAccessAllowed('CUSTOMER'), orderCtrl.getCustomerReturns);
router.get('/returns/:id', isAccessAllowed('CUSTOMER'), orderCtrl.getCustomerReturnById);

// Product Review
router.post('/reviews', isAccessAllowed('CUSTOMER'), productReviewCtrl.createProductReview);


export { router as productRoutes };