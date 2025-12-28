# Desktop API Documentation

## Overview
This document provides comprehensive documentation for the desktop application API endpoints, including authentication, order management, bill retrieval, and analytics.

## Authentication Endpoints

### POST /api/desktop/auth/login
**Description:** Authenticates a user and returns access tokens

**Request:**
- Method: `POST`
- Route: `/api/desktop/auth/login`

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
      "role": "string"
    }
  },
  "message": "Login successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

### POST /api/desktop/auth/logout
**Description:** Logs out the current user

**Request:**
- Method: `POST`
- Route: `/api/desktop/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### POST /api/desktop/auth/refresh
**Description:** Refreshes the access token using a refresh token

**Request:**
- Method: `POST`
- Route: `/api/desktop/auth/refresh`
- Headers: `Authorization: Bearer <refresh_token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  },
  "message": "Token refreshed successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Dashboard Endpoints

### GET /api/desktop/dashboard

## Analytics Endpoints

### GET /api/desktop/analytics/daily-sales
**Description:** Retrieves daily sales data for the last 7 days

**Request:**
- Method: `GET`
- Route: `/api/desktop/analytics/daily-sales`

**Query Parameters:**
- `userId` (optional): User ID to filter data for specific user

**Response:**
```json
{
  "success": true,
  "data": {
    "dailySales": [
      {
        "date": "2023-12-19",
        "sales": 1500.00,
        "orders": 5
      },
      {
        "date": "2023-12-20",
        "sales": 2200.00,
        "orders": 8
      },
      {
        "date": "2023-12-21",
        "sales": 1800.00,
        "orders": 6
      },
      {
        "date": "2023-12-22",
        "sales": 2500.00,
        "orders": 10
      },
      {
        "date": "2023-12-23",
        "sales": 1900.00,
        "orders": 7
      },
      {
        "date": "2023-12-24",
        "sales": 2100.00,
        "orders": 9
      },
      {
        "date": "2023-12-25",
        "sales": 1200.00,
        "orders": 4
      }
    ]
  },
  "message": "Daily sales data retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /api/desktop/analytics/payment-methods
**Description:** Retrieves payment methods distribution data

**Request:**
- Method: `GET`
- Route: `/api/desktop/analytics/payment-methods`

**Query Parameters:**
- `userId` (optional): User ID to filter data for specific user

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethods": {
      "CASH": {
        "count": 15,
        "amount": 5000.00
      },
      "ONLINE": {
        "count": 8,
        "amount": 3200.00
      },
      "WALLET": {
        "count": 2,
        "amount": 800.00
      }
    }
  },
  "message": "Payment methods distribution retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /api/desktop/analytics/monthly-trend
**Description:** Retrieves monthly sales trend data for the last 12 months

**Request:**
- Method: `GET`
- Route: `/api/desktop/analytics/monthly-trend`

**Response:**
```json
{
  "success": true,
  "data": {
    "monthlyTrend": [
      {
        "month": "2023-01",
        "sales": 15000.00,
        "orders": 120,
        "avgOrderValue": 125.00
      },
      {
        "month": "2023-02",
        "sales": 18000.00,
        "orders": 140,
        "avgOrderValue": 128.57
      }
    ]
  },
  "message": "Monthly trend data retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /api/desktop/analytics/top-products
**Description:** Retrieves top selling products

**Request:**
- Method: `GET`
- Route: `/api/desktop/analytics/top-products`

**Response:**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "id": "string",
        "name": "Product Name",
        "sku": "SKU123",
        "salesCount": 50,
        "totalRevenue": 4500.00
      }
    ]
  },
  "message": "Top selling products retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```


**Description:** Retrieves dashboard metrics and analytics data

**Request:**
- Method: `GET`
- Route: `/api/desktop/dashboard`

**Query Parameters:**
- `startDate` (optional): Date string in ISO format
- `endDate` (optional): Date string in ISO format
- `userId` (optional): User ID to filter data for specific user

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalSales": 15000.00,
      "totalBills": 25,
      "avgBillValue": 600.00,
      "itemsSold": 50,
      "cashPayments": 15,
      "onlinePayments": 8,
      "walletPayments": 2,
      "totalReturns": 0,
      "totalReturnAmount": 0
    },
    "dateRange": {
      "startDate": "2023-12-01T00:00:00.000Z",
      "endDate": "2023-12-25T23:59:59.999Z"
    }
  },
  "message": "Dashboard data retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Product Search Endpoints

### GET /api/desktop/products
**Description:** Searches for products with pagination support

**Request:**
- Method: `GET`
- Route: `/api/desktop/products`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term for product name/description
- `barcode` (optional): Barcode to search for specific product
- `category` (optional): Category filter

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "sku": "string",
        "name": "Product Name",
        "description": "Product description",
        "mrp": 100.00,
        "sellingPrice": 90.00,
        "stockStatus": "IN_STOCK",
        "status": "ACTIVE",
        "createdAt": "2023-12-25T10:30:00.000Z"
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

## Order Management Endpoints

### POST /api/desktop/generate-bill
**Description:** Creates a new order for desktop sales

**Request:**
- Method: `POST`
- Route: `/api/desktop/generate-bill`

**Request Body:**
```json
{
  "customerId": "string",
  "customerPhone": "string",
  "customerName": "string",
  "items": [
    {
      "productId": "string",
      "quantity": 1,
      "mrp": 100.00,
      "sellingPrice": 90.00
    }
  ],
  "shippingAddressId": "string",
  "billingAddressId": "string",
  "customerNotes": "string",
  "discountCode": "string",
  "paymentMethod": "CASH",
  "paymentDetails": {
    "cash": 90.00,
    "online": 0.00,
    "gatewayName": "CASH"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "ORD-2023-12345",
      "customerId": "string",
      "itemsTotal": 90.00,
      "taxAmount": 9.00,
      "shippingCharges": 0.00,
      "discount": 0.00,
      "totalAmount": 99.00,
      "status": "CONFIRMED",
      "paymentStatus": "SUCCESS",
      "source": "SYSTEM",
      "customerName": "Customer Name",
      "customerEmail": "customer@example.com",
      "customerPhone": "string",
      "createdBy": "string",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Order created successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "customerPhone": "9876543210",
  "customerName": "John Doe",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "mrp": 100.00,
      "sellingPrice": 90.00
    }
  ],
  "paymentMethod": "CASH",
  "paymentDetails": {
    "cash": 180.00,
    "gatewayName": "CASH"
  }
}
```

## Bill Management Endpoints

### GET /api/desktop/bills
**Description:** Retrieves bill history with pagination support

**Request:**
- Method: `GET`
- Route: `/api/desktop/bills`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term for order number or customer
- `userId` (optional): User ID to filter bills created by specific user
- `startDate` (optional): Date string in ISO format
- `endDate` (optional): Date string in ISO format

**Response:**
```json
{
  "success": true,
  "data": {
    "bills": [
      {
        "id": "string",
        "orderNumber": "ORD-2023-12345",
        "customerId": "string",
        "customerName": "Customer Name",
        "customerPhone": "string",
        "itemsTotal": 90.00,
        "taxAmount": 9.00,
        "shippingCharges": 0.00,
        "discount": 0.00,
        "totalAmount": 99.00,
        "status": "DELIVERED",
        "paymentStatus": "SUCCESS",
        "paymentMethod": "CASH",
        "source": "SYSTEM",
        "createdAt": "2023-12-25T10:30:00.000Z",
        "updatedAt": "2023-12-25T10:30:00.000Z",
        "itemCount": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalCount": 200,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Bill history retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

### GET /api/desktop/bills/:orderNumber
**Description:** Retrieves a specific bill by order number

**Request:**
- Method: `GET`
- Route: `/api/desktop/bills/:orderNumber`
- Parameters: `orderNumber` (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "bill": {
      "id": "string",
      "orderNumber": "ORD-2023-12345",
      "customerId": "string",
      "itemsTotal": 90.00,
      "taxAmount": 9.00,
      "shippingCharges": 0.00,
      "discount": 0.00,
      "totalAmount": 99.00,
      "status": "DELIVERED",
      "paymentStatus": "SUCCESS",
      "shippingAddress": {
        "fullName": "Customer Name",
        "phone": "string",
        "addressLine1": "123 Main St",
        "city": "City",
        "state": "State",
        "country": "Country",
        "postalCode": "123456"
      },
      "billingAddress": {
        "fullName": "Customer Name",
        "phone": "string",
        "addressLine1": "123 Main St",
        "city": "City",
        "state": "State",
        "country": "Country",
        "postalCode": "123456"
      },
      "items": [
        {
          "id": "string",
          "orderId": "string",
          "productId": "string",
          "productName": "Product Name",
          "productSku": "SKU123",
          "mrp": 100.00,
          "sellingPrice": 90.00,
          "quantity": 1,
          "discount": 0.00,
          "taxRate": 10.00,
          "taxAmount": 9.00,
          "totalAmount": 99.00
        }
      ],
      "customerName": "Customer Name",
      "customerEmail": "customer@example.com",
      "customerPhone": "string",
      "source": "SYSTEM",
      "createdBy": "string",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "Bill retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Discount Management Endpoints

### GET /api/desktop/discounts
**Description:** Retrieves all discounts with filtering and pagination support

**Request:**
- Method: `GET`
- Route: `/api/desktop/discounts`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term for discount code or description
- `isActive` (optional): Filter by active status (true/false)
- `type` (optional): Filter by discount type (PERCENTAGE/FIXED_AMOUNT)

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
        "type": "PERCENTAGE",
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
            "name": "Category Name",
            "slug": "category-slug"
          }
        ],
        "applicableProducts": [
          {
            "id": "string",
            "name": "Product Name",
            "sku": "string",
            "slug": "product-slug"
          }
        ],
        "applicableBrands": [
          {
            "id": "string",
            "name": "Brand Name",
            "slug": "brand-slug"
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
  "message": "Discounts retrieved successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

## Wallet and OTP Management Endpoints

### POST /api/desktop/send-otp
**Description:** Sends OTP for wallet payment verification

**Request:**
- Method: `POST`
- Route: `/api/desktop/send-otp`

**Request Body:**
```json
{
  "mobileNumber": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "otp": "123456",
    "phone": "string"
  },
  "message": "OTP sent successfully",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "mobileNumber": "9876543210"
}
```

### POST /api/desktop/verify-otp-and-get-wallet
**Description:** Verifies OTP and retrieves customer wallet details

**Request:**
- Method: `POST`
- Route: `/api/desktop/verify-otp-and-get-wallet`

**Request Body:**
```json
{
  "mobileNumber": "string",
  "otp": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "string",
      "name": "Customer Name",
      "phone": "string",
      "email": "customer@example.com"
    },
    "wallet": {
      "id": "string",
      "balance": 1000.00,
      "type": "SHOPPING",
      "createdAt": "2023-12-25T10:30:00.000Z"
    }
  },
  "message": "OTP verified successfully and wallet details retrieved",
  "timestamp": "2023-12-25T10:30:00.000Z"
}
```

**Example Request:**
```json
{
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```
## Return Management Endpoints

### POST /api/desktop/create-return-request
**Description:** Creates a new return request for desktop sales

**Request:**
- Method: `POST`
- Route: `/api/desktop/create-return-request`

**Request Body:**
```json
{
  "orderId": "string",
  "type": "RETURN",
  "reason": "string",
  "detailedReason": "string",
  "items": [
    {
      "orderItemId": "string",
      "quantity": 1,
      "condition": "DAMAGED|DEFECTIVE|UNWANTED"
    }
  ],
  "refundMethod": "CASH|STORE_CREDIT"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "return": {
      "id": "cmjq3zn8i0002giqngu4qzkr7",
      "returnNumber": "RET-1766949295572",
      "orderId": "cmjq2y3op0004kyd5eabnh5jj",
      "type": "RETURN",
      "reason": "Product damaged",
      "status": "APPROVED",
      "refundAmount": "17991",
      "refundMethod": "CASH",
      "createdAt": "2025-12-28T19:14:56.994Z",
      "updatedAt": "2025-12-28T19:14:56.994Z",
      "source": "SYSTEM"
    }
  },
  "message": "Return processed successfully",
  "timestamp": "2025-12-28T19:14:59.672Z"
}
```

**Example Request:**
```json
{
  "orderId": "cmjq2y3op0004kyd5eabnh5jj",
  "type": "RETURN",
  "reason": "Product damaged",
  "detailedReason": "Received product is damaged",
  "items": [
    {
      "orderItemId": "cmjq2y3op0006kyd54zebyw05",
      "quantity": 1,
      "condition": "DAMAGED"
    }
  ],
  "refundMethod": "CASH"
}
```

### GET /api/desktop/get-returns
**Description:** Retrieves return history with filtering and pagination support

**Request:**
- Method: `GET`
- Route: `/api/desktop/get-returns`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by return status (PENDING|APPROVED|REJECTED)
- `orderId` (optional): Filter by specific order ID
- `type` (optional): Filter by return type (RETURN|EXCHANGE)
- `startDate` (optional): Date string in ISO format
- `endDate` (optional): Date string in ISO format

**Response:**
```json
{
  "success": true,
  "data": {
    "returns": [
      {
        "id": "cmjq3zn8i0002giqngu4qzkr7",
        "returnNumber": "RET-1766949295572",
        "type": "RETURN",
        "reason": "Product damaged",
        "status": "APPROVED",
        "refundAmount": "17991",
        "refundMethod": "CASH",
        "createdAt": "2025-12-28T19:14:56.994Z",
        "updatedAt": "2025-12-28T19:14:56.994Z",
        "order": {
          "orderNumber": "ORD-1766947545383-891",
          "totalAmount": "19230.38",
          "status": "RETURNED",
          "customerName": "Vikash",
          "customerPhone": "7894565456"
        },
        "items": [
          {
            "quantity": 1,
            "condition": "DAMAGED",
            "productName": "Nespresso Vertuo Next Coffee Machine",
            "productSku": "NS-VN-1766933082399",
            "sellingPrice": "17991"
          }
        ]
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Returns fetched successfully",
  "timestamp": "2025-12-28T19:26:23.989Z"
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

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Data Formats
- Dates: ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Currency: Amounts are in Indian Rupees (INR) and represented as decimal values
- IDs: All IDs are string values using cuid format