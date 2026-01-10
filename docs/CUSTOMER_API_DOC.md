# Customer API Documentation

## Overview
This document provides comprehensive documentation for the customer API endpoints, including profile management, wallet functionality, referral system, wishlist, cart, orders, and subscription cards.

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Profile Management Endpoints

### GET /customer/me/profile
**Description:** Retrieves the authenticated customer's profile information

**Request:**
- Method: `GET`
- Route: `/customer/me/profile`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "string",
      "userId": "string",
      "customerCode": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "CUSTOMER",
      "status": "ACTIVE|INACTIVE|SUSPENDED",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "2023-12-25",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "2023-12-25T10:30:00.000Z",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "2023-12-25T10:30:00.000Z",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Customer profile fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### PUT /customer/me/profile
**Description:** Updates the authenticated customer's profile information

**Request:**
- Method: `PUT`
- Route: `/customer/me/profile`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "phone": "string",
  "dateOfBirth": "2023-12-25",
  "gender": "MALE|FEMALE|OTHER",
  "avatar": "string",
  "bio": "string",
  "tier": "BRONZE|SILVER|GOLD|PLATINUM",
  "preferences": {},
  "metadata": {}
}
```

**Note:** 
- User profile fields (`firstName`, `lastName`, `middleName`, `phone`, `dateOfBirth`, `gender`, `avatar`, `bio`) are updated in the User model
- Customer-specific fields (`tier`, `preferences`, `metadata`) are updated in the Customer model
- Email cannot be updated through this endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "string",
      "userId": "string",
      "customerCode": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "CUSTOMER",
      "status": "ACTIVE|INACTIVE|SUSPENDED",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "2023-12-25",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "2023-12-25T10:30:00.000Z",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "2023-12-25T10:30:00.000Z",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Profile updated successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Address Management Endpoints

### GET /customer/me/addresses
**Description:** Retrieves all addresses for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/customer/me/addresses`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "string",
        "customerId": "string",
        "fullName": "string",
        "phone": "string",
        "addressLine1": "string",
        "addressLine2": null,
        "landmark": null,
        "city": "string",
        "state": "string",
        "country": "string",
        "postalCode": "string",
        "isDefault": false,
        "type": "HOME",
        "alternatePhone": null,
        "lat": null,
        "lng": null,
        "deliveryInstructions": null,
        "deletedAt": null,
        "createdAt": "2024-01-09T15:30:00.000Z",
        "updatedAt": "2024-01-09T15:30:00.000Z"
      }
    ]
  },
  "message": "Addresses fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /customer/me/addresses
**Description:** Creates a new address for the authenticated customer. The `customerId` is automatically added from the authenticated user, so it should not be included in the request body.

**Request:**
- Method: `POST`
- Route: `/customer/me/addresses`
- Headers: `Authorization: Bearer <token>`
- Content-Type: `application/json`
- Request Body Schema:
```json
{
  "fullName": "string (required, min 2, max 100 chars)",
  "phone": "string (required, 10-15 digits only)",
  "alternatePhone": "string (optional, 10-15 digits)",
  "addressLine1": "string (required, min 3, max 200 chars)",
  "addressLine2": "string (optional, max 200 chars)",
  "landmark": "string (optional, max 100 chars)",
  "city": "string (required, min 2, max 50 chars)",
  "state": "string (required, min 2, max 50 chars)",
  "country": "string (optional, default: 'India', min 2, max 50 chars)",
  "postalCode": "string (required, min 3, max 10 chars)",
  "type": "HOME|WORK|OTHER (optional, default: 'HOME')",
  "isDefault": "boolean (optional, default: false)",
  "lat": "number (optional, -90 to 90)",
  "lng": "number (optional, -180 to 180)",
  "deliveryInstructions": "string (optional, max 500 chars)"
}
```

**Example Request Body (Minimum Required Fields):**
```json
{
  "fullName": "Ranjeet Kumar",
  "phone": "8409741571",
  "addressLine1": "Lalpur, Ranchi",
  "city": "Ranchi",
  "state": "Jharkhand",
  "postalCode": "834001"
}
```

**Example Request Body (All Fields):**
```json
{
  "fullName": "Ranjeet Kumar",
  "phone": "8409741571",
  "alternatePhone": "9876543210",
  "addressLine1": "Lalpur, Near City Center",
  "addressLine2": "Apartment 4B, Building A",
  "landmark": "Near City Mall",
  "city": "Ranchi",
  "state": "Jharkhand",
  "country": "India",
  "postalCode": "834001",
  "type": "HOME",
  "isDefault": true,
  "lat": 23.3441,
  "lng": 85.3096,
  "deliveryInstructions": "Please call before delivery"
}
```

**Response:**
- Success: `201 Created`
- Error: `400 Bad Request` (validation error), `401 Unauthorized` (not authenticated), `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "HOME",
      "isDefault": false,
      "fullName": "string",
      "phone": "string",
      "alternatePhone": null,
      "addressLine1": "string",
      "addressLine2": null,
      "landmark": null,
      "city": "string",
      "state": "string",
      "country": "India",
      "postalCode": "string",
      "lat": null,
      "lng": null,
      "deliveryInstructions": null,
      "deletedAt": null,
      "createdAt": "2024-01-09T15:30:00.000Z",
      "updatedAt": "2024-01-09T15:30:00.000Z"
    }
  },
  "timestamp": "2024-01-09T15:30:00.000Z"
}
```

**Error Response (400 Bad Request - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Phone number must be 10-15 digits (numbers only, no spaces or special characters)",
    "Address line 1 must be at least 3 characters",
    "City is required"
  ]
}
```

**Error Response (400 Bad Request - Generic Error):**
```json
{
  "success": false,
  "message": "Failed to create address",
  "error": "Invalid data provided for address creation",
  "timestamp": "2024-01-09T15:30:00.000Z"
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 characters
- `phone`: Required, exactly 10-15 digits (numbers only, no spaces, dashes, or special characters)
- `alternatePhone`: Optional, if provided must be 10-15 digits
- `addressLine1`: Required, 3-200 characters
- `addressLine2`: Optional, max 200 characters
- `landmark`: Optional, max 100 characters
- `city`: Required, 2-50 characters
- `state`: Required, 2-50 characters
- `country`: Optional, defaults to "India" if not provided, 2-50 characters
- `postalCode`: Required, 3-10 characters
- `type`: Optional, must be one of: `HOME`, `WORK`, `OTHER` (default: `HOME`)
- `isDefault`: Optional boolean (default: `false`)
- `lat`: Optional, must be between -90 and 90
- `lng`: Optional, must be between -180 and 180
- `deliveryInstructions`: Optional, max 500 characters

**Note:**
- All string fields are automatically trimmed (leading/trailing whitespace removed)
- `customerId` is automatically added from the authenticated user and should NOT be included in the request
- Phone numbers must contain only digits (0-9), no spaces, dashes, or country codes

### PUT /customer/me/addresses/:id
**Description:** Updates an existing address for the authenticated customer. All fields in the request body are optional - only include the fields you want to update.

**Request:**
- Method: `PUT`
- Route: `/customer/me/addresses/:id`
- Headers: `Authorization: Bearer <token>`
- Content-Type: `application/json`
- Path Parameter: `id` (address ID, required)
- Request Body Schema (all fields optional):
```json
{
  "fullName": "string (optional, min 2, max 100 chars)",
  "phone": "string (optional, 10-15 digits only)",
  "alternatePhone": "string (optional, 10-15 digits)",
  "addressLine1": "string (optional, min 5, max 200 chars)",
  "addressLine2": "string (optional, max 200 chars)",
  "landmark": "string (optional, max 100 chars)",
  "city": "string (optional, min 2, max 50 chars)",
  "state": "string (optional, min 2, max 50 chars)",
  "country": "string (optional, min 2, max 50 chars)",
  "postalCode": "string (optional, min 3, max 10 chars)",
  "type": "HOME|WORK|OTHER (optional)",
  "isDefault": "boolean (optional)",
  "lat": "number (optional, -90 to 90)",
  "lng": "number (optional, -180 to 180)",
  "deliveryInstructions": "string (optional, max 500 chars)"
}
```

**Example Request Body (Update Basic Info):**
```json
{
  "fullName": "Ranjeet Kumar Singh",
  "phone": "8409741571",
  "isDefault": true
}
```

**Example Request Body (Update Full Address):**
```json
{
  "fullName": "Ranjeet Kumar",
  "phone": "8409741571",
  "alternatePhone": "9876543210",
  "addressLine1": "New Address Line 1",
  "addressLine2": "New Address Line 2",
  "landmark": "Near New Landmark",
  "city": "New City",
  "state": "New State",
  "country": "India",
  "postalCode": "834001",
  "type": "WORK",
  "isDefault": false,
  "lat": 23.3441,
  "lng": 85.3096,
  "deliveryInstructions": "Updated delivery instructions"
}
```

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request` (validation error, missing ID), `401 Unauthorized` (not authenticated), `404 Not Found` (address not found), `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "HOME",
      "isDefault": false,
      "fullName": "string",
      "phone": "string",
      "alternatePhone": null,
      "addressLine1": "string",
      "addressLine2": null,
      "landmark": null,
      "city": "string",
      "state": "string",
      "country": "India",
      "postalCode": "string",
      "lat": null,
      "lng": null,
      "deliveryInstructions": null,
      "deletedAt": null,
      "createdAt": "2024-01-09T15:30:00.000Z",
      "updatedAt": "2024-01-09T15:30:00.000Z"
    }
  },
  "timestamp": "2024-01-09T15:30:00.000Z"
}
```

**Error Response (400 Bad Request - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    "Phone number must be 10-15 digits",
    "Address line 1 must be at least 5 characters"
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Address not found",
  "timestamp": "2024-01-09T15:30:00.000Z"
}
```

**Validation Rules (same as POST, but all fields are optional):**
- All validation rules from POST endpoint apply, but fields are optional for updates
- `type`: Must be one of: `HOME`, `WORK`, `OTHER` (not `OFFICE`)
- Phone numbers must contain only digits (0-9)
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Address updated successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### DELETE /customer/me/addresses/:id
**Description:** Deletes an address for the authenticated customer

**Request:**
- Method: `DELETE`
- Route: `/customer/me/addresses/:id`
- Headers: `Authorization: Bearer <token>`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "fullName": "string",
      "phone": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "city": "string",
      "state": "string",
      "country": "string",
        "postalCode": "string",
        "isDefault": false,
        "type": "HOME",
        "alternatePhone": null,
        "landmark": null,
        "lat": null,
        "lng": null,
        "deliveryInstructions": null,
        "deletedAt": null,
        "createdAt": "2024-01-09T15:30:00.000Z",
        "updatedAt": "2024-01-09T15:30:00.000Z"
    }
  },
  "message": "Address deleted successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Wallet Management Endpoints

### GET /customer/me/wallets
**Description:** Retrieves all wallets for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/customer/me/wallets`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "id": "string",
        "customerId": "string",
        "type": "SHOPPING|WITHDRAWABLE|LOCKED",
        "balance": 100.00,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Customer wallets retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /customer/me/wallet-transactions
**Description:** Retrieves all wallet transactions for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/customer/me/wallet-transactions`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "string",
        "walletId": "string",
        "customerId": "string",
        "type": "CREDIT|DEBIT",
        "reason": "PURCHASE|REWARD|REFUND|WITHDRAWAL|ADJUSTMENT|SUBSCRIPTION_REFERRAL|TRANSFER",
        "status": "PENDING|SUCCESS|FAILED|REVERSED",
        "amount": 100.00,
        "balanceBefore": 50.00,
        "balanceAfter": 150.00,
        "cardId": "string",
        "subscriptionId": "string",
        "referralId": "string",
        "rewardPercent": 10.00,
        "targetAmount": 100.00,
        "capPercentage": 10,
        "idempotencyKey": "string",
        "metadata": {},
        "createdAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Customer wallet transactions retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /customer/me/wallets/transfer
**Description:** Transfers funds between wallets for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/customer/me/wallets/transfer`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "fromWalletId": "string",
  "toWalletId": "string",
  "amount": 100.00,
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fromWallet": {
      "id": "string",
      "customerId": "string",
      "type": "SHOPPING|WITHDRAWABLE|LOCKED",
      "balance": 100.00,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    },
    "toWallet": {
      "id": "string",
      "customerId": "string",
      "type": "SHOPPING|WITHDRAWABLE|LOCKED",
      "balance": 200.00,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Transfer completed successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /customer/me/wallets/withdrawal
**Description:** Requests a withdrawal from the customer's wallet

**Request:**
- Method: `POST`
- Route: `/customer/me/wallets/withdrawal`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "walletId": "string",
  "amount": 100.00,
  "paymentMethod": "BANK_TRANSFER|UPI|CARD",
  "accountDetails": {
    "accountNumber": "string",
    "ifscCode": "string",
    "accountHolderName": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "withdrawal": {
      "id": "string",
      "walletId": "string",
      "customerId": "string",
      "amount": 100.00,
      "paymentMethod": "BANK_TRANSFER|UPI|CARD",
      "status": "PENDING|PROCESSING|SUCCESS|FAILED",
      "accountDetails": {
        "accountNumber": "string",
        "ifscCode": "string",
        "accountHolderName": "string"
      },
      "processedAt": "2023-12-25T10:30:00.000Z",
      "transactionId": "string",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Withdrawal request submitted successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Referral Management Endpoints

### POST /customer/me/referral-code
**Description:** Creates a referral code for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/customer/me/referral-code`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": true,
      "customerId": "string",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "deactivatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Referral code created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /customer/me/referral-code
**Description:** Retrieves the referral code for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/customer/me/referral-code`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": true,
      "customerId": "string",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "deactivatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Customer referral code fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /customer/me/referrals-history
**Description:** Retrieves the referral history for the authenticated customer (referrals made by the customer)

**Request:**
- Method: `GET`
- Route: `/customer/me/referrals-history`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "referralHistories": [
      {
        "id": "string",
        "referralCodeId": "string",
        "referrerId": "string",
        "referredUserId": "string",
        "referrerSubscriptionId": "string",
        "triggeredCardId": "string",
        "status": "PENDING|QUALIFIED|REWARDED|EXPIRED",
        "rewardAmount": 100.00,
        "rewardedAt": "2023-12-25T10:30:00.000Z",
        "expiredAt": "2023-12-25T10:30:00.000Z",
        "createdAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Customer referral histories fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /customer/me/referred-history
**Description:** Retrieves if the authenticated customer was referred by someone else

**Request:**
- Method: `GET`
- Route: `/customer/me/referred-history`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "PENDING|QUALIFIED|REWARDED|EXPIRED",
      "rewardAmount": 100.00,
      "rewardedAt": "2023-12-25T10:30:00.000Z",
      "expiredAt": "2023-12-25T10:30:00.000Z",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Referred user history fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /customer/me/referral-code/use
**Description:** Uses a referral code for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/customer/me/referral-code/use`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "PENDING|QUALIFIED|REWARDED|EXPIRED",
      "rewardAmount": 100.00,
      "rewardedAt": "2023-12-25T10:30:00.000Z",
      "expiredAt": "2023-12-25T10:30:00.000Z",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Referral code applied successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Banner Endpoints

### GET /public/banners
**Description:** Retrieves all banners with optional filtering and pagination support

**Request:**
- Method: `GET`
- Route: `/public/banners`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by banner status (ACTIVE, INACTIVE, etc.)
- `type` (optional): Filter by banner type (IMAGE, VIDEO, HTML)
- `placement` (optional): Filter by banner placement (HOME_TOP, HOME_MIDDLE, etc.)
- `search` (optional): Search term to filter banners

**Response:**
```json
{
  "success": true,
  "message": "Banners retrieved successfully",
  "data": {
    "banners": [
      {
        "id": "string",
        "title": "string",
        "subtitle": "string",
        "imageUrl": "string",
        "targetUrl": "string",
        "type": "IMAGE|VIDEO|HTML",
        "placement": "HOME_TOP|HOME_MIDDLE|etc",
        "status": "ACTIVE|INACTIVE|etc",
        "priority": 0,
        "startDate": "date",
        "endDate": "date",
        "impressions": 0,
        "clicks": 0,
        "metadata": {},
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 1
    }
  },
  "timestamp": "datetime"
}
```

### GET /public/banners/:id
**Description:** Retrieves a specific banner by its ID

**Request:**
- Method: `GET`
- Route: `/public/banners/{id}`

**Path Parameters:**
- `id`: The unique identifier of the banner

**Response:**
```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "id": "string",
    "title": "string",
    "subtitle": "string",
    "imageUrl": "string",
    "targetUrl": "string",
    "type": "IMAGE|VIDEO|HTML",
    "placement": "HOME_TOP|HOME_MIDDLE|etc",
    "status": "ACTIVE|INACTIVE|etc",
    "priority": 0,
    "startDate": "date",
    "endDate": "date",
    "impressions": 0,
    "clicks": 0,
    "metadata": {},
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "timestamp": "datetime"
}
```

## Product Endpoints

### GET /products/brands
**Description:** Retrieves all product brands

**Request:**
- Method: `GET`
- Route: `/products/brands`

**Response:**
```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "logo": "string",
        "banner": "string",
        "website": "string",
        "contactEmail": "string",
        "contactPhone": "string",
        "address": "string",
        "isFeatured": true,
        "isActive": true,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Brands retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/categories
**Description:** Retrieves all product categories in hierarchical structure. Returns only root categories (level 0) with nested children. Each category includes only essential fields optimized for frontend rendering.

**Request:**
- Method: `GET`
- Route: `/products/categories`

**Response:**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "level": 0,
        "path": "/string",
        "children": [
          {
            "id": "string",
            "name": "string",
            "slug": "string",
            "level": 1,
            "path": "/parent/child",
            "children": [
              {
                "id": "string",
                "name": "string",
                "slug": "string",
                "level": 2,
                "path": "/parent/child/grandchild"
              }
            ]
          }
        ]
      }
    ]
  },
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Response Fields:**
- `id`: Category unique identifier
- `name`: Category display name
- `slug`: URL-friendly category identifier
- `level`: Category hierarchy level (0 = root, 1 = subcategory, 2 = sub-subcategory)
- `path`: Full category path (e.g., "/electronics/mobiles/smartphones")
- `children`: Array of child categories (nested structure, up to 3 levels)

**Note:**
- Only active categories are returned
- Response includes hierarchical structure with nested children (up to 3 levels: 0 → 1 → 2)
- Categories are ordered by level and displayOrder
- This endpoint is optimized for building category navigation menus and filters

### GET /products/
**Description:** Retrieves all products with pagination, search, and filtering. Returns optimized product card data for efficient frontend rendering.

**Request:**
- Method: `GET`
- Route: `/products/`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `search` (optional): Search term for product name, description, SKU, or barcode (case-insensitive)
  - `category` (optional): Filter by category ID
  - `brand` (optional): Filter by brand ID
  - `status` (optional): Filter by product status (ACTIVE, INACTIVE, DRAFT). Defaults to ACTIVE for public route
  - `stockStatus` (optional): Filter by stock status (IN_STOCK, LOW_STOCK, OUT_OF_STOCK)
  - `isFeatured` (optional): Filter featured products (true/false)
  - `isNewArrival` (optional): Filter new arrival products (true/false)
  - `isBestSeller` (optional): Filter best seller products (true/false)
  - `barcode` (optional): Search by specific barcode

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "sku": "string",
        "name": "string",
        "slug": "string",
        "shortDescription": "string",
        "mrp": 29990,
        "sellingPrice": 24990,
        "discount": {
          "amount": 5000,
          "percent": 16.67
        },
        "image": {
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string"
        },
        "brand": {
          "id": "string",
          "name": "string",
          "logo": "string",
          "slug": "string"
        },
        "categories": ["string"],
        "stockStatus": "IN_STOCK|LOW_STOCK|OUT_OF_STOCK",
        "status": "ACTIVE|INACTIVE|DRAFT",
        "isFeatured": true,
        "isNewArrival": true,
        "isBestSeller": true,
        "avgRating": 4.48,
        "totalReviews": 39
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 45,
      "limit": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Products Found",
  "timestamp": "2026-01-06T05:37:46.815Z"
}
```

**Notes:**
- Products are returned in optimized card format for efficient frontend rendering
- The `image` field contains the primary product image with URL, thumbnail URL, and alt text
- The `brand` field can be `null` if the product has no brand assigned
- The `categories` field is an array of category names
- The `discount` field is calculated automatically from MRP and selling price
- Products are filtered by `status: ACTIVE` by default for public access
- Search is performed across product name, description, SKU, and barcode fields

### GET /products/slug/:slug
**Description:** Retrieves a product by its slug

**Request:**
- Method: `GET`
- Route: `/products/slug/:slug`
- Parameters: `slug` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "categoryId": "string",
      "brandId": "string",
      "mrp": 100.00,
      "sellingPrice": 90.00,
      "discountPercentage": 10.00,
      "taxRate": 10.00,
      "stockQuantity": 100,
      "reservedQuantity": 0,
      "availableQuantity": 100,
      "minOrderQuantity": 1,
      "maxOrderQuantity": 10,
      "weight": 1.0,
      "dimensions": {
        "length": 10.0,
        "width": 10.0,
        "height": 10.0
      },
      "images": ["string"],
      "primaryImage": "string",
      "isReturnable": true,
      "returnDays": 30,
      "warrantyPeriod": "string",
      "specifications": {},
      "status": "ACTIVE|INACTIVE|DRAFT",
      "visibility": "PUBLIC|PRIVATE|INVITATION",
      "tags": ["string"],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z",
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "brand": {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  },
  "message": "Product retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/:id/reviews
**Description:** Retrieves product reviews for a specific product

**Request:**
- Method: `GET`
- Route: `/products/:id/reviews`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "string",
        "productId": "string",
        "customerId": "string",
        "orderId": "string",
        "rating": 5,
        "title": "string",
        "comment": "string",
        "isVerifiedPurchase": true,
        "helpfulCount": 0,
        "notHelpfulCount": 0,
        "status": "PENDING|APPROVED|REJECTED",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z",
        "customer": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "avatar": "string"
        },
        "product": {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "message": "Reviews retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Note:** The `customer` object in reviews includes basic user profile information (`firstName`, `lastName`, `avatar`) from the User model.

### GET /products/discounts
**Description:** Retrieves discount offers with filtering and pagination

**Request:**
- Method: `GET`
- Route: `/products/discounts`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `search` (optional): Search term for discount code or description
  - `isActive` (optional): Filter by active status (true/false)
  - `type` (optional): Filter by discount type (PERCENTAGE/FIXED_AMOUNT)
  - `category` (optional): Filter by applicable category

**Response:**
```json
{
  "success": true,
  "data": {
    "discounts": [
      {
        "id": "string",
        "code": "string",
        "description": "string",
        "type": "PERCENTAGE|FIXED_AMOUNT",
        "value": 20.00,
        "minOrderAmount": 1000.00,
        "maxDiscountAmount": 500.00,
        "usageLimit": 100,
        "usagePerCustomer": 1,
        "usedCount": 0,
        "validFrom": "2023-12-25T10:30:00.000Z",
        "validUntil": "2024-01-25T10:30:00.000Z",
        "applicableCategories": [
          {
            "id": "string",
            "name": "string",
            "slug": "string"
          }
        ],
        "applicableProducts": [
          {
            "id": "string",
            "name": "string",
            "sku": "string",
            "slug": "string"
          }
        ],
        "applicableBrands": [
          {
            "id": "string",
            "name": "string",
            "slug": "string"
          }
        ],
        "customerSegments": [],
        "isActive": true,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Discount offers retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/discounts/:code
**Description:** Retrieves a specific discount offer by code

**Request:**
- Method: `GET`
- Route: `/products/discounts/:code`
- Parameters: `code` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "discount": {
      "id": "string",
      "code": "string",
      "description": "string",
      "type": "PERCENTAGE|FIXED_AMOUNT",
      "value": 20.00,
      "minOrderAmount": 1000.00,
      "maxDiscountAmount": 500.00,
      "usageLimit": 100,
      "usagePerCustomer": 1,
      "usedCount": 0,
      "validFrom": "2023-12-25T10:30:00.000Z",
      "validUntil": "2024-01-25T10:30:00.000Z",
      "applicableCategories": [
        {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      ],
      "applicableProducts": [
        {
          "id": "string",
          "name": "string",
          "sku": "string",
          "slug": "string"
        }
      ],
      "applicableBrands": [
        {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      ],
      "customerSegments": [],
      "isActive": true,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Discount offer retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Wishlist Endpoints

### POST /products/wishlist/items
**Description:** Adds a product to the customer's wishlist

**Request:**
- Method: `POST`
- Route: `/products/wishlist/items`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "productId": "string",
  "variantId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlistItem": {
      "id": "string",
      "customerId": "string",
      "productId": "string",
      "variantId": "string",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Product added to wishlist successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### DELETE /products/wishlist/items/:productId
**Description:** Removes a product from the customer's wishlist

**Request:**
- Method: `DELETE`
- Route: `/products/wishlist/items/:productId`
- Headers: `Authorization: Bearer <token>`
- Parameters: `productId` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlistItem": {
      "id": "string",
      "customerId": "string",
      "productId": "string",
      "variantId": "string",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Product removed from wishlist successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/wishlist/items
**Description:** Retrieves all items in the customer's wishlist

**Request:**
- Method: `GET`
- Route: `/products/wishlist/items`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "wishlistItems": [
      {
        "id": "string",
        "customerId": "string",
        "productId": "string",
        "variantId": "string",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "product": {
          "id": "string",
          "name": "string",
          "slug": "string",
          "sellingPrice": 90.00,
          "primaryImage": "string"
        }
      }
    ]
  },
  "message": "Wishlist items retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Cart Endpoints

### GET /products/cart
**Description:** Retrieves the customer's cart

**Request:**
- Method: `GET`
- Route: `/products/cart`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "string",
      "customerId": "string",
      "itemCount": 2,
      "totalMrp": 200.00,
      "totalDiscount": 20.00,
      "totalAmount": 180.00,
      "items": [
        {
          "id": "string",
          "cartId": "string",
          "productId": "string",
          "variantId": "string",
          "quantity": 1,
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "discount": 10.00,
          "totalAmount": 90.00,
          "product": {
            "id": "string",
            "name": "string",
            "slug": "string",
            "primaryImage": "string"
          },
          "variant": {
            "id": "string",
            "sku": "string",
            "name": "string"
          }
        }
      ],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Cart retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /products/cart
**Description:** Adds an item to the customer's cart

**Request:**
- Method: `POST`
- Route: `/products/cart`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "productId": "string",
  "variantId": "string",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "string",
      "customerId": "string",
      "itemCount": 2,
      "totalMrp": 200.00,
      "totalDiscount": 20.00,
      "totalAmount": 180.00,
      "items": [
        {
          "id": "string",
          "cartId": "string",
          "productId": "string",
          "variantId": "string",
          "quantity": 1,
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "discount": 10.00,
          "totalAmount": 90.00,
          "product": {
            "id": "string",
            "name": "string",
            "slug": "string",
            "primaryImage": "string"
          },
          "variant": {
            "id": "string",
            "sku": "string",
            "name": "string"
          }
        }
      ],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Item added to cart successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### PUT /products/cart
**Description:** Updates the quantity of an item in the customer's cart

**Request:**
- Method: `PUT`
- Route: `/products/cart`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "productId": "string",
  "variantId": "string",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "string",
      "customerId": "string",
      "itemCount": 2,
      "totalMrp": 200.00,
      "totalDiscount": 20.00,
      "totalAmount": 180.00,
      "items": [
        {
          "id": "string",
          "cartId": "string",
          "productId": "string",
          "variantId": "string",
          "quantity": 2,
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "discount": 10.00,
          "totalAmount": 180.00,
          "product": {
            "id": "string",
            "name": "string",
            "slug": "string",
            "primaryImage": "string"
          },
          "variant": {
            "id": "string",
            "sku": "string",
            "name": "string"
          }
        }
      ],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Cart updated successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### DELETE /products/cart
**Description:** Clears all items from the customer's cart

**Request:**
- Method: `DELETE`
- Route: `/products/cart`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "string",
      "customerId": "string",
      "itemCount": 0,
      "totalMrp": 0.00,
      "totalDiscount": 0.00,
      "totalAmount": 0.00,
      "items": [],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Cart cleared successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### DELETE /products/cart/items/:productId/:variantId
**Description:** Removes a specific item from the customer's cart

**Request:**
- Method: `DELETE`
- Route: `/products/cart/items/:productId/:variantId`
- Headers: `Authorization: Bearer <token>`
- Parameters: `productId` (required), `variantId` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "string",
      "customerId": "string",
      "itemCount": 1,
      "totalMrp": 100.00,
      "totalDiscount": 10.00,
      "totalAmount": 90.00,
      "items": [
        {
          "id": "string",
          "cartId": "string",
          "productId": "string",
          "variantId": "string",
          "quantity": 1,
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "discount": 10.00,
          "totalAmount": 90.00,
          "product": {
            "id": "string",
            "name": "string",
            "slug": "string",
            "primaryImage": "string"
          },
          "variant": {
            "id": "string",
            "sku": "string",
            "name": "string"
          }
        }
      ],
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Item removed from cart successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /products/cart/buy
**Description:** Creates an order from the customer's cart

**Request:**
- Method: `POST`
- Route: `/products/cart/buy`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "shippingAddressId": "string",
  "billingAddressId": "string",
  "customerNotes": "string",
  "discountCode": "string",
  "paymentMethod": "CASH|ONLINE|WALLET",
  "paymentDetails": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "itemsTotal": 90.00,
      "taxAmount": 9.00,
      "shippingCharges": 0.00,
      "discount": 0.00,
      "totalAmount": 99.00,
      "status": "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED|RETURNED",
      "paymentStatus": "PENDING|SUCCESS|FAILED|REFUNDED",
      "source": "WEBSITE|APP|SYSTEM|POS",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Order created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Order Management Endpoints

### POST /products/orders
**Description:** Creates a new order for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/products/orders`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "items": [
    {
      "productId": "string",
      "variantId": "string",
      "quantity": 1
    }
  ],
  "shippingAddressId": "string",
  "billingAddressId": "string",
  "customerNotes": "string",
  "discountCode": "string",
  "paymentMethod": "CASH|ONLINE|WALLET",
  "paymentDetails": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "itemsTotal": 90.00,
      "taxAmount": 9.00,
      "shippingCharges": 0.00,
      "discount": 0.00,
      "totalAmount": 99.00,
      "status": "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED|RETURNED",
      "paymentStatus": "PENDING|SUCCESS|FAILED|REFUNDED",
      "source": "WEBSITE|APP|SYSTEM|POS",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Order created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/orders
**Description:** Retrieves all orders for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/products/orders`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by order status
  - `startDate` (optional): Date string in ISO format
  - `endDate` (optional): Date string in ISO format

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "string",
        "orderNumber": "string",
        "customerId": "string",
        "itemsTotal": 90.00,
        "taxAmount": 9.00,
        "shippingCharges": 0.00,
        "discount": 0.00,
        "totalAmount": 99.00,
        "status": "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED|RETURNED",
        "paymentStatus": "PENDING|SUCCESS|FAILED|REFUNDED",
        "source": "WEBSITE|APP|SYSTEM|POS",
        "customerName": "string",
        "customerEmail": "string",
        "customerPhone": "string",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Customer orders retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/orders/:id
**Description:** Retrieves a specific order for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/products/orders/:id`
- Headers: `Authorization: Bearer <token>`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "itemsTotal": 90.00,
      "taxAmount": 9.00,
      "shippingCharges": 0.00,
      "discount": 0.00,
      "totalAmount": 99.00,
      "status": "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED|RETURNED",
      "paymentStatus": "PENDING|SUCCESS|FAILED|REFUNDED",
      "source": "WEBSITE|APP|SYSTEM|POS",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z",
      "items": [
        {
          "id": "string",
          "orderId": "string",
          "productId": "string",
          "variantId": "string",
          "productName": "string",
          "productSku": "string",
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "quantity": 1,
          "discount": 10.00,
          "taxRate": 10.00,
          "taxAmount": 9.00,
          "totalAmount": 99.00
        }
      ],
      "shippingAddress": {
        "id": "string",
        "fullName": "string",
        "phone": "string",
        "addressLine1": "string",
        "addressLine2": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "postalCode": "string"
      },
      "billingAddress": {
        "id": "string",
        "fullName": "string",
        "phone": "string",
        "addressLine1": "string",
        "addressLine2": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "postalCode": "string"
      }
    }
  },
  "message": "Customer order retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Return Management Endpoints

### POST /products/returns
**Description:** Creates a return request for a customer order

**Request:**
- Method: `POST`
- Route: `/products/returns`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "orderId": "string",
  "type": "RETURN|EXCHANGE",
  "reason": "string",
  "detailedReason": "string",
  "items": [
    {
      "orderItemId": "string",
      "quantity": 1,
      "condition": "DAMAGED|DEFECTIVE|UNWANTED"
    }
  ],
  "refundMethod": "CASH|STORE_CREDIT|ORIGINAL_PAYMENT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "return": {
      "id": "string",
      "returnNumber": "string",
      "orderId": "string",
      "type": "RETURN|EXCHANGE",
      "reason": "string",
      "status": "REQUESTED|APPROVED|REJECTED|PICKED_UP|RECEIVED|PROCESSING|REFUNDED|REPLACED",
      "refundAmount": 90.00,
      "refundMethod": "CASH|STORE_CREDIT|ORIGINAL_PAYMENT",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z",
      "source": "WEBSITE|APP|SYSTEM|POS"
    }
  },
  "message": "Return request created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/returns
**Description:** Retrieves return requests for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/products/returns`
- Headers: `Authorization: Bearer <token>`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by return status
  - `orderId` (optional): Filter by specific order ID
  - `type` (optional): Filter by return type (RETURN|EXCHANGE)

**Response:**
```json
{
  "success": true,
  "data": {
    "returns": [
      {
        "id": "string",
        "returnNumber": "string",
        "orderId": "string",
        "type": "RETURN|EXCHANGE",
        "reason": "string",
        "status": "REQUESTED|APPROVED|REJECTED|PICKED_UP|RECEIVED|PROCESSING|REFUNDED|REPLACED",
        "refundAmount": 90.00,
        "refundMethod": "CASH|STORE_CREDIT|ORIGINAL_PAYMENT",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z",
        "source": "WEBSITE|APP|SYSTEM|POS",
        "order": {
          "orderNumber": "string",
          "totalAmount": 99.00,
          "status": "RETURNED",
          "customerName": "string"
        },
        "items": [
          {
            "quantity": 1,
            "condition": "DAMAGED|DEFECTIVE|UNWANTED",
            "productName": "string",
            "productSku": "string",
            "sellingPrice": 90.00
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "message": "Customer returns retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /products/returns/:id
**Description:** Retrieves a specific return request for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/products/returns/:id`
- Headers: `Authorization: Bearer <token>`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "return": {
      "id": "string",
      "returnNumber": "string",
      "orderId": "string",
      "type": "RETURN|EXCHANGE",
      "reason": "string",
      "status": "REQUESTED|APPROVED|REJECTED|PICKED_UP|RECEIVED|PROCESSING|REFUNDED|REPLACED",
      "refundAmount": 90.00,
      "refundMethod": "CASH|STORE_CREDIT|ORIGINAL_PAYMENT",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z",
      "source": "WEBSITE|APP|SYSTEM|POS",
      "order": {
        "orderNumber": "string",
        "totalAmount": 99.00,
        "status": "RETURNED",
        "customerName": "string"
      },
      "items": [
        {
          "quantity": 1,
          "condition": "DAMAGED|DEFECTIVE|UNWANTED",
          "productName": "string",
          "productSku": "string",
          "sellingPrice": 90.00
        }
      ]
    }
  },
  "message": "Return request retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Product Review Endpoints

### POST /products/reviews
**Description:** Creates a product review for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/products/reviews`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "productId": "string",
  "rating": 5,
  "title": "string",
  "comment": "string",
  "orderId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "string",
      "productId": "string",
      "customerId": "string",
      "orderId": "string",
      "rating": 5,
      "title": "string",
      "comment": "string",
      "isVerifiedPurchase": true,
      "helpfulCount": 0,
      "notHelpfulCount": 0,
      "status": "PENDING|APPROVED|REJECTED",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Product review created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Subscription Card Endpoints

### GET /subscription-card/
**Description:** Retrieves all visible subscription cards

**Request:**
- Method: `GET`
- Route: `/subscription-card/`

**Response:**
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "price": 1000.00,
        "originalPrice": 1200.00,
        "duration": 30,
        "durationUnit": "DAYS|MONTHS|YEARS",
        "features": ["string"],
        "benefits": ["string"],
        "isActive": true,
        "isFeatured": true,
        "isVisible": true,
        "sortOrder": 1,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Subscription cards retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /subscription-card/:id
**Description:** Retrieves details of a specific subscription card

**Request:**
- Method: `GET`
- Route: `/subscription-card/:id`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": 1000.00,
      "originalPrice": 1200.00,
      "duration": 30,
      "durationUnit": "DAYS|MONTHS|YEARS",
      "features": ["string"],
      "benefits": ["string"],
      "isActive": true,
      "isFeatured": true,
      "isVisible": true,
      "sortOrder": 1,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Card details retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /subscription-card/purchase
**Description:** Purchases a subscription card for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/subscription-card/purchase`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "cardId": "string",
  "referralCode": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userCard": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "UPCOMING|ACTIVE|EXPIRED|PAUSED",
      "startDate": "2023-12-25T10:30:00.000Z",
      "endDate": "2024-01-25T10:30:00.000Z",
      "purchasedAt": "2023-12-25T10:30:00.000Z",
      "activatedAt": "2023-12-25T10:30:00.000Z",
      "expiredAt": "2024-01-25T10:30:00.000Z",
      "currentAmount": 0.00,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Subscription card purchased successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /subscription-card/my-cards
**Description:** Retrieves subscription cards purchased by the authenticated customer

**Request:**
- Method: `GET`
- Route: `/subscription-card/my-cards`
- Headers: `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "userCards": [
      {
        "id": "string",
        "customerId": "string",
        "cardId": "string",
        "referralCodeId": "string",
        "status": "UPCOMING|ACTIVE|EXPIRED|PAUSED",
        "startDate": "2023-12-25T10:30:00.000Z",
        "endDate": "2024-01-25T10:30:00.000Z",
        "purchasedAt": "2023-12-25T10:30:00.000Z",
        "activatedAt": "2023-12-25T10:30:00.000Z",
        "expiredAt": "2024-01-25T10:30:00.000Z",
        "currentAmount": 0.00,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z",
        "card": {
          "id": "string",
          "name": "string",
          "slug": "string",
          "price": 1000.00
        }
      }
    ]
  },
  "message": "Customer subscription cards retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /subscription-card/my-cards/:id
**Description:** Retrieves details of a specific subscription card purchased by the authenticated customer

**Request:**
- Method: `GET`
- Route: `/subscription-card/my-cards/:id`
- Headers: `Authorization: Bearer <token>`
- Parameters: `id` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "userCard": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "UPCOMING|ACTIVE|EXPIRED|PAUSED",
      "startDate": "2023-12-25T10:30:00.000Z",
      "endDate": "2024-01-25T10:30:00.000Z",
      "purchasedAt": "2023-12-25T10:30:00.000Z",
      "activatedAt": "2023-12-25T10:30:00.000Z",
      "expiredAt": "2024-01-25T10:30:00.000Z",
      "currentAmount": 0.00,
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z",
      "card": {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "price": 1000.00,
        "originalPrice": 1200.00,
        "duration": 30,
        "durationUnit": "DAYS|MONTHS|YEARS",
        "features": ["string"],
        "benefits": ["string"]
      }
    }
  },
  "message": "Customer subscription card retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
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
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Data Formats
- Dates: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Currency: Amounts are in Indian Rupees (INR) and represented as decimal values
- IDs: All IDs are string values using cuid format