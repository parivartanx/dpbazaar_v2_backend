# Delivery Agent API Documentation

## Overview
This document provides comprehensive documentation for the Delivery Agent API endpoints, including authentication, profile management, availability, and delivery management.

## Authentication
Include the JWT token in the Authorization header for protected endpoints:
```
Authorization: Bearer <token>
```

Base route prefix for all endpoints:
- `/v1/delivery-agents`

## Auth Endpoints

### POST /delivery-agents/login
**Description:** Authenticates a delivery agent and returns access/refresh tokens

**Request:**
- Method: `POST`
- Route: `/delivery-agents/login`
- Body:
```json
{
  "email": "agent@example.com",
  "password": "string",
  "role": "DELIVERY_AGENT"
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
      "email": "agent@example.com",
      "role": "DELIVERY_AGENT",
      "status": "ACTIVE"
    }
  },
  "message": "Login successful",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /delivery-agents/refresh-token
**Description:** Refreshes the access token using a valid refresh token

**Request:**
- Method: `POST`
- Route: `/delivery-agents/refresh-token`
- Body:
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
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /delivery-agents/forgot-password
**Description:** Requests a password reset email for the delivery agent

**Request:**
- Method: `POST`
- Route: `/delivery-agents/forgot-password`
- Body:
```json
{
  "email": "agent@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /delivery-agents/reset-password
**Description:** Resets the delivery agent's password using a reset token

**Request:**
- Method: `POST`
- Route: `/delivery-agents/reset-password`
- Body:
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /delivery-agents/logout
**Description:** Logs out the authenticated delivery agent

**Request:**
- Method: `POST`
- Route: `/delivery-agents/logout`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Profile Endpoints

### GET /delivery-agents/profile
**Description:** Retrieves the authenticated delivery agent's profile

**Request:**
- Method: `GET`
- Route: `/delivery-agents/profile`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": {
      "id": "string",
      "agentCode": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "agent@example.com",
      "phone": "string",
      "alternatePhone": "string",
      "profileImage": "string",
      "vehicleType": "BIKE|SCOOTER|CAR|VAN",
      "vehicleNumber": "string",
      "vehicleModel": "string",
      "licenseNumber": "string",
      "licenseExpiry": "2025-01-01T12:00:00.000Z",
      "employmentType": "FULL_TIME|PART_TIME|CONTRACT",
      "status": "ACTIVE|INACTIVE|ON_LEAVE|SUSPENDED|TERMINATED",
      "zones": ["string"],
      "currentZone": "string",
      "isAvailable": true,
      "lastKnownLat": 12.345678,
      "lastKnownLng": 76.543210,
      "rating": 4.5,
      "totalDeliveries": 100,
      "successfulDeliveries": 95,
      "failedDeliveries": 5,
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "message": "Profile retrieved successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### PUT /delivery-agents/availability
**Description:** Updates the authenticated delivery agent's availability status

**Request:**
- Method: `PUT`
- Route: `/delivery-agents/availability`
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "isAvailable": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agent": {
      "id": "string",
      "isAvailable": true,
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "message": "Availability updated successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Delivery Management Endpoints

### GET /delivery-agents/deliveries
**Description:** Retrieves deliveries assigned to the authenticated delivery agent

**Request:**
- Method: `GET`
- Route: `/delivery-agents/deliveries`
- Headers: `Authorization: Bearer <token>`
- Query Params (optional):
  - `status`: `PENDING|ASSIGNED|ACCEPTED|PICKED_UP|IN_TRANSIT|OUT_FOR_DELIVERY|DELIVERED|FAILED|RETURNED|CANCELLED`
  - `page`: number
  - `limit`: number

**Response:**
```json
{
  "success": true,
  "data": {
    "deliveries": [
      {
        "id": "string",
        "trackingId": "string",
        "status": "OUT_FOR_DELIVERY",
        "order": { "orderNumber": "ORD-12345" },
        "agent": { "firstName": "string", "lastName": "string" },
        "createdAt": "2025-01-01T12:00:00.000Z"
      }
    ]
  },
  "message": "Assigned deliveries retrieved successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### PUT /delivery-agents/deliveries/:id/status
**Description:** Updates the status or proof for a specific delivery assigned to the authenticated agent

**Request:**
- Method: `PUT`
- Route: `/delivery-agents/deliveries/:id/status`
- Headers: `Authorization: Bearer <token>`
- Params:
  - `id`: Delivery ID (required)
- Body (one or more fields):
```json
{
  "status": "PENDING|ASSIGNED|ACCEPTED|PICKED_UP|IN_TRANSIT|OUT_FOR_DELIVERY|DELIVERED|FAILED|RETURNED|CANCELLED",
  "deliveryProof": "https://cdn.example.com/proofs/photo.jpg",
  "deliveryOtp": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "delivery": {
      "id": "string",
      "trackingId": "string",
      "status": "DELIVERED",
      "deliveryProof": "https://cdn.example.com/proofs/photo.jpg",
      "deliveryOtp": "123456",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  },
  "message": "Delivery status updated successfully",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```
