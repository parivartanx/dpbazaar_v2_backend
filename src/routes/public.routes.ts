import { Router } from 'express';
import { BannerController } from '../controllers/banner.controller';

const router = Router();
const bannerController = new BannerController();

// Public banner routes - accessible without authentication
router.get('/banners', bannerController.getAllBanners);
router.get('/banners/:id', bannerController.getBannerById);


export { router as publicRoutes };
