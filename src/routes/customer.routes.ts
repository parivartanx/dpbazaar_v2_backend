import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { AddressController } from '../controllers/address.controller';
import { WalletController } from '../controllers/wallet.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  updateCustomerSchema,
} from '../validators/customer.validaton';


const router = Router();
const customerCtrl = new CustomerController();
const addressCtrl = new AddressController();
const walletCtrl = new WalletController();

// Customer Profile Management
router.get('/me/profile', customerCtrl.getMyProfile);
router.put('/me/profile', validateJoi(updateCustomerSchema), customerCtrl.updateMyProfile);

// Customer Address Management
router.get('/me/addresses', addressCtrl.getMyAddresses);
router.post('/me/addresses', addressCtrl.createMyAddress);
router.put('/me/addresses/:id', addressCtrl.updateMyAddress);
router.delete('/me/addresses/:id', addressCtrl.deleteMyAddress);

// WALLET MANAGEMENT
router.get('/me/wallets', walletCtrl.getCustomerWallets);
router.get('/me/wallet-transactions', walletCtrl.getCustomerWalletTransactions);
router.post('/me/wallets/transfer', walletCtrl.transferBetweenWallets);
router.post('/me/wallets/withdrawal', walletCtrl.withdrawFromWallet);


// Customer Referral History
// router.get('/me/referrals', referralHistoryCtrl.getCustomerReferrals);

// Customer Search History
// router.get('/me/search-history', searchHistoryCtrl.getCustomerSearchHistory);

export { router as customerRouter };