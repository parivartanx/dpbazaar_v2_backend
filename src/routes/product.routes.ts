import { Router } from 'express';

const router = Router();

// Product routes will be implemented here
router.get('/', (req, res) => {
  res.json({ message: 'Products route' });
});

export { router as productRoutes }; 