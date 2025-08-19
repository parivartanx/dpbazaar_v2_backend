# Setup Guide

## Quick Start

This guide will help you set up the DPBazaar V2 Backend project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **PostgreSQL**: Version 12 or higher
- **Git**: For version control

### Checking Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check if PostgreSQL is installed
psql --version
```

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dpbazaar_v2_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/dpbazaar"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Email Configuration
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Rate Limiting
RATE_LIMIT_MAX=100

# CORS Configuration
CORS_ORIGIN="*"
CORS_CREDENTIALS=false

# Logging
LOG_LEVEL="info"

# Security
BCRYPT_ROUNDS=12
```

### 4. Set Up Database

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dpbazaar;

# Create user (optional)
CREATE USER dpbazaar_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dpbazaar TO dpbazaar_user;

# Exit PostgreSQL
\q
```

#### Update Database URL

Update your `.env` file with the correct database URL:

```env
DATABASE_URL="postgresql://dpbazaar_user:your_password@localhost:5432/dpbazaar"
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run Database Migrations

```bash
npx prisma migrate dev
```

### 7. Start the Development Server

```bash
npm run dev
```

The server should now be running on `http://localhost:3000`.

## Verification

### 1. Check Server Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test API Endpoints

#### Register a User

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

## Development Tools

### 1. VS Code Extensions

Install these VS Code extensions for better development experience:

- **TypeScript and JavaScript Language Features**
- **ESLint**
- **Prettier**
- **Prisma**
- **Thunder Client** (for API testing)

### 2. Database Management

#### Prisma Studio

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` for database management.

#### pgAdmin

Install pgAdmin for PostgreSQL management:
- Download from: https://www.pgadmin.org/download/
- Connect to your local PostgreSQL instance

### 3. API Testing

#### Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create a new collection
3. Import the API endpoints
4. Test the endpoints

#### Postman

1. Download Postman
2. Create a new collection
3. Add the API endpoints
4. Test the endpoints

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

#### 2. Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Check database connection
psql -U dpbazaar_user -d dpbazaar -h localhost
```

#### 3. Permission Issues

```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use nvm to manage Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 4. TypeScript Errors

```bash
# Check TypeScript errors
npm run build

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Environment-Specific Issues

#### Windows

```bash
# Install PostgreSQL on Windows
# Download from: https://www.postgresql.org/download/windows/

# Add PostgreSQL to PATH
# C:\Program Files\PostgreSQL\14\bin

# Use Windows Subsystem for Linux (WSL) for better development experience
```

#### macOS

```bash
# Install PostgreSQL using Homebrew
brew install postgresql
brew services start postgresql

# Install Node.js using Homebrew
brew install node
```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql
```

## Next Steps

After successful setup:

1. **Read the Documentation**:
   - [API Documentation](./api-documentation.md)
   - [Development Guide](./development-guide.md)
   - [Architecture Documentation](./architecture.md)

2. **Explore the Codebase**:
   - Check the project structure
   - Review the authentication system
   - Understand the validation system

3. **Start Developing**:
   - Create a feature branch
   - Follow the development workflow
   - Write tests for your features

4. **Join the Team**:
   - Review the contributing guidelines
   - Set up your development environment
   - Start contributing to the project

## Support

If you encounter any issues during setup:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Current Implementation Status](./current-implementation.md)
3. Check existing [Issues](../../issues)
4. Create a new [Issue](../../issues/new) with detailed information

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3000 | No |
| `NODE_ENV` | Environment | development | No |
| `DATABASE_URL` | Database connection | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - | Yes |
| `JWT_ACCESS_EXPIRY` | Access token expiry | 15m | No |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | 7d | No |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com | No |
| `EMAIL_PORT` | SMTP port | 587 | No |
| `EMAIL_SECURE` | Use secure connection | false | No |
| `EMAIL_USER` | Email username | - | No |
| `EMAIL_PASS` | Email password | - | No |
| `RATE_LIMIT_MAX` | Rate limit requests | 100 | No |
| `CORS_ORIGIN` | CORS origin | * | No |
| `CORS_CREDENTIALS` | Allow credentials | false | No |
| `LOG_LEVEL` | Log level | info | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | No |

This setup guide should get you up and running with the DPBazaar V2 Backend project quickly and efficiently. 