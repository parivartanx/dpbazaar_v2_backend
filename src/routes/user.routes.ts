import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { isAccessAllowed } from '../middlewares/isAccessAllowed';
import { validateJoi } from '../middlewares/validateJoi';
import {
  createUserSchema,
  updateUserSchema,
  lockUserSchema,
  resetPasswordSchema,
} from '../validators/user.validaton';

const router = Router();
const userController = new UserController();

/**
 * FOR ADMIN END
 */

router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.post(
  '/',
  isAccessAllowed('ADMIN'),
  validateJoi(createUserSchema),
  userController.createUser
);
router.put(
  '/:id',
  isAccessAllowed('ADMIN'),
  validateJoi(updateUserSchema),
  userController.updateUser
);
router.delete('/:id', isAccessAllowed('ADMIN'), userController.deleteUser);
router.patch(
  '/:id/restore',
  isAccessAllowed('ADMIN'),
  userController.restoreUser
);

// // Account management
router.patch(
  '/:id/lock',
  isAccessAllowed('ADMIN'),
  validateJoi(lockUserSchema),
  userController.lockUser
);
router.patch(
  '/:id/unlock',
  isAccessAllowed('ADMIN'),
  userController.unlockUser
);
router.patch(
  '/:id/reset-password',
  isAccessAllowed('ADMIN'),
  validateJoi(resetPasswordSchema),
  userController.resetPassword
);

export default router;
