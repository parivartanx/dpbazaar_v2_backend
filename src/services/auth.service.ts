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
    const { firstName, lastName, email, password } = data;

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
      role: UserRole.CUSTOMER, // Always assign CUSTOMER role during registration
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
    // console.log(`auth services :- `, email, password, role);

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    // console.log(`user :- `, user);

    if (!user) {
      // console.log('User not found');
      throw new Error('Invalid credentials');
    }

    // If role is provided, check if user has that role or a higher role
    if (role) {
      console.log(`Checking role access: user role=${user.role}, requested role=${role}`);
      const hasAccess = this.hasRequiredRole(user.role as UserRole, role);
      // console.log(`Role access check result: ${hasAccess}`);
      if (!hasAccess) {
        // console.log('User does not have required role access');
        throw new Error('Invalid credentials');
      }
    }

    // Verify password using repository method
    const isPasswordValid = await this.userRepository.verifyPassword(password, user.password);
    console.log(`Password validation result: ${isPasswordValid}`);
    if (!isPasswordValid) {
      // console.log('Invalid password');
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.status || user.status !== 'ACTIVE') {
      // console.log('User account is not active');
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
        role: user.role as UserRole,
        status: user.status,
        emailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Check if user has required role or higher
   * Role hierarchy: SUPER_ADMIN > ADMIN > MANAGER > EMPLOYEE > VENDOR > CUSTOMER
   */
  private hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.EMPLOYEE,
      UserRole.VENDOR,
      UserRole.CUSTOMER
    ];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    console.log(`Role hierarchy check - userRoleIndex: ${userRoleIndex}, requiredRoleIndex: ${requiredRoleIndex}`);

    // If either role is not in hierarchy, do exact match
    if (userRoleIndex === -1 || requiredRoleIndex === -1) {
      console.log(`Exact role match: ${userRole === requiredRole}`);
      return userRole === requiredRole;
    }

    // User can access if their role is equal or higher in hierarchy
    const result = userRoleIndex <= requiredRoleIndex;
    console.log(`Hierarchy role check result: ${result}`);
    return result;
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
      role: user.role as UserRole,
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