import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Interface for database configuration
 */
interface IDatabaseConfig {
  url: string;
}

/**
 * Interface for JWT configuration
 */
interface IJwtConfig {
  secret: string;
  refreshSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

/**
 * Interface for email configuration
 */
interface IEmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

/**
 * Interface for rate limit configuration
 */
interface IRateLimitConfig {
  windowMs: number;
  max: number;
}

/**
 * Interface for CORS configuration
 */
interface ICorsConfig {
  origin: string;
  credentials: boolean;
}

/**
 * Interface for logging configuration
 */
interface ILoggingConfig {
  level: string;
}

/**
 * Interface for security configuration
 */
interface ISecurityConfig {
  bcryptRounds: number;
}

/**
 * Interface for the complete environment configuration
 */
interface IEnvironmentConfig {
  port: number;
  nodeEnv: string;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
  email: IEmailConfig;
  rateLimit: IRateLimitConfig;
  cors: ICorsConfig;
  logging: ILoggingConfig;
  security: ISecurityConfig;
}

/**
 * Environment configuration class that handles loading and validation of environment variables
 */
class EnvironmentConfig implements IEnvironmentConfig {
  public readonly port: number;
  public readonly nodeEnv: string;
  public readonly database: IDatabaseConfig;
  public readonly jwt: IJwtConfig;
  public readonly email: IEmailConfig;
  public readonly rateLimit: IRateLimitConfig;
  public readonly cors: ICorsConfig;
  public readonly logging: ILoggingConfig;
  public readonly security: ISecurityConfig;

  constructor() {
    // Validate required environment variables first
    this.validateRequiredEnvVars();

    // Initialize configuration
    this.port = this.getNumberFromEnv('PORT', 3000);
    this.nodeEnv = this.getStringFromEnv('NODE_ENV', 'development');
    
    this.database = {
      url: this.getStringFromEnv('DATABASE_URL', 'postgresql://localhost:5432/dpbazaar'),
    };
    
    this.jwt = {
      secret: this.getStringFromEnv('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
      refreshSecret: this.getStringFromEnv('JWT_REFRESH_SECRET', 'your-super-secret-refresh-key-change-in-production'),
      accessTokenExpiry: this.getStringFromEnv('JWT_ACCESS_EXPIRY', '15m'),
      refreshTokenExpiry: this.getStringFromEnv('JWT_REFRESH_EXPIRY', '7d'),
    };
    
    this.email = {
      host: this.getStringFromEnv('EMAIL_HOST', 'smtp.gmail.com'),
      port: this.getNumberFromEnv('EMAIL_PORT', 587),
      secure: this.getBooleanFromEnv('EMAIL_SECURE', false),
      user: this.getStringFromEnv('EMAIL_USER', ''),
      pass: this.getStringFromEnv('EMAIL_PASS', ''),
    };
    
    this.rateLimit = {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: this.getNumberFromEnv('RATE_LIMIT_MAX', 100),
    };
    
    this.cors = {
      origin: this.getStringFromEnv('CORS_ORIGIN', '*'),
      credentials: this.getBooleanFromEnv('CORS_CREDENTIALS', false),
    };
    
    this.logging = {
      level: this.getStringFromEnv('LOG_LEVEL', 'info'),
    };
    
    this.security = {
      bcryptRounds: this.getNumberFromEnv('BCRYPT_ROUNDS', 12),
    };

    // Validate configuration after initialization
    this.validateConfiguration();
  }

  /**
   * Get string value from environment variables with default fallback
   */
  private getStringFromEnv(key: string, defaultValue: string): string {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Get number value from environment variables with default fallback
   */
  private getNumberFromEnv(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      console.warn(`Warning: ${key} is not a valid number. Using default value: ${defaultValue}`);
      return defaultValue;
    }
    
    return parsed;
  }

  /**
   * Get boolean value from environment variables with default fallback
   */
  private getBooleanFromEnv(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    
    return value.toLowerCase() === 'true';
  }

  /**
   * Validate required environment variables
   */
  private validateRequiredEnvVars(): void {
    const requiredEnvVars = [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'DATABASE_URL',
    ];

    const missingVars: string[] = [];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0 && this.nodeEnv === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    if (missingVars.length > 0) {
      console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}. Using default values.`);
    }
  }

  /**
   * Validate configuration values
   */
  private validateConfiguration(): void {
    // Validate port range
    if (this.port < 1 || this.port > 65535) {
      throw new Error(`Invalid port number: ${this.port}. Port must be between 1 and 65535.`);
    }

    // Validate node environment
    const validEnvironments = ['development', 'production', 'test'];
    if (!validEnvironments.includes(this.nodeEnv)) {
      console.warn(`Warning: Invalid NODE_ENV: ${this.nodeEnv}. Valid values are: ${validEnvironments.join(', ')}`);
    }

    // Validate email port range
    if (this.email.port < 1 || this.email.port > 65535) {
      throw new Error(`Invalid email port number: ${this.email.port}. Port must be between 1 and 65535.`);
    }

    // Validate bcrypt rounds
    if (this.security.bcryptRounds < 4 || this.security.bcryptRounds > 31) {
      throw new Error(`Invalid bcrypt rounds: ${this.security.bcryptRounds}. Rounds must be between 4 and 31.`);
    }

    // Validate rate limit max
    if (this.rateLimit.max < 1) {
      throw new Error(`Invalid rate limit max: ${this.rateLimit.max}. Must be greater than 0.`);
    }

    // Validate JWT secrets in production
    if (this.nodeEnv === 'production') {
      if (this.jwt.secret.includes('your-super-secret') || this.jwt.refreshSecret.includes('your-super-secret')) {
        throw new Error('Default JWT secrets detected in production environment. Please set proper JWT_SECRET and JWT_REFRESH_SECRET.');
      }
    }
  }

  /**
   * Check if the application is running in development mode
   */
  public isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  /**
   * Check if the application is running in production mode
   */
  public isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  /**
   * Check if the application is running in test mode
   */
  public isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  /**
   * Get the database URL
   */
  public getDatabaseUrl(): string {
    return this.database.url;
  }

  /**
   * Get JWT configuration
   */
  public getJwtConfig(): IJwtConfig {
    return { ...this.jwt };
  }

  /**
   * Get email configuration
   */
  public getEmailConfig(): IEmailConfig {
    return { ...this.email };
  }
}

// Create and export a singleton instance of the configuration
export const config = new EnvironmentConfig();
export { EnvironmentConfig, type IEnvironmentConfig }; 