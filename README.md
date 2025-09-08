# DP BAZAR Backend

A Node.js/Express backend with Prisma ORM for the DP BAZAR platform.

## Features

- User authentication and authorization
- Employees and management
- Customers and management
- Products and Orders management
- Reviews and Ratings
- File uploads with R2

## Tech Stack

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- R2 for file storage

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and update the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Set up your database URL and other environment variables in `.env`

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

6. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

## Development

Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:8080 by default.

## Database Management

- Generate Prisma client: `npm run prisma:generate`
- Create and apply migrations: `npm run prisma:migrate`
- View and edit data with Prisma Studio: `npm run prisma:studio`

# DP BAZAR API Documentation

## Base URL
```
PRODUCTION URL || http://localhost:8080/v1/ 
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## API Endpoints

### Authentication Routes

#### Register User
- **Method**: POST
- **URL**: `/auth/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "CUSTOMER" // or "ADMIN" or "EMPLOYEE" or "MANAGER"
}
```
- **Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Login
- **Method**: POST
- **URL**: `/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "cuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Admin Login
- **Method**: POST
- **URL**: `/auth/admin-login`
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```
- **Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "cuid",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "ADMIN"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```


#### Refresh Token
- **Method**: POST
- **URL**: `/auth/refresh-token`
- **Body**:
```json
{
  "refreshToken": "refresh_token"
}
```
- **Response**:
```json
{
  "status": "success",
  "message": "Tokens refreshed successfully",
  "accessToken": "new_jwt_access_token",
  "refreshToken": "new_jwt_refresh_token"
}
```

<!-- ### Admin Routes

#### Get Dashboard Statistics
- **Method**: GET
- **URL**: `/admin/dashboard-stats`
- **Auth Required**: Yes (Admin only)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "totalUsers": 1500,
    "totalOrders": 3200,
    "totalRevenue": 125000.50,
    "monthlySales": [
      {"month": "January", "sales": 10000},
      {"month": "February", "sales": 12000}
    ]
  }
}
``` -->