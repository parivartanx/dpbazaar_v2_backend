import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/common';
import { UserRepository } from '../repositories/prisma/UserRepository';
import { FirebaseService } from '../services/firebase.service';
import { smsService } from '../services/sms.service';
import { prisma } from '../config/prismaClient';

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
      const { email, password, role } = req.body;
      console.log('Login request received:', req.body);

      if (!email || !password || !role) {
        throw new Error('Email, password and role are required');
      }

      const result = await this.authService.login({ email, password, role });

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
      const authheader = req.headers.authorization;
      const refreshToken = authheader && authheader.split(' ')[1];

      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }

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

  // Send OTP for mobile login
  public sendMobileOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone } = req.body;

      if (!phone) {
        const response: ApiResponse = {
          success: false,
          error: 'Phone number is required',
          message: 'Phone number is required to send OTP',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set OTP to expire in 5 minutes
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);
      
      // Save OTP in database
      
      // Check if an OTP record already exists for this phone and type
      const existingOtp = await prisma.otp.findFirst({
        where: {
          phone: phone,
          type: 'LOGIN',
        }
      });
      
      if (existingOtp) {
        // Update the existing OTP record
        await prisma.otp.update({
          where: { id: existingOtp.id },
          data: {
            otp,
            status: 'PENDING',
            expiresAt,
            updatedAt: new Date(),
          }
        });
      } else {
        // Create a new OTP record
        await prisma.otp.create({
          data: {
            phone: phone,
            otp,
            type: 'LOGIN',
            status: 'PENDING',
            expiresAt,
          }
        });
      }
      
      let response: ApiResponse;
      
      // Send OTP via SMS service
      try {
        await smsService.sendOtp(phone, otp);
        
        response = {
          success: true,
          data: {
            message: 'OTP sent successfully',
            phone: phone,
            // In production, we would not return the OTP in the response
            // For development/testing purposes only
            otp: otp,
          },
          message: 'OTP sent successfully',
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        logger.error(`Failed to send OTP via SMS: ${error}`);
        
        // In case of SMS failure, still return success but log the error
        response = {
          success: true,
          data: {
            message: 'OTP generated but SMS sending failed',
            phone: phone,
            // Still return OTP for development/testing purposes
            otp: otp,
          },
          message: 'OTP generated but SMS sending failed',
          timestamp: new Date().toISOString(),
        };
      }
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in sendMobileOtp: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in sending OTP',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Verify mobile OTP and login
  public verifyMobileOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        const response: ApiResponse = {
          success: false,
          error: 'Phone number and OTP are required',
          message: 'Phone number and OTP are required to verify',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
            
      
      // Find the OTP record
      const otpRecord = await prisma.otp.findFirst({
        where: {
          phone: phone,
          otp: otp,
          type: 'LOGIN',
          status: 'PENDING',
          expiresAt: {
            gte: new Date() // Not expired
          }
        }
      });
      
      if (!otpRecord) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid or expired OTP',
          message: 'The OTP provided is invalid, expired, or already used',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find or create user based on phone number
      let user = await this.authService.userRepository.findFirst({
        where: { 
          phone: phone,
        }
      });
      
      let newRegistration = false;
      if (!user) {
        // Create a new user if doesn't exist
        user = await this.authService.userRepository.create({
          firstName: 'User',
          lastName: '',
          email: `user_${phone}@example.com`, // Generate email from phone
          password: 'defaultPassword123', // Repository handles hashing
          role: 'CUSTOMER',
          isEmailVerified: false,
        });
        
        // Update phone number after user creation
        user = await this.authService.userRepository.update(user.id, {
          phone: phone,
          isPhoneVerified: true,
        });
        
        // Create customer profile
        await this.authService.userRepository.createCustomer({
          userId: user.id,
          customerCode: `CUST${Date.now()}`,
        });
        
        newRegistration = true;
      }
      
      // Update the OTP record to mark as verified
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          updatedAt: new Date(),
        }
      });
      
      // Generate tokens for the user
      const result = await this.authService.generateTokens(user);
      
      const response: ApiResponse = {
        success: true,
        data: {
          ...result,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          newRegistration,
        },
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in verifyMobileOtp: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in verifying OTP',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Google/Firebase login
  public loginWithGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Google ID token is required',
          message: 'Google ID token is required for login',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Verify the ID token using Firebase service
      let decodedToken;
      try {
        const firebaseService = FirebaseService.getInstance();
        decodedToken = await firebaseService.verifyIdToken(idToken);
      } catch (verifyError) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid Google ID token',
          message: 'The Google ID token provided is invalid',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Get user info from decoded token
      const googleUser = {
        email: decodedToken.email,
        firstName: decodedToken.name?.split(' ')[0] || 'Google',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || 'User',
        googleId: decodedToken.sub,
        emailVerified: decodedToken.email_verified || false,
      };
      
      if (!googleUser.email) {
        const response: ApiResponse = {
          success: false,
          error: 'Email not found in Google token',
          message: 'Email is required for Google login',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }
      
      // Find or create user based on email
      let user = await this.authService.userRepository.findFirst({
        where: { 
          email: googleUser.email,
        },
      });
      
      let newRegistration = false;
      if (!user) {
        // Create a new user if doesn't exist
        user = await this.authService.userRepository.create({
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          password: 'google_auth_password', // Repository handles hashing
          role: 'CUSTOMER',
          isEmailVerified: googleUser.emailVerified,
        });
        
        // Create customer profile
        await this.authService.userRepository.createCustomer({
          userId: user.id,
          customerCode: `CUST${Date.now()}`,
        });
        
        newRegistration = true;
      }
      
      // Generate tokens for the user
      const result = await this.authService.generateTokens(user);
      
      const response: ApiResponse = {
        success: true,
        data: {
          ...result,
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          newRegistration,
        },
        message: 'Google login successful',
        timestamp: new Date().toISOString(),
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error in loginWithGoogle: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Google login failed',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
