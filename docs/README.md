# DPBazaar V2 Backend

A scalable and maintainable Node.js TypeScript backend API for DPBazaar V2, built with Express.js, Prisma ORM, and following modern development practices.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **Prisma ORM**: Type-safe database access and migrations
- **JWT Authentication**: Secure token-based authentication
- **Request Validation**: Input validation using express-validator
- **Structured Logging**: Winston-based logging with multiple transports
- **Rate Limiting**: Built-in rate limiting for API protection
- **Security**: Helmet.js for security headers and CORS support
- **Environment Configuration**: Centralized configuration management
- **Error Handling**: Comprehensive error handling middleware
- **API Documentation**: OpenAPI/Swagger documentation (planned)

## 📁 Project Structure

```
dpbazaar_v2_backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middleware
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validation schemas
│   └── index.ts         # Application entry point
├── prisma/              # Database schema and migrations
├── tests/               # Test files
├── docs/                # Documentation
├── logs/                # Application logs
└── dist/                # Compiled JavaScript (generated)
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma 5.7+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, express-rate-limit
- **Testing**: Jest (planned)

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- PostgreSQL database

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or the port specified in your environment variables).

## 📚 API Documentation

### Base URL
```
http://localhost:3000/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

For detailed API documentation, see [API Documentation](./api-documentation.md).

## 🔧 Configuration

The application uses environment variables for configuration. See [Configuration Guide](./configuration.md) for detailed information.

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dpbazaar"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=3000
NODE_ENV=development
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the project for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run clean` | Clean build artifacts |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Input Validation**: Comprehensive request validation
- **Environment Variables**: Secure configuration management

## 📊 Logging

The application uses Winston for structured logging with the following features:

- **Console Logging**: Colored output for development
- **File Logging**: Separate files for errors and all logs
- **Log Levels**: Error, Warn, Info, HTTP, Debug
- **Structured Format**: JSON-like format with timestamps

Log files are stored in the `logs/` directory:
- `logs/error.log` - Error level logs only
- `logs/all.log` - All log levels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style and conventions
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Documentation](./docs/)
2. Search existing [Issues](../../issues)
3. Create a new [Issue](../../issues/new)

## 🔄 Version History

- **v1.0.0** - Initial release with authentication system
  - User registration and login
  - JWT-based authentication
  - Password reset functionality
  - Basic API structure

## 🗺️ Roadmap

- [ ] Database integration with Prisma
- [ ] User management features
- [ ] Role-based access control
- [ ] Email service integration
- [x] File upload functionality with pre-signed URL workflow
  - Frontend uploads directly to Cloudflare R2 using pre-signed URLs
  - Backend generates pre-signed URLs for secure uploads
  - Automatic transformation of image keys to public URLs in API responses
  - Admin controls for file management
- [ ] API documentation with Swagger
- [ ] Comprehensive test suite
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] Caching layer
- [ ] WebSocket support 