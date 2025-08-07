# API Documentation

## Overview

The DPBazaar V2 Backend API provides a RESTful interface for user authentication and management. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
http://localhost:3000/v1
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Health Check

#### GET /health

Check server health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Authentication Endpoints

#### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- `firstName`: 2-50 characters, letters and spaces only
- `lastName`: 2-50 characters, letters and spaces only
- `email`: Valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "USER",
      "isActive": true,
      "emailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error or user already exists

---

#### POST /auth/login

Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Validation Rules:**
- `email`: Valid email format
- `password`: Required

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "USER",
      "isActive": true,
      "emailVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `400` - Validation error

---

#### POST /auth/logout

Logout user (invalidate tokens).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Logout successful
- `401` - Unauthorized

---

#### POST /auth/refresh-token

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- `refreshToken`: Required, valid JWT format

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Token refreshed successfully
- `401` - Invalid refresh token
- `400` - Validation error

---

#### POST /auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Validation Rules:**
- `email`: Valid email format

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Reset email sent (if user exists)
- `400` - Validation error

---

#### POST /auth/reset-password

Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePassword123!"
}
```

**Validation Rules:**
- `token`: Required
- `newPassword`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Password reset successful
- `400` - Invalid token or validation error

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Invalid credentials |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `INTERNAL_ERROR` | Server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Window**: 15 minutes
- **Limit**: 100 requests per IP address
- **Response**: 429 Too Many Requests when limit exceeded

## JWT Token Information

### Access Token
- **Expiration**: 15 minutes
- **Usage**: API authentication
- **Payload**: User ID, email, role

### Refresh Token
- **Expiration**: 7 days
- **Usage**: Token refresh
- **Payload**: User ID, email, role

## User Roles

| Role | Description |
|------|-------------|
| `USER` | Standard user account |
| `ADMIN` | Administrator account |
| `MODERATOR` | Moderator account |

## Examples

### cURL Examples

**Register User:**
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

**Login:**
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Authenticated Request:**
```bash
curl -X POST http://localhost:3000/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript Examples

**Register User:**
```javascript
const response = await fetch('http://localhost:3000/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'SecurePassword123!'
  })
});

const data = await response.json();
```

**Login:**
```javascript
const response = await fetch('http://localhost:3000/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john.doe@example.com',
    password: 'SecurePassword123!'
  })
});

const data = await response.json();
const { accessToken } = data.data;
```

**Authenticated Request:**
```javascript
const response = await fetch('http://localhost:3000/v1/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## Testing

You can test the API using:

1. **Postman**: Import the collection (planned)
2. **cURL**: Use the examples above
3. **Swagger UI**: Available at `/api-docs` (planned)
4. **Unit Tests**: Run with `npm test`

## Support

For API support and questions:

1. Check the [Error Codes](#error-codes) section
2. Review the [Validation Rules](#validation-rules)
3. Contact the development team 