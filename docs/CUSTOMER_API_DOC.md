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
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "dateOfBirth": "2023-12-25",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "preferences": {},
      "metadata": {},
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Customer profile retrieved successfully",
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
  "dateOfBirth": "2023-12-25",
  "gender": "MALE|FEMALE|OTHER",
  "avatar": "string",
  "bio": "string",
  "tier": "BRONZE|SILVER|GOLD|PLATINUM",
  "preferences": {},
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "string",
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "dateOfBirth": "2023-12-25",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "preferences": {},
      "metadata": {},
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
        "addressLine2": "string",
        "city": "string",
        "state": "string",
        "country": "string",
        "postalCode": "string",
        "isDefault": true,
        "isBilling": true,
        "isShipping": true,
        "type": "HOME|OFFICE|OTHER",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Addresses fetched successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /customer/me/addresses
**Description:** Creates a new address for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/customer/me/addresses`
- Headers: `Authorization: Bearer <token>`
- Request Body:
```json
{
  "fullName": "string",
  "phone": "string",
  "addressLine1": "string",
  "addressLine2": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "isDefault": true,
  "isBilling": true,
  "isShipping": true,
  "type": "HOME|OFFICE|OTHER"
}
```

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
      "isDefault": true,
      "isBilling": true,
      "isShipping": true,
      "type": "HOME|OFFICE|OTHER",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Address created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### PUT /customer/me/addresses/:id
**Description:** Updates an existing address for the authenticated customer

**Request:**
- Method: `PUT`
- Route: `/customer/me/addresses/:id`
- Headers: `Authorization: Bearer <token>`
- Parameters: `id` (required)
- Request Body:
```json
{
  "fullName": "string",
  "phone": "string",
  "addressLine1": "string",
  "addressLine2": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "postalCode": "string",
  "isDefault": true,
  "isBilling": true,
  "isShipping": true,
  "type": "HOME|OFFICE|OTHER"
}
```

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
      "isDefault": true,
      "isBilling": true,
      "isShipping": true,
      "type": "HOME|OFFICE|OTHER",
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
      "isDefault": true,
      "isBilling": true,
      "isShipping": true,
      "type": "HOME|OFFICE|OTHER",
      "createdAt": "2023-12-25T10:30:00.000Z",
      "updatedAt": "2023-12-25T10:30:00.000Z"
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

### GET /product/brands
**Description:** Retrieves all product brands

**Request:**
- Method: `GET`
- Route: `/product/brands`

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

### GET /product/categories
**Description:** Retrieves all product categories

**Request:**
- Method: `GET`
- Route: `/product/categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "parentId": "string",
        "image": "string",
        "banner": "string",
        "isFeatured": true,
        "isActive": true,
        "sortOrder": 1,
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ]
  },
  "message": "Categories retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /product/
**Description:** Retrieves all products with pagination and filtering

**Request:**
- Method: `GET`
- Route: `/product/`
- Query Parameters:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 20)
  - `search` (optional): Search term for product name/description
  - `category` (optional): Category filter
  - `brand` (optional): Brand filter
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
  - `inStock` (optional): Filter for in-stock items (true/false)

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
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Products retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /product/slug/:slug
**Description:** Retrieves a product by its slug

**Request:**
- Method: `GET`
- Route: `/product/slug/:slug`
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

### GET /product/:id/reviews
**Description:** Retrieves product reviews for a specific product

**Request:**
- Method: `GET`
- Route: `/product/:id/reviews`
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
        "updatedAt": "2023-12-25T10:30:00.000Z"
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 10
  },
  "message": "Product reviews retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /product/discounts
**Description:** Retrieves discount offers with filtering and pagination

**Request:**
- Method: `GET`
- Route: `/product/discounts`
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

### GET /product/discounts/:code
**Description:** Retrieves a specific discount offer by code

**Request:**
- Method: `GET`
- Route: `/product/discounts/:code`
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

### POST /product/wishlist/items
**Description:** Adds a product to the customer's wishlist

**Request:**
- Method: `POST`
- Route: `/product/wishlist/items`
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

### DELETE /product/wishlist/items/:productId
**Description:** Removes a product from the customer's wishlist

**Request:**
- Method: `DELETE`
- Route: `/product/wishlist/items/:productId`
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

### GET /product/wishlist/items
**Description:** Retrieves all items in the customer's wishlist

**Request:**
- Method: `GET`
- Route: `/product/wishlist/items`
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

### GET /product/cart
**Description:** Retrieves the customer's cart

**Request:**
- Method: `GET`
- Route: `/product/cart`
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

### POST /product/cart
**Description:** Adds an item to the customer's cart

**Request:**
- Method: `POST`
- Route: `/product/cart`
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

### PUT /product/cart
**Description:** Updates the quantity of an item in the customer's cart

**Request:**
- Method: `PUT`
- Route: `/product/cart`
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

### DELETE /product/cart
**Description:** Clears all items from the customer's cart

**Request:**
- Method: `DELETE`
- Route: `/product/cart`
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

### DELETE /product/cart/items/:productId/:variantId
**Description:** Removes a specific item from the customer's cart

**Request:**
- Method: `DELETE`
- Route: `/product/cart/items/:productId/:variantId`
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

### POST /product/cart/buy
**Description:** Creates an order from the customer's cart

**Request:**
- Method: `POST`
- Route: `/product/cart/buy`
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

### POST /product/orders
**Description:** Creates a new order for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/product/orders`
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

### GET /product/orders
**Description:** Retrieves all orders for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/product/orders`
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

### GET /product/orders/:id
**Description:** Retrieves a specific order for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/product/orders/:id`
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

### POST /product/returns
**Description:** Creates a return request for a customer order

**Request:**
- Method: `POST`
- Route: `/product/returns`
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

### GET /product/returns
**Description:** Retrieves return requests for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/product/returns`
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

### GET /product/returns/:id
**Description:** Retrieves a specific return request for the authenticated customer

**Request:**
- Method: `GET`
- Route: `/product/returns/:id`
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

### POST /product/reviews
**Description:** Creates a product review for the authenticated customer

**Request:**
- Method: `POST`
- Route: `/product/reviews`
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