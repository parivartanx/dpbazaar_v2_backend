import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { AddressController } from '../controllers/address.controller';
import { OrderController } from '../controllers/order.controller';
import { WalletController } from '../controllers/wallet.controller';
import { UserSubscriptionCardController } from '../controllers/userSubscriptionCard.controller';
import { CartController } from '../controllers/cart.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  updateCustomerSchema,
} from '../validators/customer.validaton';

const router = Router();
const customerCtrl = new CustomerController();
const addressCtrl = new AddressController();
const orderCtrl = new OrderController();
const walletCtrl = new WalletController();
const userSubCardCtrl = new UserSubscriptionCardController();
const cartCtrl = new CartController();

// Customer Profile Management
router.get('/me/profile', customerCtrl.getMyProfile);
router.put('/me/profile', validateJoi(updateCustomerSchema), customerCtrl.updateMyProfile);

// Customer Address Management
router.get('/me/addresses', addressCtrl.getMyAddresses);
router.post('/me/addresses', addressCtrl.createMyAddress);
router.put('/me/addresses/:id', addressCtrl.updateMyAddress);
router.delete('/me/addresses/:id', addressCtrl.deleteMyAddress);


// Customer Wallet
router.get('/me/wallets', walletCtrl.getCustomerWallets);

// Customer Subscription Cards
router.get('/me/subscription-cards', userSubCardCtrl.getCustomerCards);

// Customer Cart
router.get('/me/cart', cartCtrl.getCustomerCart);
router.post('/me/cart', cartCtrl.addToCart);
router.put('/me/cart', cartCtrl.updateCart);
router.delete('/me/cart', cartCtrl.clearCart);
router.delete('/me/cart/items/:productId/:variantId?', cartCtrl.removeFromCart);
// Customer Buy Products from Cart
router.post('/me/cart/buy', cartCtrl.buyProductsFromCart);

// Customer Buy Products (Create Order)
router.post('/me/buy-products', orderCtrl.createCustomerOrder);

// Customer Order History
router.get('/me/orders', orderCtrl.getCustomerOrders);
router.get('/me/orders/:id', orderCtrl.getCustomerOrderById);

// Customer Referral History
// router.get('/me/referrals', referralHistoryCtrl.getCustomerReferrals);

// Customer Search History
// router.get('/me/search-history', searchHistoryCtrl.getCustomerSearchHistory);

export { router as customerRouter };