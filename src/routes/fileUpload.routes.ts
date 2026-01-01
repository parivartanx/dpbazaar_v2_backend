import { Router } from 'express';
import { FileUploadController } from '../controllers/fileUpload.controller';
import { validateJoi } from '../middlewares/validateJoi';
import { fileUploadValidation } from '../validators/fileUpload.validation';
import { checkPermission } from '../middlewares/checkPermission';

const router = Router();
const fileUploadController = new FileUploadController();

// Public routes - for pre-signed URL generation
router.post('/presigned-url', validateJoi(fileUploadValidation.generatePresignedUrl), fileUploadController.generatePresignedUploadUrl);

// Get signed URL for a file key
router.get('/signed-url/:key', fileUploadController.getSignedUrl);

// Delete file (admin only)
router.delete('/:key', 
  checkPermission('USERS', 'DELETE'), 
  fileUploadController.deleteFile
);

export { router as fileUploadRoutes };