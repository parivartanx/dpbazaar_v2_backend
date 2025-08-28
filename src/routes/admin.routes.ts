import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();
const adminController = new AdminController();

/**
 * USER MANAGEMENT
 */
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

/**
 * EMPLOYEE MANAGEMENT
 */
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getAllEmployees);
router.get('/employees/:id', adminController.getEmployeeById);
router.put('/employees/:id', adminController.updateEmployee);
router.patch('/employees/:id/status', adminController.updateEmployeeStatus);
router.delete('/employees/:id', adminController.deleteEmployee);

/**
 * EMPLOYEE PERMISSIONS
 */
router.get('/employees/:id/permissions', adminController.getEmployeePermissions);
router.post('/employees/:id/permissions', adminController.assignPermission);
router.delete('/employees/:id/permissions/:permissionId', adminController.revokePermission);

export { router as adminRoutes };
