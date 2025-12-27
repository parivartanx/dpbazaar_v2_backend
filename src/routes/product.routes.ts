import { Router } from 'express';

// Controllers
import { ProductController } from '../controllers/product.controllers';
import { VariantController } from '../controllers/product.controllers';
import { BrandController } from '../controllers/brand.controller';
import { CategoryController } from '../controllers/categoryController';
import { CartController } from '../controllers/cart.controller';
import { OrderController } from '../controllers/order.controller';
import { WishlistController } from '../controllers/wishlist.controller';

const router = Router();

// Instantiate controllers
const productController = new ProductController();
const variantController = new VariantController();
const brandController = new BrandController();
const categoryController = new CategoryController();
const cartCtrl = new CartController();
const orderCtrl = new OrderController();
const wishlistCtrl = new WishlistController();

// ---------- PUBLIC PRODUCT ROUTES --------------
router.get('/brands', brandController.getAllBrands);
router.get('/categories', categoryController.getAllCategories);

router.get('/', productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);

router.get('/:id/variants', variantController.getProductVariants);


// ---------- CUSTOMER PRIVATE PRODUCT ROUTES --------------

// Customer Wishlist
router.post('/wishlist/:wishlistId/items', wishlistCtrl.addToWishlist);
router.delete('/wishlist/:wishlistId/items/:productId', wishlistCtrl.removeFromWishlist);
router.get('/wishlist/:wishlistId/items', wishlistCtrl.getWishlistItems);

// Customer Cart
router.get('/cart', cartCtrl.getCustomerCart);
router.post('/cart', cartCtrl.addToCart);
router.put('/cart', cartCtrl.updateCart);
router.delete('/cart', cartCtrl.clearCart);
router.delete('/cart/items/:productId/:variantId?', cartCtrl.removeFromCart);

// Customer Buy Products from Cart
router.post('/cart/buy', cartCtrl.buyProductsFromCart);

// Customer Buy Products (Create Order)
router.post('/buy-products', orderCtrl.createCustomerOrder);

// Customer Order History
router.get('/orders', orderCtrl.getCustomerOrders);
router.get('/orders/:id', orderCtrl.getCustomerOrderById);

export { router as productRoutes };