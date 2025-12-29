import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { AddressController } from '../controllers/address.controller';
import { WalletController } from '../controllers/wallet.controller';
import { ReferralCodeController } from '../controllers/referralCode.controller';
import { ReferralHistoryController } from '../controllers/referralHistory.controller';

import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  updateCustomerSchema,
} from '../validators/customer.validaton';


const router = Router();
const customerCtrl = new CustomerController();
const addressCtrl = new AddressController();
const walletCtrl = new WalletController();
const referralCodeCtrl = new ReferralCodeController();
const referralHistoryCtrl = new ReferralHistoryController();

// Customer Profile Management
router.get('/me/profile', isAccessAllowed('CUSTOMER'), customerCtrl.getMyProfile);
router.put('/me/profile', isAccessAllowed('CUSTOMER'), validateJoi(updateCustomerSchema), customerCtrl.updateMyProfile);

// Customer Address Management
router.get('/me/addresses', isAccessAllowed('CUSTOMER'), addressCtrl.getMyAddresses);
router.post('/me/addresses', isAccessAllowed('CUSTOMER'), addressCtrl.createMyAddress);
router.put('/me/addresses/:id', isAccessAllowed('CUSTOMER'), addressCtrl.updateMyAddress);
router.delete('/me/addresses/:id', isAccessAllowed('CUSTOMER'), addressCtrl.deleteMyAddress);

// WALLET MANAGEMENT
router.get('/me/wallets', isAccessAllowed('CUSTOMER'), walletCtrl.getCustomerWallets);
router.get('/me/wallet-transactions', isAccessAllowed('CUSTOMER'), walletCtrl.getCustomerWalletTransactions);
router.post('/me/wallets/transfer', isAccessAllowed('CUSTOMER'), walletCtrl.transferBetweenWallets);
router.post('/me/wallets/withdrawal', isAccessAllowed('CUSTOMER'), walletCtrl.withdrawFromWallet);


// REFERRAL MANAGEMENT
router.post('/me/referral-code', isAccessAllowed('CUSTOMER'), referralCodeCtrl.createCustomerReferralCode);
router.get('/me/referral-code', isAccessAllowed('CUSTOMER'), referralCodeCtrl.getCustomerReferralCode);
router.get('/me/referrals-history', isAccessAllowed('CUSTOMER'), referralHistoryCtrl.getCustomerReferralHistory);
router.get('/me/referred-history', isAccessAllowed('CUSTOMER'), referralHistoryCtrl.getReferredUserHistory);

// use referral code
router.post('/me/referral-code/use', isAccessAllowed('CUSTOMER'), referralHistoryCtrl.useReferralCode);

export { router as customerRouter };