import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/dpbazaar',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/dpbazaar',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // Security Configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Email Configuration (if needed)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // File Upload Configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  
  // External APIs
  EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Using default value.`);
  }
}

export type Config = typeof config; 