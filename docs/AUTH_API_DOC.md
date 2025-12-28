# Authentication API Documentation

## Overview
This document provides comprehensive documentation for the authentication API endpoints, including user registration, login, logout, password management, and social login functionality.

## Authentication Endpoints

### POST /api/auth/register
**Description:** Registers a new user account

**Request:**
- Method: `POST`
- Route: `/api/auth/register`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "emailVerified": false,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    },
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "User registered successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### POST /api/auth/login
**Description:** Authenticates a user and returns access tokens

**Request:**
- Method: `POST`
- Route: `/api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "role": "string",
      "firstName": "string",
      "lastName": "string"
    }
  },
  "message": "Login successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### POST /api/auth/login-mobile-otp
**Description:** Sends OTP to user's mobile number for login

**Request:**
- Method: `POST`
- Route: `/api/auth/login-mobile-otp`

**Request Body:**
```json
{
  "phone": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "phone": "string"
  },
  "message": "OTP sent successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "phone": "+919876543210"
}
```

### POST /api/auth/verify-mobile-otp
**Description:** Verifies OTP sent to mobile number and logs in the user

**Request:**
- Method: `POST`
- Route: `/api/auth/verify-mobile-otp`

**Request Body:**
```json
{
  "phone": "string",
  "otp": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "phone": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "newRegistration": true
  },
  "message": "Login successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

### POST /api/auth/login-google
**Description:** Authenticates user using Google ID token

**Request:**
- Method: `POST`
- Route: `/api/auth/login-google`

**Request Body:**
```json
{
  "idToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "phone": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "newRegistration": true
  },
  "message": "Google login successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "idToken": "google-id-token-here"
}
```

### POST /api/auth/logout
**Description:** Logs out the current user

**Request:**
- Method: `POST`
- Route: `/api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /api/auth/refresh-token
**Description:** Refreshes the access token using a refresh token

**Request:**
- Method: `POST`
- Route: `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string"
  },
  "message": "Token refreshed successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

### POST /api/auth/forgot-password
**Description:** Initiates the password reset process

**Request:**
- Method: `POST`
- Route: `/api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
**Description:** Resets the user's password using a reset token

**Request:**
- Method: `POST`
- Route: `/api/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "token": "reset-token-here",
  "password": "newSecurePassword123"
}
```

## Error Responses

### Common Error Response Format
```json
{
  "success": false,
  "error": "string",
  "message": "string",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created (for registration)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Data Formats
- Dates: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Currency: Amounts are in Indian Rupees (INR) and represented as decimal values
- IDs: All IDs are string values using cuid format