// import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';
import { User, UserRole, JwtPayload, LoginUser } from '../types/common';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginData {
  email: string;
  password: string;
  role?: UserRole;
}

interface AuthResult {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  // In a real application, you would inject the user repository
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async register(data: RegisterData): Promise<AuthResult> {
    const { firstName, lastName, email, password, role } = data;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user (password will be hashed in repository)
    const savedUser = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password, // Repository handles hashing
      role: role || UserRole.CUSTOMER,
    });

    if (!savedUser) {
      throw new Error('User registration failed');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(savedUser);

    return {
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
        emailVerified: savedUser.isEmailVerified,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  public async login(data: LoginData): Promise<AuthResult> {
    const { email, password, role } = data;
    console.log(`auth services :- `, email, password, role);

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    console.log(`user :- `, user);

    if (!user || user.role !== role) {
      throw new Error('Invalid credentials');
    }

    // Verify password using repository method
    const isPasswordValid = await this.userRepository.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.status || user.status !== 'ACTIVE') {
      throw new Error('Account is deactivated');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        emailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as JwtPayload;

      // Find user
      const user = await this.userRepository.findById(decoded.userId);
      if (!user || !user.status || user.status !== 'ACTIVE') {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = jwt.sign(
        {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.accessTokenExpiry } as SignOptions
      );

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      //   // Don't reveal if user exists or not
      return;
    }

    // Generate reset token
    jwt.sign({ email, type: 'password-reset' }, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    } as SignOptions);

    // Save reset token to database
    // await this.userRepository.updateResetToken(user.id, resetToken);

    // Send email with reset link
    // await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Verify reset token
      const decoded = jwt.verify(token, config.jwt.secret) as any;

      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid reset token');
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) {
        throw new Error('User not found');
      }

      // Update password (repository handles hashing)
      await this.userRepository.updatePassword(user.id, newPassword);
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }

  private generateTokens(user: LoginUser): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpiry,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    } as SignOptions);

    return { accessToken, refreshToken };
  }
}
