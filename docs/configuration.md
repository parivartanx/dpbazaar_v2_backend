# Configuration Guide

This document explains all configuration options for the DPBazaar V2 Backend application.

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

### Required Environment Variables

#### Database Configuration
```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/dpbazaar"
```

#### JWT Configuration
```env
# JWT secret for signing access tokens
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# JWT secret for signing refresh tokens
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Access token expiration time
JWT_ACCESS_EXPIRY="15m"

# Refresh token expiration time
JWT_REFRESH_EXPIRY="7d"
```

#### Server Configuration
```env
# Server port
PORT=3000

# Node environment
NODE_ENV=development
```

### Optional Environment Variables

#### Email Configuration
```env
# SMTP host (e.g., Gmail, SendGrid)
EMAIL_HOST="smtp.gmail.com"

# SMTP port
EMAIL_PORT=587

# Use secure connection (true/false)
EMAIL_SECURE=false

# Email username
EMAIL_USER="your-email@gmail.com"

# Email password or app password
EMAIL_PASS="your-app-password"
```

#### Rate Limiting
```env
# Maximum requests per IP per window
RATE_LIMIT_MAX=100
```

#### CORS Configuration
```env
# Allowed origins (comma-separated)
CORS_ORIGIN="*"

# Allow credentials
CORS_CREDENTIALS=false
```

#### Logging
```env
# Log level (error, warn, info, http, debug)
LOG_LEVEL="info"
```

#### Security
```env
# Bcrypt rounds for password hashing
BCRYPT_ROUNDS=12
```

## Configuration Structure

The application uses a centralized configuration system located in `src/config/environment.ts`:

```typescript
export const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/dpbazaar',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  
  // Email configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
  },
};
```

## Environment-Specific Configurations

### Development Environment

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
CORS_ORIGIN=*
DATABASE_URL=postgresql://localhost:5432/dpbazaar_dev
JWT_SECRET=dev-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret
```

### Production Environment

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://prod-user:prod-password@prod-host:5432/dpbazaar_prod
JWT_SECRET=your-super-secure-production-secret
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret
EMAIL_HOST=smtp.sendgrid.net
EMAIL_USER=your-sendgrid-username
EMAIL_PASS=your-sendgrid-api-key
RATE_LIMIT_MAX=50
```

### Testing Environment

```env
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
DATABASE_URL=postgresql://localhost:5432/dpbazaar_test
JWT_SECRET=test-secret-key
JWT_REFRESH_SECRET=test-refresh-secret
```

## Security Considerations

### JWT Secrets

- **Never use default secrets in production**
- **Use strong, random secrets** (at least 32 characters)
- **Keep secrets secure** and never commit them to version control
- **Rotate secrets regularly** for enhanced security

### Database Security

- **Use strong passwords** for database users
- **Limit database access** to necessary IP addresses
- **Use SSL connections** in production
- **Regular backups** of your database

### Email Configuration

- **Use app passwords** instead of regular passwords for Gmail
- **Use dedicated email services** like SendGrid for production
- **Verify email domains** to improve deliverability

## Configuration Validation

The application validates required environment variables on startup:

```typescript
const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'DATABASE_URL',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Using default value.`);
  }
}
```

## Configuration Best Practices

### 1. Environment Separation

- Use different configuration files for different environments
- Never use production secrets in development
- Use environment-specific databases

### 2. Secret Management

- Use environment variables for all secrets
- Consider using secret management services in production
- Rotate secrets regularly

### 3. Validation

- Validate all configuration values on startup
- Provide meaningful default values
- Log configuration warnings

### 4. Security

- Use HTTPS in production
- Configure CORS properly
- Set appropriate rate limits
- Use secure database connections

## Example .env Files

### Development (.env.development)
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
CORS_ORIGIN=*
DATABASE_URL=postgresql://localhost:5432/dpbazaar_dev
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=dev@example.com
EMAIL_PASS=dev-app-password
RATE_LIMIT_MAX=100
CORS_CREDENTIALS=false
LOG_LEVEL=debug
BCRYPT_ROUNDS=12
```

### Production (.env.production)
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true
DATABASE_URL=postgresql://prod-user:prod-password@prod-host:5432/dpbazaar_prod
JWT_SECRET=your-super-secure-production-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-production-refresh-secret-key-here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
RATE_LIMIT_MAX=50
BCRYPT_ROUNDS=12
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify database server is running
   - Check network connectivity

2. **JWT Token Issues**
   - Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
   - Check token expiration times
   - Ensure secrets are consistent across restarts

3. **Email Not Sending**
   - Verify email credentials
   - Check SMTP settings
   - Test with a simple email client

4. **CORS Issues**
   - Check `CORS_ORIGIN` setting
   - Verify frontend domain is included
   - Test with different browsers

### Debug Mode

Enable debug logging by setting:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

This will provide detailed information about configuration loading and application startup.

## Configuration Updates

When adding new configuration options:

1. **Add to environment.ts** with proper typing
2. **Provide default values** for optional settings
3. **Update documentation** (this file)
4. **Add validation** if required
5. **Test in all environments**

## References

- [Node.js Environment Variables](https://nodejs.org/api/process.html#processenv)
- [Express.js Configuration](https://expressjs.com/en/advanced/best-practices-performance.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Database Security](https://www.postgresql.org/docs/current/security.html) 