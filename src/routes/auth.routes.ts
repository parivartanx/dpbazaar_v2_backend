import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { authValidation } from '../validators/auth.validation';

const router = Router();
const authController = new AuthController();

// Authentication routes
router.post('/register', 
  validateRequest(authValidation.register),
  authController.register
);

router.post('/login', 
  validateRequest(authValidation.login),
  authController.login
);

router.post('/logout', authController.logout);

router.post('/refresh-token', 
  validateRequest(authValidation.refreshToken),
  authController.refreshToken
);

router.post('/forgot-password', 
  validateRequest(authValidation.forgotPassword),
  authController.forgotPassword
);

router.post('/reset-password', 
  validateRequest(authValidation.resetPassword),
  authController.resetPassword
);

export { router as authRoutes }; 