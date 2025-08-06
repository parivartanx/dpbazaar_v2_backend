import { Router } from 'express';

const router = Router();

// User routes will be implemented here
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile route' });
});

export { router as userRoutes }; 