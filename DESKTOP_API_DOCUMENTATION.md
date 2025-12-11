# Desktop Application API Documentation

This documentation covers all the APIs available for the desktop application, including endpoints for product search, bill history, dashboard data, analytics, and authentication.

## Base URL
```
http://localhost:8080/api/v1/desktop
```

## Authentication APIs

### Login
Authenticate a user and receive access and refresh tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_cuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": "EMPLOYEE"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  },
  "message": "Login successful",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Login failed",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Logout
Logout the current user.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Refresh Token
Obtain a new access token using a refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  },
  "message": "Token refreshed successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "message": "Token refresh failed",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

## Product APIs

### Search Products
Search for products with various filters and infinite scrolling support.

**Endpoint:** `GET /products`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Number of items per page (default: 20) |
| search | string | Search term for product name |
| barcode | string | Search by barcode |
| category | string | Filter by category |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_cuid",
        "name": "Sample Product",
        "image": "https://example.com/image.jpg",
        "sku": "SKU123",
        "price": 99.99,
        "stockStatus": "IN_STOCK",
        "status": "ACTIVE",
        "createdAt": "2025-12-11T10:30:00.000Z",
        "updatedAt": "2025-12-11T10:30:00.000Z",
        "stock": 50
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
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Database connection failed",
  "message": "Problem in fetching products",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

## Bill History APIs

### Get Bill History
Retrieve bill history with search and filtering capabilities.

**Endpoint:** `GET /bills`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Number of items per page (default: 20) |
| search | string | Search term for order number, customer name, email, or phone |
| userId | string | Filter bills created by a specific user |
| startDate | string (ISO date) | Filter bills from this date |
| endDate | string (ISO date) | Filter bills until this date |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bills": [
      {
        "id": "order_cuid",
        "orderNumber": "ORD-2025-0001",
        "customerId": "cust_cuid",
        "itemsTotal": 199.98,
        "taxAmount": 36.00,
        "shippingCharges": 0,
        "discount": 0,
        "totalAmount": 235.98,
        "status": "DELIVERED",
        "paymentStatus": "SUCCESS",
        "customerName": "John Doe",
        "customerEmail": "john@example.com",
        "customerPhone": "+1234567890",
        "source": "SYSTEM",
        "createdAt": "2025-12-11T10:30:00.000Z",
        "updatedAt": "2025-12-11T10:30:00.000Z",
        "items": [
          {
            "id": "item_cuid",
            "productId": "prod_cuid",
            "productName": "Sample Product",
            "quantity": 2,
            "sellingPrice": 99.99,
            "totalAmount": 199.98
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Bill history retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to retrieve orders",
  "message": "Problem in fetching bill history",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

## Dashboard APIs

### Get Dashboard Data
Retrieve dashboard metrics and KPIs.

**Endpoint:** `GET /dashboard`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | string (ISO date) | Filter data from this date |
| endDate | string (ISO date) | Filter data until this date |
| userId | string | Filter data for a specific user |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalSales": 15000.50,
      "totalBills": 45,
      "avgBillValue": 333.34,
      "itemsSold": 120,
      "cashPayments": 30,
      "onlinePayments": 15,
      "walletPayments": 0,
      "totalReturns": 2,
      "totalReturnAmount": 250.00
    },
    "dateRange": {
      "startDate": "2025-11-11T00:00:00.000Z",
      "endDate": "2025-12-11T00:00:00.000Z"
    }
  },
  "message": "Dashboard data retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to calculate dashboard metrics",
  "message": "Problem in fetching dashboard data",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

## Analytics APIs

### Get Daily Sales
Retrieve daily sales data for the last 7 days.

**Endpoint:** `GET /analytics/daily-sales`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | Filter data for a specific user |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "dailySales": [
      {
        "date": "2025-12-05",
        "sales": 1250.75,
        "orders": 8
      },
      {
        "date": "2025-12-06",
        "sales": 2100.50,
        "orders": 12
      },
      {
        "date": "2025-12-07",
        "sales": 980.25,
        "orders": 6
      },
      {
        "date": "2025-12-08",
        "sales": 1750.00,
        "orders": 10
      },
      {
        "date": "2025-12-09",
        "sales": 2300.25,
        "orders": 14
      },
      {
        "date": "2025-12-10",
        "sales": 1850.50,
        "orders": 11
      },
      {
        "date": "2025-12-11",
        "sales": 950.75,
        "orders": 5
      }
    ]
  },
  "message": "Daily sales data retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to retrieve daily sales data",
  "message": "Problem in fetching daily sales data",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Get Payment Methods Distribution
Retrieve distribution of payment methods.

**Endpoint:** `GET /analytics/payment-methods`

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | Filter data for a specific user |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "paymentMethods": {
      "CASH": {
        "count": 30,
        "amount": 7500.50
      },
      "ONLINE": {
        "count": 15,
        "amount": 7500.00
      },
      "WALLET": {
        "count": 0,
        "amount": 0
      }
    }
  },
  "message": "Payment methods distribution retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to retrieve payment methods data",
  "message": "Problem in fetching payment methods distribution",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Get Monthly Trend
Retrieve monthly sales trend data.

**Endpoint:** `GET /analytics/monthly-trend`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "monthlyTrend": [
      {
        "month": "January",
        "orderCount": 45,
        "revenue": 15000.50
      },
      {
        "month": "February",
        "orderCount": 52,
        "revenue": 17500.75
      },
      {
        "month": "March",
        "orderCount": 48,
        "revenue": 16200.25
      }
    ]
  },
  "message": "Monthly trend data retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to retrieve monthly trend data",
  "message": "Problem in fetching monthly trend data",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Get Top Selling Products
Retrieve top selling products by revenue.

**Endpoint:** `GET /analytics/top-products`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "topProducts": [
      {
        "id": "prod1",
        "name": "Popular Product 1",
        "sku": "POP1",
        "salesCount": 150,
        "revenue": 15000.00
      },
      {
        "id": "prod2",
        "name": "Popular Product 2",
        "sku": "POP2",
        "salesCount": 120,
        "revenue": 12000.00
      },
      {
        "id": "prod3",
        "name": "Popular Product 3",
        "sku": "POP3",
        "salesCount": 100,
        "revenue": 10000.00
      }
    ]
  },
  "message": "Top selling products retrieved successfully",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "error": "Failed to retrieve top selling products",
  "message": "Problem in fetching top selling products",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

## Error Handling

All APIs follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing the issue",
  "message": "User-friendly error message",
  "timestamp": "2025-12-11T10:30:00.000Z"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error (unexpected server error)

## Authentication Headers

Most APIs (except authentication endpoints) require the following header:

```
Authorization: Bearer <access_token>
```

Replace `<access_token>` with the JWT token received during login.

## Date Format

All dates in requests and responses follow the ISO 8601 format:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

For query parameters, use date only format:
```
YYYY-MM-DD
```