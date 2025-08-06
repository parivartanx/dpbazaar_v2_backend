# DPBazaar V2 Backend

A scalable and maintainable Node.js TypeScript backend built with Express.js, designed for mid to large-scale applications.

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files (database, environment, etc.)
├── controllers/     # Request handlers (HTTP layer)
├── interfaces/      # TypeScript interfaces and contracts
├── middlewares/     # Express middlewares (auth, validation, etc.)
├── models/          # Data models (MongoDB schemas, Prisma models)
├── routes/          # Route definitions and API endpoints
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
└── validators/      # Input validation schemas
```

## ✨ Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **Dual Database Support**: MongoDB (Mongoose) + PostgreSQL (Prisma)
- **Security**: Helmet, CORS, Rate limiting, JWT authentication
- **Validation**: Express-validator with custom validation schemas
- **Error Handling**: Centralized error handling with proper logging
- **Testing**: Jest setup with supertest for API testing
- **Code Quality**: ESLint + Prettier configuration
- **Environment Management**: Structured environment configuration

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (optional, for development)
- PostgreSQL (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dpbazaar_v2_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # For Prisma (PostgreSQL)
   npx prisma generate
   npx prisma db push
   
   # For MongoDB (if using)
   # Make sure MongoDB is running
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Structure Deep Dive

### Configuration (`src/config/`)

- **`environment.ts`**: Centralized environment configuration with validation
- **`database.ts`**: Database connection management (MongoDB + Prisma)

### Controllers (`src/controllers/`)

Handle HTTP requests and responses. Controllers should be thin and delegate business logic to services.

```typescript
export class AuthController {
  private authService: AuthService;

  public register = async (req: Request, res: Response): Promise<void> => {
    // Handle request, call service, return response
  };
}
```

### Services (`src/services/`)

Contain business logic and orchestrate data operations.

```typescript
export class AuthService {
  public async register(data: RegisterData): Promise<AuthResult> {
    // Business logic here
  }
}
```

### Middlewares (`src/middlewares/`)

Express middlewares for cross-cutting concerns:

- **`errorHandler.ts`**: Centralized error handling
- **`validateRequest.ts`**: Request validation middleware
- **`auth.ts`**: Authentication middleware (to be implemented)

### Routes (`src/routes/`)

API route definitions organized by feature:

- **`index.ts`**: Main router that aggregates all routes
- **`auth.routes.ts`**: Authentication endpoints
- **`user.routes.ts`**: User management endpoints
- **`product.routes.ts`**: Product-related endpoints

### Validators (`src/validators/`)

Input validation schemas using express-validator:

```typescript
export const authValidation = {
  register: [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password too short')
  ]
};
```

### Types (`src/types/`)

TypeScript type definitions:

- **`common.ts`**: Shared types and interfaces
- Domain-specific types (to be added as needed)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run dev:debug    # Start with debugger

# Building
npm run build        # Build for production
npm run clean        # Clean build artifacts

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Production
npm start            # Start production server
```

## 🏗️ Architecture Patterns

### 1. Layered Architecture

```
┌─────────────────┐
│   Controllers   │ ← HTTP Layer
├─────────────────┤
│    Services     │ ← Business Logic
├─────────────────┤
│   Repositories  │ ← Data Access
├─────────────────┤
│   Database      │ ← Data Storage
└─────────────────┘
```

### 2. Dependency Injection

Services are injected into controllers for better testability and separation of concerns.

### 3. Repository Pattern

Data access is abstracted through repository interfaces (to be implemented).

### 4. Error Handling

Centralized error handling with proper HTTP status codes and logging.

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **JWT Authentication**: Token-based authentication
- **Input Validation**: Request validation
- **Password Hashing**: bcrypt for password security

## 📊 Database Support

### MongoDB (Mongoose)

```typescript
// Example model structure
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### PostgreSQL (Prisma)

```prisma
// Example schema structure
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Testing Strategy

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows
- **Database Tests**: Test data operations

## 📈 Scalability Considerations

### For Mid-Size Applications

1. **Modular Structure**: Easy to add new features
2. **Type Safety**: Prevents runtime errors
3. **Validation**: Ensures data integrity
4. **Error Handling**: Proper error responses

### For Large-Size Applications

1. **Microservices Ready**: Structure supports service extraction
2. **Database Abstraction**: Repository pattern for data access
3. **Caching Layer**: Easy to add Redis/Memcached
4. **Message Queues**: Structure supports async processing
5. **Monitoring**: Built-in logging and error tracking

## 🚀 Deployment

### Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/dpbazaar
DATABASE_URL=postgresql://user:pass@localhost:5432/dpbazaar

# Security
JWT_SECRET=your-super-secret-key
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Build

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include validation for new endpoints
4. Write tests for new features
5. Update documentation

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support, please open an issue in the repository. 