import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { JwtPayload, UserRole } from '../types/common';

interface DecodedUser extends JwtPayload {
  userId: string;
  role: UserRole;
}

export const isAccessAllowed = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
        });
        return;
      }

      const token = authHeader.split(' ')[1];

      console.log(token);

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'No token provided',
        });
        return;
      }

      // Verify token using the same secret used in generateTokens
      const decoded = jwt.verify(token, config.jwt.secret) as DecodedUser;

      console.log(decoded);

      if (!decoded?.role) {
        res.status(401).json({
          success: false,
          message: 'Invalid token payload',
        });
        return;
      }

      // Role check
      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({
          success: false,
          message: `Forbidden. Requires one of: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      // Attach decoded user to request for further use
      (req as any).user = decoded;

      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
};