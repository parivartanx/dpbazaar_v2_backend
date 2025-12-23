import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createWalletSchema,
  updateWalletSchema,
} from '../validators/wallet.validation';

const router = Router();
const walletController = new WalletController();

/**
 * WALLET MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/wallets', walletController.listWallets);
router.get('/admin/wallets/:id', walletController.getWallet);
router.post('/admin/wallets', validateJoi(createWalletSchema), walletController.createWallet);
router.put('/admin/wallets/:id', validateJoi(updateWalletSchema), walletController.updateWallet);
router.delete('/admin/wallets/:id', walletController.deleteWallet);

// Customer routes
router.get('/customers/:customerId/wallets', walletController.getCustomerWallets);

export { router as walletRoutes };