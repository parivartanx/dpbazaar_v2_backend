import { Request, Response, NextFunction } from 'express';
import { PermissionAction } from '@prisma/client';
import { UserRole } from '../types/common';
import { prisma } from '../config/prismaClient';

export const checkPermission = (resource: string, action: PermissionAction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      // 1. Super Admin / Admin bypass
      if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
        return next();
      }

      // 2. Check Employee Record
      const employee = await prisma.employee.findUnique({
        where: { userId: user.userId },
        include: {
          permissions: {
            include: {
              permission: true
            }
          }
        }
      });

      if (!employee) {
        return res.status(403).json({ success: false, message: 'Access denied. Not an employee.' });
      }

      // 3. Check Permissions
      const hasPermission = employee.permissions.some(ep => {
        // Check expiration
        if (ep.expiresAt && new Date() > ep.expiresAt) {
            return false;
        }
        
        return ep.permission.resource === resource && ep.permission.action === action;
      });

      if (!hasPermission) {
        return res.status(403).json({ 
            success: false, 
            message: `Access denied. Missing permission: ${action} ${resource}` 
        });
      }

      next();

    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ success: false, message: 'Internal server error during permission check' });
    }
  };
};
