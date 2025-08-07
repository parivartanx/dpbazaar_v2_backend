import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/common';
import { UserRepository } from '../repositories/prisma/UserRepository';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new UserRepository());
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const result = await this.authService.register({
        firstName,
        lastName,
        email,
        password,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'User registered successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error(`Registration error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
        message: 'Registration failed',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Login error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        message: 'Login failed',
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Implementation for logout
      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Logout error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: 'Logout failed',
        message: 'Logout failed',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const result = await this.authService.refreshToken(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Token refreshed successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Token refresh error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
        message: 'Token refresh failed',
        timestamp: new Date().toISOString(),
      };

      res.status(401).json(response);
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      await this.authService.forgotPassword(email);

      const response: ApiResponse = {
        success: true,
        message: 'Password reset email sent',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Forgot password error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to send reset email',
        message: 'Failed to send reset email',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      await this.authService.resetPassword(token, password);

      const response: ApiResponse = {
        success: true,
        message: 'Password reset successful',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error(`Reset password error: ${error}`);

      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
        message: 'Password reset failed',
        timestamp: new Date().toISOString(),
      };

      res.status(400).json(response);
    }
  };
}
