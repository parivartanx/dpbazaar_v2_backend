import { Router } from 'express';
import { WalletTransactionController } from '../controllers/walletTransaction.controller';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createWalletTransactionSchema,
  updateWalletTransactionSchema,
} from '../validators/walletTransaction.validation';

const router = Router();
const walletTransactionController = new WalletTransactionController();

/**
 * WALLET TRANSACTION MANAGEMENT ROUTES
 */

// Admin routes
router.get('/admin/wallet-transactions', walletTransactionController.listTransactions);
router.get('/admin/wallet-transactions/:id', walletTransactionController.getTransaction);
router.post('/admin/wallet-transactions', validateJoi(createWalletTransactionSchema), walletTransactionController.createTransaction);
router.put('/admin/wallet-transactions/:id', validateJoi(updateWalletTransactionSchema), walletTransactionController.updateTransaction);
router.delete('/admin/wallet-transactions/:id', walletTransactionController.deleteTransaction);

// Customer routes
router.get('/wallets/:walletId/transactions', walletTransactionController.getWalletTransactions);
router.get('/customers/:customerId/transactions', walletTransactionController.getCustomerTransactions);

export { router as walletTransactionRoutes };