# Development Guide

## Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **PostgreSQL**: Version 12 or higher
- **Git**: For version control

### Development Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dpbazaar_v2_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb dpbazaar_dev
   
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Code Style and Standards

#### TypeScript Guidelines

- Use **strict TypeScript** configuration
- Define proper types and interfaces
- Use `interface` for object shapes, `type` for unions
- Prefer `const` over `let`, avoid `var`
- Use async/await over Promises

#### Naming Conventions

- **Files**: kebab-case (`auth.controller.ts`)
- **Classes**: PascalCase (`AuthController`)
- **Functions/Variables**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Interfaces**: PascalCase with 'I' prefix (`IUser`)
- **Types**: PascalCase (`UserRole`)

#### Code Organization

- One class/interface per file
- Group related functionality
- Keep functions small (max 20-30 lines)
- Use meaningful names
- Add JSDoc comments for public APIs

### 2. Git Workflow

#### Branch Naming

```
feature/user-authentication
bugfix/jwt-token-expiry
hotfix/security-vulnerability
docs/api-documentation
```

#### Commit Messages

Use conventional commit format:

```
feat: add user registration endpoint
fix: resolve JWT token validation issue
docs: update API documentation
refactor: improve error handling
test: add unit tests for auth service
```

#### Pull Request Process

1. Create feature branch from `main`
2. Make changes following coding standards
3. Write/update tests
4. Update documentation
5. Create pull request
6. Code review and approval
7. Merge to main

### 3. Testing

#### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.service.test.ts
```

#### Test Structure

```typescript
describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Test implementation
    });

    it('should throw error for existing email', async () => {
      // Test implementation
    });
  });
});
```

#### Testing Guidelines

- **Unit tests** for services and utilities
- **Integration tests** for API endpoints
- **Mock external dependencies**
- **Test both success and error scenarios**
- **Maintain high test coverage**

### 4. API Development

#### Adding New Endpoints

1. **Create controller method**
   ```typescript
   export class UserController {
     public getUser = async (req: Request, res: Response): Promise<void> => {
       try {
         const { id } = req.params;
         const user = await this.userService.getUserById(id);
         
         const response: ApiResponse = {
           success: true,
           data: user,
           message: 'User retrieved successfully',
           timestamp: new Date().toISOString(),
         };
         
         res.status(200).json(response);
       } catch (error) {
         // Error handling
       }
     };
   }
   ```

2. **Add service method**
   ```typescript
   export class UserService {
     public async getUserById(id: string): Promise<User> {
       // Business logic implementation
     }
   }
   ```

3. **Create validation schema**
   ```typescript
   export const userValidation = {
     getUser: [
       param('id').isUUID().withMessage('Invalid user ID'),
     ],
   };
   ```

4. **Add route**
   ```typescript
   router.get('/:id', 
     validateRequest(userValidation.getUser),
     userController.getUser
   );
   ```

#### Response Format

Always use consistent response format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}
```

### 5. Database Development

#### Prisma Schema Changes

1. **Update schema.prisma**
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     firstName String
     lastName  String
     // Add new fields here
   }
   ```

2. **Generate migration**
   ```bash
   npx prisma migrate dev --name add_user_fields
   ```

3. **Update Prisma client**
   ```bash
   npx prisma generate
   ```

#### Database Guidelines

- Use meaningful table and column names
- Add indexes for frequently queried fields
- Include timestamps (createdAt, updatedAt)
- Use appropriate data types
- Add foreign key constraints

### 6. Error Handling

#### Custom Error Classes

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
```

#### Error Handling in Controllers

```typescript
public getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Implementation
  } catch (error) {
    logger.error(`Get user error: ${error}`);
    
    const response: ApiResponse = {
      success: false,
      message: 'Failed to retrieve user',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    
    res.status(500).json(response);
  }
};
```

### 7. Logging

#### Log Levels

- **Error**: Application errors
- **Warn**: Warning conditions
- **Info**: General information
- **HTTP**: HTTP requests
- **Debug**: Debug information

#### Logging Guidelines

```typescript
// Good logging
logger.info('User registered successfully', { userId: user.id, email: user.email });
logger.error('Database connection failed', { error: error.message });

// Avoid sensitive data
logger.info('User logged in', { userId: user.id }); // Don't log password
```

### 8. Security

#### Input Validation

Always validate user inputs:

```typescript
export const userValidation = {
  create: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().isLength({ min: 2, max: 50 }),
  ],
};
```

#### Authentication

- Use JWT tokens for authentication
- Implement proper token validation
- Use bcrypt for password hashing
- Implement rate limiting

#### Authorization

- Use role-based access control
- Validate user permissions
- Implement proper middleware

### 9. Performance

#### Database Optimization

- Use connection pooling
- Optimize queries
- Add proper indexes
- Use transactions when needed

#### API Performance

- Implement pagination
- Use caching where appropriate
- Optimize response payloads
- Use async/await properly

### 10. Documentation

#### Code Documentation

```typescript
/**
 * Registers a new user account
 * @param data - User registration data
 * @returns Promise<AuthResult> - Authentication result with tokens
 * @throws ValidationError - When validation fails
 * @throws AuthenticationError - When user already exists
 */
public async register(data: RegisterData): Promise<AuthResult> {
  // Implementation
}
```

#### API Documentation

- Update API documentation for new endpoints
- Include request/response examples
- Document error codes
- Add validation rules

### 11. Code Review Checklist

#### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No sensitive data in logs
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Security considerations addressed

#### Review Checklist

- [ ] Code is readable and maintainable
- [ ] Proper error handling
- [ ] Security best practices followed
- [ ] Performance considerations
- [ ] Tests are comprehensive
- [ ] Documentation is clear

### 12. Debugging

#### Development Tools

- **VS Code**: Use TypeScript extension
- **Postman**: API testing
- **pgAdmin**: Database management
- **Chrome DevTools**: Network debugging

#### Debug Mode

```bash
# Start with debug logging
LOG_LEVEL=debug npm run dev

# Use Node.js debugger
npm run dev:debug
```

#### Common Issues

1. **TypeScript Errors**
   - Check import paths
   - Verify type definitions
   - Run `npm run build` to see all errors

2. **Database Issues**
   - Check connection string
   - Verify migrations
   - Check Prisma client generation

3. **JWT Issues**
   - Verify secret keys
   - Check token expiration
   - Validate token format

### 13. Deployment

#### Environment Setup

1. **Production environment**
   ```bash
   NODE_ENV=production
   npm run build
   npm start
   ```

2. **Environment variables**
   - Set all required variables
   - Use strong secrets
   - Configure database connection

3. **Database migration**
   ```bash
   npx prisma migrate deploy
   ```

### 14. Monitoring

#### Health Checks

- Implement health check endpoint
- Monitor database connectivity
- Check external service status

#### Logging

- Use structured logging
- Monitor error rates
- Track performance metrics

### 15. Best Practices Summary

#### Code Quality

- Write clean, readable code
- Follow TypeScript best practices
- Use proper error handling
- Implement comprehensive testing

#### Security

- Validate all inputs
- Use secure authentication
- Implement proper authorization
- Follow security guidelines

#### Performance

- Optimize database queries
- Use caching strategies
- Implement pagination
- Monitor performance metrics

#### Documentation

- Keep documentation updated
- Write clear commit messages
- Document API changes
- Maintain code comments

This development guide ensures consistent, high-quality code development across the team. 