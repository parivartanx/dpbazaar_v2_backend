# Admin API Documentation

This document provides comprehensive API documentation for all admin routes in the DPBazaar application.

## Table of Contents

### 1. Authentication & Security
- [Authentication](#authentication)
- [Dashboard](#dashboard)
- [Session Management](#session-management)
- [Audit Log Management](#audit-log-management)

### 2. User & Employee Management
- [User Management](#user-management)
- [Employee Management](#employee-management)
- [Department Management](#department-management)
- [Permission Management](#permission-management)
- [Employee Permission Management](#employee-permission-management)
- [Employee Activity Management](#employee-activity-management)

### 3. Product & Category Management
- [Banner Management](#banner-management)
- [Brand Management](#brand-management)
- [Category Management](#category-management)
- [Product Management](#product-management)
- [Product Variant Management](#product-variant-management)
- [Attribute Management](#attribute-management)
- [Product Attribute Management](#product-attribute-management)
- [Category Attribute Management](#category-attribute-management)
- [Product Relation Management](#product-relation-management)

### 4. Customer & Customer Engagement
- [Customer Management](#customer-management)
- [Customer Segment Management](#customer-segment-management)
- [Referral Management](#referral-management)
- [Review Management](#review-management)
- [Notification Management](#notification-management)

### 5. Financial & Payment Management
- [Wallet Management](#wallet-management)
- [Wallet Transaction Management](#wallet-transaction-management)
- [Card Management](#card-management)
- [Subscription Card Management](#subscription-card-management)
- [User Subscription Card Management](#user-subscription-card-management)
- [Order Management](#order-management)
- [Return Management](#return-management)
- [Refund Management](#refund-management)
- [Payment Management](#payment-management)
- [Invoice Management](#invoice-management)
- [Discount Management](#discount-management)

### 6. Vendor & Inventory Management
- [Vendor Management](#vendor-management)
- [Vendor Payout Management](#vendor-payout-management)
- [Warehouse Management](#warehouse-management)
- [Inventory Management](#inventory-management)
- [Stock Movement Management](#stock-movement-management)
- [Price History Management](#price-history-management)

### 7. Delivery & Logistics Management
- [Delivery Agent Management](#delivery-agent-management)
- [Delivery Management](#delivery-management)
- [Delivery Earning Management](#delivery-earning-management)

### 8. Communication & System Management
- [Email Template Management](#email-template-management)
- [Address Management](#address-management)
- [System Setting Management](#system-setting-management)
- [Job Execution Management](#job-execution-management)

## Base Path
- All endpoints below are mounted under the API prefix `/v1`.
- Admin/Org routes are mounted at `/org`. The full base path for this document is `/v1/org`.
- Where older paths used `/admin/...`, they are now `/org/...`.

## Authentication

### POST /org/login

**Description:** Admin login to access the admin panel.

**Request:**
- Method: `POST`
- Endpoint: `/org/login`
- Content-Type: `application/json`
- Body: `{ email: string, password: string }`

**Response:**
- Success: `200 OK`
- Error: `401 Unauthorized`

**Success Response:**
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
      "status": "string"
    },
    "token": "string"
  },
  "message": "Admin login successful",
  "timestamp": "string"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string",
  "message": "Admin login failed",
  "timestamp": "string"
}
```

## Dashboard

### GET /org/dashboard

**Description:** Get admin dashboard data including revenue, orders, customers, etc.

**Request:**
- Method: `GET`
- Endpoint: `/org/dashboard`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Admin dashboard data fetched successfully",
  "data": {
    "revenue": "number",
    "totalOrders": "number",
    "totalCustomers": "number",
    "avgOrderValue": "number",
    "weeklySales": "array",
    "salesByCategory": "array",
    "recentOrders": "array"
  },
  "timestamp": "string"
}
```

### GET /org/analytics

**Description:** Get analytics dashboard data.

**Request:**
- Method: `GET`
- Endpoint: `/org/analytics`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "string",
  "data": "object",
  "timestamp": "string"
}
```

## User Management

### GET /users/counts

**Description:** Get user counts for user management dashboard.

**Request:**
- Method: `GET`
- Endpoint: `/users/counts`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User counts fetched successfully",
  "data": {
    "totalUsers": "number",
    "activeUsers": "number",
    "inactiveUsers": "number",
    "deletedUsers": "number"
  },
  "timestamp": "string"
}
```

### GET /users/filter

**Description:** Filter and search users.

**Request:**
- Method: `GET`
- Endpoint: `/users/filter`
- Query Parameters:
  - `gender`: string
  - `status`: string
  - `search`: string
  - `page`: number (default: 1)
  - `limit`: number (default: 20)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Filtered users fetched successfully",
  "data": {
    "users": [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string",
        "status": "string",
        "createdAt": "string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number"
    }
  },
  "timestamp": "string"
}
```

### GET /users

**Description:** List all users.

**Request:**
- Method: `GET`
- Endpoint: `/users`
- Query Parameters:
  - `role`: string
  - `status`: string
  - `page`: number (default: 1)
  - `limit`: number (default: 20)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User List",
  "data": {
    "users": [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string",
        "status": "string",
        "createdAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /users

**Description:** Create a new user.

**Request:**
- Method: `POST`
- Endpoint: `/users`
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, email: string, password: string, role: string, phone: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### GET /users/:id

**Description:** Get a user by ID.

**Request:**
- Method: `GET`
- Endpoint: `/users/:id`
- Path Parameter: `id` (user ID)

**Response:**
- Success: `200 OK`
- Error: `404 Not Found`, `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User Found",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /users/:id

**Description:** Update a user.

**Request:**
- Method: `PUT`
- Endpoint: `/users/:id`
- Path Parameter: `id` (user ID)
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, email: string, role: string, status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /users/:id

**Description:** Delete a user.

**Request:**
- Method: `DELETE`
- Endpoint: `/users/:id`
- Path Parameter: `id` (user ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /users/:id/restore

**Description:** Restore a deleted user.

**Request:**
- Method: `PATCH`
- Endpoint: `/users/:id/restore`
- Path Parameter: `id` (user ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User restored successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /users/:id/lock

**Description:** Lock a user account.

**Request:**
- Method: `PATCH`
- Endpoint: `/users/:id/lock`
- Path Parameter: `id` (user ID)
- Content-Type: `application/json`
- Body: `{ lockedUntil: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User locked successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /users/:id/unlock

**Description:** Unlock a user account.

**Request:**
- Method: `PATCH`
- Endpoint: `/users/:id/unlock`
- Path Parameter: `id` (user ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User unlocked successfully",
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "status": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /users/:id/reset-password

**Description:** Reset user password.

**Request:**
- Method: `PATCH`
- Endpoint: `/users/:id/reset-password`
- Path Parameter: `id` (user ID)
- Content-Type: `application/json`
- Body: `{ password: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "timestamp": "string"
}
```

## Employee Management

### GET /employees

**Description:** Get all employees.

**Request:**
- Method: `GET`
- Endpoint: `/employees`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [
      {
        "id": "string",
        "userId": "string",
        "employeeCode": "string",
        "department": {
          "id": "string",
          "name": "string"
        },
        "status": "string",
        "designation": "string",
        "reportingTo": "string",
        "joiningDate": "string",
        "salary": "number",
        "metadata": {},
        "deletedAt": null,
        "createdAt": "string",
        "updatedAt": "string",
        "firstName": "string",
        "lastName": "string",
        "middleName": "string",
        "email": "string",
        "phone": "string",
        "username": "string",
        "role": "EMPLOYEE",
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "isTwoFactorEnabled": false,
        "dateOfBirth": "string",
        "gender": "MALE|FEMALE|OTHER",
        "avatar": "string",
        "bio": "string",
        "lastLoginAt": "string",
        "lastLoginIp": "string",
        "permissions": []
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /employees/:id

**Description:** Get employee by ID.

**Request:**
- Method: `GET`
- Endpoint: `/employees/:id`
- Path Parameter: `id` (employee ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

### POST /employees

**Description:** Create a new employee.

**Request:**
- Method: `POST`
- Endpoint: `/employees`
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, email: string, password: string, departmentId: string, designation: string, reportingTo: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

### PUT /employees/:id

**Description:** Update an employee.

**Request:**
- Method: `PUT`
- Endpoint: `/employees/:id`
- Path Parameter: `id` (employee ID)
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, departmentId: string, designation: string, reportingTo: string, status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

### DELETE /employees/:id

**Description:** Delete an employee.

**Request:**
- Method: `DELETE`
- Endpoint: `/employees/:id`
- Path Parameter: `id` (employee ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

### PATCH /employees/:id/status

**Description:** Update employee status.

**Request:**
- Method: `PATCH`
- Endpoint: `/employees/:id/status`
- Path Parameter: `id` (employee ID)
- Content-Type: `application/json`
- Body: `{ status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee status updated successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

### PATCH /employees/:id/department

**Description:** Assign department to employee.

**Request:**
- Method: `PATCH`
- Endpoint: `/employees/:id/department`
- Path Parameter: `id` (employee ID)
- Content-Type: `application/json`
- Body: `{ departmentId: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Department assigned to employee successfully",
  "data": {
    "employee": {
      "id": "string",
      "userId": "string",
      "employeeCode": "string",
      "department": {
        "id": "string",
        "name": "string"
      },
      "status": "string",
      "designation": "string",
      "reportingTo": "string",
      "joiningDate": "string",
      "salary": "number",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string",
      "firstName": "string",
      "lastName": "string",
      "middleName": "string",
      "email": "string",
      "phone": "string",
      "username": "string",
      "role": "EMPLOYEE",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      "isTwoFactorEnabled": false,
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "permissions": []
    }
  },
  "timestamp": "string"
}
```

## Department Management

### GET /department

**Description:** Get all departments.

**Request:**
- Method: `GET`
- Endpoint: `/department`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": {
    "departments": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "description": "string",
        "isActive": "boolean",
        "parent": {
          "id": "string",
          "name": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /department/:id

**Description:** Get department by ID.

**Request:**
- Method: `GET`
- Endpoint: `/department/:id`
- Path Parameter: `id` (department ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Department retrieved successfully",
  "data": {
    "department": {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "isActive": "boolean",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /department

**Description:** Create a new department.

**Request:**
- Method: `POST`
- Endpoint: `/department`
- Content-Type: `application/json`
- Body: `{ name: string, code: string, description: string, parentId: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "department": {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "isActive": "boolean",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /department/:id

**Description:** Update a department.

**Request:**
- Method: `PUT`
- Endpoint: `/department/:id`
- Path Parameter: `id` (department ID)
- Content-Type: `application/json`
- Body: `{ name: string, code: string, description: string, parentId: string, isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "department": {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "isActive": "boolean",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /department/:id

**Description:** Delete a department.

**Request:**
- Method: `DELETE`
- Endpoint: `/department/:id`
- Path Parameter: `id` (department ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully",
  "data": {
    "department": {
      "id": "string",
      "name": "string",
      "code": "string",
      "description": "string",
      "isActive": "boolean",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Permission Management

### GET /permissions

**Description:** Get all permissions.

**Request:**
- Method: `GET`
- Endpoint: `/permissions`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": "string",
        "resource": "string",
        "action": "string",
        "description": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /permissions/:id

**Description:** Get permission by ID.

**Request:**
- Method: `GET`
- Endpoint: `/permissions/:id`
- Path Parameter: `id` (permission ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission retrieved successfully",
  "data": {
    "permission": {
      "id": "string",
      "resource": "string",
      "action": "string",
      "description": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /permissions

**Description:** Create a new permission.

**Request:**
- Method: `POST`
- Endpoint: `/permissions`
- Content-Type: `application/json`
- Body: `{ resource: string, action: string, description: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "permission": {
      "id": "string",
      "resource": "string",
      "action": "string",
      "description": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /permissions/:id

**Description:** Update a permission.

**Request:**
- Method: `PUT`
- Endpoint: `/permissions/:id`
- Path Parameter: `id` (permission ID)
- Content-Type: `application/json`
- Body: `{ resource: string, action: string, description: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "permission": {
      "id": "string",
      "resource": "string",
      "action": "string",
      "description": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /permissions/:id

**Description:** Delete a permission.

**Request:**
- Method: `DELETE`
- Endpoint: `/permissions/:id`
- Path Parameter: `id` (permission ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "data": {
    "permission": {
      "id": "string",
      "resource": "string",
      "action": "string",
      "description": "string"
    }
  },
  "timestamp": "string"
}
```

## Employee Permission Management

### GET /employee/permissions/:employeeId

**Description:** Get employee permissions.

**Request:**
- Method: `GET`
- Endpoint: `/employee/permissions/:employeeId`
- Path Parameter: `employeeId` (employee ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": "string",
        "permission": {
          "id": "string",
          "resource": "string",
          "action": "string",
          "description": "string"
        },
        "grantedBy": "string",
        "grantedAt": "string",
        "expiresAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /employee/permissions

**Description:** Assign permission to employee.

**Request:**
- Method: `POST`
- Endpoint: `/employee/permissions`
- Content-Type: `application/json`
- Body: `{ employeeId: string, permissionId: string, expiresAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission assigned to employee successfully",
  "data": {
    "employeePermission": {
      "id": "string",
      "employeeId": "string",
      "permissionId": "string",
      "grantedBy": "string",
      "grantedAt": "string",
      "expiresAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /employee/permissions/:id

**Description:** Revoke permission from employee.

**Request:**
- Method: `DELETE`
- Endpoint: `/employee/permissions/:id`
- Path Parameter: `id` (employee permission ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Permission revoked from employee successfully",
  "data": {
    "employeePermission": {
      "id": "string",
      "employeeId": "string",
      "permissionId": "string",
      "grantedBy": "string",
      "grantedAt": "string",
      "expiresAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Banner Management

### GET /org/banners

**Description:** Get all banners with pagination and filtering.

**Request:**
- Method: `GET`
- Endpoint: `/org/banners`
- Query Parameters:
  - `page`: number (default: 1)
  - `limit`: number (default: 20)
  - `status`: string (ACTIVE, INACTIVE, etc.)
  - `type`: string (IMAGE, VIDEO, HTML)
  - `placement`: string (HOME_TOP, HOME_MIDDLE, etc.)
  - `search`: string

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
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
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number"
    }
  },
  "timestamp": "string"
}
```

### GET /org/banners/:id

**Description:** Get a specific banner by ID.

**Request:**
- Method: `GET`
- Endpoint: `/org/banners/:id`
- Path Parameter: `id` (banner ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Banner retrieved successfully",
  "data": {
    "banner": {
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
  },
  "timestamp": "string"
}
```

### POST /org/banners

**Description:** Create a new banner.

**Request:**
- Method: `POST`
- Endpoint: `/org/banners`
- Content-Type: `application/json`
- Body: `{ title: string, subtitle: string, imageUrl: string, targetUrl: string, type: string, placement: string, status: string, priority: number, startDate: date, endDate: date, metadata: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Banner created successfully",
  "data": {
    "banner": {
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
  },
  "timestamp": "string"
}
```

### PUT /org/banners/:id

**Description:** Update a banner.

**Request:**
- Method: `PUT`
- Endpoint: `/org/banners/:id`
- Path Parameter: `id` (banner ID)
- Content-Type: `application/json`
- Body: `{ title: string, subtitle: string, imageUrl: string, targetUrl: string, type: string, placement: string, status: string, priority: number, startDate: date, endDate: date, metadata: object }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Banner updated successfully",
  "data": {
    "banner": {
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
  },
  "timestamp": "string"
}
```

### DELETE /org/banners/:id

**Description:** Delete a banner.

**Request:**
- Method: `DELETE`
- Endpoint: `/org/banners/:id`
- Path Parameter: `id` (banner ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Banner deleted successfully",
  "data": {
    "banner": {
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
  },
  "timestamp": "string"
}
```


### POST /org/login

**Description:** Admin login to access the admin panel.

**Request:**
- Method: `POST`
- Endpoint: `/org/login`
- Content-Type: `application/json`
- Body: `{ email: string, password: string }`

**Response:**
- Success: `200 OK`
- Error: `401 Unauthorized`

**Success Response:**
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
      "status": "string"
    },
    "token": "string"
  },
  "message": "Admin login successful",
  "timestamp": "string"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string",
  "message": "Admin login failed",
  "timestamp": "string"
}
```

## Brand Management

### GET /brands

**Description:** Get all brands.

**Request:**
- Method: `GET`
- Endpoint: `/brands`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": {
    "brands": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "logo": "string",
        "description": "string",
        "website": "string",
        "isActive": "boolean",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /brands/:id

**Description:** Get brand by ID.

**Request:**
- Method: `GET`
- Endpoint: `/brands/:id`
- Path Parameter: `id` (brand ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Brand retrieved successfully",
  "data": {
    "brand": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "description": "string",
      "website": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /brands

**Description:** Create a new brand.

**Request:**
- Method: `POST`
- Endpoint: `/brands`
- Content-Type: `application/json`
- Body: `{ name: string, description: string, website: string, isActive: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "brand": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "description": "string",
      "website": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /brands/:id

**Description:** Update a brand.

**Request:**
- Method: `PUT`
- Endpoint: `/brands/:id`
- Path Parameter: `id` (brand ID)
- Content-Type: `application/json`
- Body: `{ name: string, description: string, website: string, isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "brand": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "description": "string",
      "website": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /brands/:id

**Description:** Delete a brand.

**Request:**
- Method: `DELETE`
- Endpoint: `/brands/:id`
- Path Parameter: `id` (brand ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Brand deleted successfully",
  "data": {
    "brand": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "logo": "string",
      "description": "string",
      "website": "string",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Category Management

### GET /categories

**Description:** Get all categories.

**Request:**
- Method: `GET`
- Endpoint: `/categories`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "image": "string",
        "icon": "string",
        "parentId": "string",
        "level": "number",
        "path": "string",
        "metaTitle": "string",
        "metaDescription": "string",
        "metaKeywords": "string[]",
        "displayOrder": "number",
        "isActive": "boolean",
        "isFeatured": "boolean",
        "commissionRate": "number",
        "createdAt": "string",
        "updatedAt": "string",
        "parent": {
          "id": "string",
          "name": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /categories/:id

**Description:** Get category by ID.

**Request:**
- Method: `GET`
- Endpoint: `/categories/:id`
- Path Parameter: `id` (category ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /categories

**Description:** Create a new category.

**Request:**
- Method: `POST`
- Endpoint: `/categories`
- Content-Type: `application/json`
- Body: `{ name: string, description: string, parentId: string, displayOrder: number, isActive: boolean, isFeatured: boolean, commissionRate: number }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /categories/:id

**Description:** Update a category.

**Request:**
- Method: `PUT`
- Endpoint: `/categories/:id`
- Path Parameter: `id` (category ID)
- Content-Type: `application/json`
- Body: `{ name: string, description: string, parentId: string, displayOrder: number, isActive: boolean, isFeatured: boolean, commissionRate: number }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /categories/:id

**Description:** Delete a category.

**Request:**
- Method: `DELETE`
- Endpoint: `/categories/:id`
- Path Parameter: `id` (category ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /categories/:id/feature

**Description:** Toggle category featured status.

**Request:**
- Method: `PATCH`
- Endpoint: `/categories/:id/feature`
- Path Parameter: `id` (category ID)
- Content-Type: `application/json`
- Body: `{ isFeatured: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category featured status updated successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /categories/:id/activate

**Description:** Toggle category active status.

**Request:**
- Method: `PATCH`
- Endpoint: `/categories/:id/activate`
- Path Parameter: `id` (category ID)
- Content-Type: `application/json`
- Body: `{ isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Category active status updated successfully",
  "data": {
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "icon": "string",
      "parentId": "string",
      "level": "number",
      "path": "string",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "displayOrder": "number",
      "isActive": "boolean",
      "isFeatured": "boolean",
      "commissionRate": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "parent": {
        "id": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Product Management

### GET /products

**Description:** Get all products.

**Request:**
- Method: `GET`
- Endpoint: `/products`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": "string",
        "sku": "string",
        "name": "string",
        "slug": "string",
        "description": "string",
        "shortDescription": "string",
        "barcode": "string",
        "mrp": "number",
        "sellingPrice": "number",
        "costPrice": "number",
        "taxRate": "number",
        "hsnCode": "string",
        "brandId": "string",
        "vendorId": "string",
        "status": "string",
        "stockStatus": "string",
        "weight": "number",
        "dimensions": "object",
        "metaTitle": "string",
        "metaDescription": "string",
        "metaKeywords": "string[]",
        "isFeatured": "boolean",
        "isNewArrival": "boolean",
        "isBestSeller": "boolean",
        "isReturnable": "boolean",
        "returnPeriodDays": "number",
        "viewCount": "number",
        "salesCount": "number",
        "avgRating": "number",
        "totalReviews": "number",
        "tags": "string[]",
        "metadata": "object",
        "publishedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "brand": {
          "id": "string",
          "name": "string"
        },
        "vendor": {
          "id": "string",
          "businessName": "string"
        },
        "images": [
          {
            "id": "string",
            "url": "string",
            "thumbnailUrl": "string",
            "alt": "string",
            "caption": "string",
            "displayOrder": "number",
            "isPrimary": "boolean"
          }
        ]
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /products/:id

**Description:** Get product by ID.

**Request:**
- Method: `GET`
- Endpoint: `/products/:id`
- Path Parameter: `id` (product ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "barcode": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "costPrice": "number",
      "taxRate": "number",
      "hsnCode": "string",
      "brandId": "string",
      "vendorId": "string",
      "status": "string",
      "stockStatus": "string",
      "weight": "number",
      "dimensions": "object",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "isFeatured": "boolean",
      "isNewArrival": "boolean",
      "isBestSeller": "boolean",
      "isReturnable": "boolean",
      "returnPeriodDays": "number",
      "viewCount": "number",
      "salesCount": "number",
      "avgRating": "number",
      "totalReviews": "number",
      "tags": "string[]",
      "metadata": "object",
      "publishedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "brand": {
        "id": "string",
        "name": "string"
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "categories": [
        {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      ],
      "variants": [
        {
          "id": "string",
          "variantSku": "string",
          "variantName": "string",
          "mrp": "number",
          "sellingPrice": "number",
          "attributes": "object",
          "weight": "number",
          "dimensions": "object",
          "isActive": "boolean",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "images": [
        {
          "id": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string",
          "caption": "string",
          "displayOrder": "number",
          "isPrimary": "boolean"
        }
      ],
      "attributes": [
        {
          "id": "string",
          "attributeType": {
            "id": "string",
            "name": "string",
            "dataType": "string",
            "values": "string[]"
          },
          "value": "string"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### POST /products

**Description:** Create a new product.

**Request:**
- Method: `POST`
- Endpoint: `/products`
- Content-Type: `application/json`
- Body: `{ name: string, description: string, shortDescription: string, sku: string, mrp: number, sellingPrice: number, costPrice: number, taxRate: number, hsnCode: string, brandId: string, vendorId: string, status: string, weight: number, dimensions: object, metaTitle: string, metaDescription: string, metaKeywords: string[], isFeatured: boolean, isNewArrival: boolean, isBestSeller: boolean, isReturnable: boolean, returnPeriodDays: number, tags: string[], categories: string[], images: string[], attributes: object[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "barcode": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "costPrice": "number",
      "taxRate": "number",
      "hsnCode": "string",
      "brandId": "string",
      "vendorId": "string",
      "status": "string",
      "stockStatus": "string",
      "weight": "number",
      "dimensions": "object",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "isFeatured": "boolean",
      "isNewArrival": "boolean",
      "isBestSeller": "boolean",
      "isReturnable": "boolean",
      "returnPeriodDays": "number",
      "viewCount": "number",
      "salesCount": "number",
      "avgRating": "number",
      "totalReviews": "number",
      "tags": "string[]",
      "metadata": "object",
      "publishedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "brand": {
        "id": "string",
        "name": "string"
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "images": [
        {
          "id": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string",
          "caption": "string",
          "displayOrder": "number",
          "isPrimary": "boolean"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### PUT /products/:id

**Description:** Update a product.

**Request:**
- Method: `PUT`
- Endpoint: `/products/:id`
- Path Parameter: `id` (product ID)
- Content-Type: `application/json`
- Body: `{ name: string, description: string, shortDescription: string, sku: string, mrp: number, sellingPrice: number, costPrice: number, taxRate: number, hsnCode: string, brandId: string, vendorId: string, status: string, weight: number, dimensions: object, metaTitle: string, metaDescription: string, metaKeywords: string[], isFeatured: boolean, isNewArrival: boolean, isBestSeller: boolean, isReturnable: boolean, returnPeriodDays: number, tags: string[], categories: string[], images: string[], attributes: object[] }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "barcode": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "costPrice": "number",
      "taxRate": "number",
      "hsnCode": "string",
      "brandId": "string",
      "vendorId": "string",
      "status": "string",
      "stockStatus": "string",
      "weight": "number",
      "dimensions": "object",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "isFeatured": "boolean",
      "isNewArrival": "boolean",
      "isBestSeller": "boolean",
      "isReturnable": "boolean",
      "returnPeriodDays": "number",
      "viewCount": "number",
      "salesCount": "number",
      "avgRating": "number",
      "totalReviews": "number",
      "tags": "string[]",
      "metadata": "object",
      "publishedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "brand": {
        "id": "string",
        "name": "string"
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "images": [
        {
          "id": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string",
          "caption": "string",
          "displayOrder": "number",
          "isPrimary": "boolean"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### DELETE /products/:id

**Description:** Soft delete a product.

**Request:**
- Method: `DELETE`
- Endpoint: `/products/:id`
- Path Parameter: `id` (product ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "barcode": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "costPrice": "number",
      "taxRate": "number",
      "hsnCode": "string",
      "brandId": "string",
      "vendorId": "string",
      "status": "string",
      "stockStatus": "string",
      "weight": "number",
      "dimensions": "object",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "isFeatured": "boolean",
      "isNewArrival": "boolean",
      "isBestSeller": "boolean",
      "isReturnable": "boolean",
      "returnPeriodDays": "number",
      "viewCount": "number",
      "salesCount": "number",
      "avgRating": "number",
      "totalReviews": "number",
      "tags": "string[]",
      "metadata": "object",
      "publishedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "deletedAt": "string",
      "brand": {
        "id": "string",
        "name": "string"
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "images": [
        {
          "id": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string",
          "caption": "string",
          "displayOrder": "number",
          "isPrimary": "boolean"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### PATCH /products/:id/restore

**Description:** Restore a soft deleted product.

**Request:**
- Method: `PATCH`
- Endpoint: `/products/:id/restore`
- Path Parameter: `id` (product ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product restored successfully",
  "data": {
    "product": {
      "id": "string",
      "sku": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "barcode": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "costPrice": "number",
      "taxRate": "number",
      "hsnCode": "string",
      "brandId": "string",
      "vendorId": "string",
      "status": "string",
      "stockStatus": "string",
      "weight": "number",
      "dimensions": "object",
      "metaTitle": "string",
      "metaDescription": "string",
      "metaKeywords": "string[]",
      "isFeatured": "boolean",
      "isNewArrival": "boolean",
      "isBestSeller": "boolean",
      "isReturnable": "boolean",
      "returnPeriodDays": "number",
      "viewCount": "number",
      "salesCount": "number",
      "avgRating": "number",
      "totalReviews": "number",
      "tags": "string[]",
      "metadata": "object",
      "publishedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "deletedAt": "null",
      "brand": {
        "id": "string",
        "name": "string"
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "images": [
        {
          "id": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "alt": "string",
          "caption": "string",
          "displayOrder": "number",
          "isPrimary": "boolean"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### POST /:productId/images

**Description:** Add an image to a product.

**Request:**
- Method: `POST`
- Endpoint: `/:productId/images`
- Path Parameter: `productId` (product ID)
- Content-Type: `multipart/form-data`
- Body: `{ file: image file }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Image added successfully",
  "data": {
    "image": {
      "id": "string",
      "url": "string",
      "thumbnailUrl": "string",
      "alt": "string",
      "caption": "string",
      "displayOrder": "number",
      "isPrimary": "boolean",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /:productId/images/bulk

**Description:** Add multiple images to a product.

**Request:**
- Method: `POST`
- Endpoint: `/:productId/images/bulk`
- Path Parameter: `productId` (product ID)
- Content-Type: `multipart/form-data`
- Body: `{ files: image files[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Images added successfully",
  "data": {
    "images": [
      {
        "id": "string",
        "url": "string",
        "thumbnailUrl": "string",
        "alt": "string",
        "caption": "string",
        "displayOrder": "number",
        "isPrimary": "boolean",
        "createdAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### DELETE /images/:imageId

**Description:** Delete a product image.

**Request:**
- Method: `DELETE`
- Endpoint: `/images/:imageId`
- Path Parameter: `imageId` (image ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "timestamp": "string"
}
```

### PATCH /:productId/images/:imageId/primary

**Description:** Set an image as the primary image for a product.

**Request:**
- Method: `PATCH`
- Endpoint: `/:productId/images/:imageId/primary`
- Path Parameters: `productId` (product ID), `imageId` (image ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Image set as primary successfully",
  "timestamp": "string"
}
```

## Product Variant Management

### GET /:id/variants

**Description:** Get all variants for a product.

**Request:**
- Method: `GET`
- Endpoint: `/:id/variants`
- Path Parameter: `id` (product ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Variants retrieved successfully",
  "data": {
    "variants": [
      {
        "id": "string",
        "productId": "string",
        "variantSku": "string",
        "variantName": "string",
        "mrp": "number",
        "sellingPrice": "number",
        "attributes": "object",
        "weight": "number",
        "dimensions": "object",
        "isActive": "boolean",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /:id/variants

**Description:** Create a new product variant.

**Request:**
- Method: `POST`
- Endpoint: `/:id/variants`
- Path Parameter: `id` (product ID)
- Content-Type: `application/json`
- Body: `{ variantSku: string, variantName: string, mrp: number, sellingPrice: number, attributes: object, weight: number, dimensions: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Variant created successfully",
  "data": {
    "variant": {
      "id": "string",
      "productId": "string",
      "variantSku": "string",
      "variantName": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "attributes": "object",
      "weight": "number",
      "dimensions": "object",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /variants/:id

**Description:** Update a product variant.

**Request:**
- Method: `PUT`
- Endpoint: `/variants/:id`
- Path Parameter: `id` (variant ID)
- Content-Type: `application/json`
- Body: `{ variantSku: string, variantName: string, mrp: number, sellingPrice: number, attributes: object, weight: number, dimensions: object, isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Variant updated successfully",
  "data": {
    "variant": {
      "id": "string",
      "productId": "string",
      "variantSku": "string",
      "variantName": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "attributes": "object",
      "weight": "number",
      "dimensions": "object",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /variants/:id

**Description:** Delete a product variant.

**Request:**
- Method: `DELETE`
- Endpoint: `/variants/:id`
- Path Parameter: `id` (variant ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Variant deleted successfully",
  "timestamp": "string"
}
```

### PATCH /variants/:id/toggle

**Description:** Toggle variant active status.

**Request:**
- Method: `PATCH`
- Endpoint: `/variants/:id/toggle`
- Path Parameter: `id` (variant ID)
- Content-Type: `application/json`
- Body: `{ isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Variant active status updated successfully",
  "data": {
    "variant": {
      "id": "string",
      "productId": "string",
      "variantSku": "string",
      "variantName": "string",
      "mrp": "number",
      "sellingPrice": "number",
      "attributes": "object",
      "weight": "number",
      "dimensions": "object",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Attribute Management

### GET /attributes

**Description:** Get all attributes.

**Request:**
- Method: `GET`
- Endpoint: `/attributes`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attributes retrieved successfully",
  "data": {
    "attrs": [
      {
        "id": "string",
        "name": "string",
        "dataType": "string",
        "isRequired": "boolean",
        "values": "string[]",
        "createdAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /attributes

**Description:** Create a new attribute.

**Request:**
- Method: `POST`
- Endpoint: `/attributes`
- Content-Type: `application/json`
- Body: `{ name: string, dataType: string, isRequired: boolean, values: string[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute created successfully",
  "data": {
    "attr": {
      "id": "string",
      "name": "string",
      "dataType": "string",
      "isRequired": "boolean",
      "values": "string[]",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /attributes/:id

**Description:** Update an attribute.

**Request:**
- Method: `PUT`
- Endpoint: `/attributes/:id`
- Path Parameter: `id` (attribute ID)
- Content-Type: `application/json`
- Body: `{ name: string, dataType: string, isRequired: boolean, values: string[] }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute updated successfully",
  "data": {
    "attr": {
      "id": "string",
      "name": "string",
      "dataType": "string",
      "isRequired": "boolean",
      "values": "string[]",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /attributes/:id

**Description:** Delete an attribute.

**Request:**
- Method: `DELETE`
- Endpoint: `/attributes/:id`
- Path Parameter: `id` (attribute ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute deleted successfully",
  "timestamp": "string"
}
```

## Product Attribute Management

### POST /:id/attributes

**Description:** Add an attribute to a product.

**Request:**
- Method: `POST`
- Endpoint: `/:id/attributes`
- Path Parameter: `id` (product ID)
- Content-Type: `application/json`
- Body: `{ attributeTypeId: string, value: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute added to product successfully",
  "data": {
    "attr": {
      "id": "string",
      "productId": "string",
      "attributeTypeId": "string",
      "value": "string",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /attributes/:attrId

**Description:** Remove an attribute from a product.

**Request:**
- Method: `DELETE`
- Endpoint: `/attributes/:attrId`
- Path Parameter: `attrId` (product attribute ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute removed from product successfully",
  "timestamp": "string"
}
```

## Category Attribute Management

### POST /categories/:id/attributes

**Description:** Assign an attribute to a category.

**Request:**
- Method: `POST`
- Endpoint: `/categories/:id/attributes`
- Path Parameter: `id` (category ID)
- Content-Type: `application/json`
- Body: `{ attributeTypeId: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute assigned to category successfully",
  "data": {
    "attr": {
      "id": "string",
      "categoryId": "string",
      "attributeTypeId": "string",
      "isRequired": "boolean",
      "displayOrder": "number",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /categories/:id/attributes/:attrId

**Description:** Remove an attribute from a category.

**Request:**
- Method: `DELETE`
- Endpoint: `/categories/:id/attributes/:attrId`
- Path Parameters: `id` (category ID), `attrId` (attribute ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Attribute removed from category successfully",
  "timestamp": "string"
}
```

## Product Relation Management

### GET /:id/relations

**Description:** Get product relations.

**Request:**
- Method: `GET`
- Endpoint: `/:id/relations`
- Path Parameter: `id` (product ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product relations retrieved successfully",
  "data": {
    "relations": [
      {
        "id": "string",
        "productId": "string",
        "relatedProductId": "string",
        "relationType": "string",
        "score": "number",
        "createdAt": "string",
        "product": {
          "id": "string",
          "name": "string",
          "sku": "string",
          "slug": "string",
          "sellingPrice": "number"
        },
        "relatedProduct": {
          "id": "string",
          "name": "string",
          "sku": "string",
          "slug": "string",
          "sellingPrice": "number"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /:id/relations

**Description:** Create a product relation.

**Request:**
- Method: `POST`
- Endpoint: `/:id/relations`
- Path Parameter: `id` (product ID)
- Content-Type: `application/json`
- Body: `{ relatedProductId: string, relationType: string, score: number }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product relation created successfully",
  "data": {
    "relation": {
      "id": "string",
      "productId": "string",
      "relatedProductId": "string",
      "relationType": "string",
      "score": "number",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /relations/:id

**Description:** Delete a product relation.

**Request:**
- Method: `DELETE`
- Endpoint: `/relations/:id`
- Path Parameter: `id` (relation ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Product relation deleted successfully",
  "timestamp": "string"
}
```

## Card Management

### GET /cards

**Description:** Get all cards.

**Request:**
- Method: `GET`
- Endpoint: `/cards`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Cards retrieved successfully",
  "data": {
    "cards": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "capPercentage": "number",
        "benefitDays": "string[]",
        "referralRewardPercent": "number",
        "referralRewardAmount": "number",
        "validityDays": "number",
        "status": "string",
        "visibility": "string",
        "images": "string[]",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /cards/:id

**Description:** Get card by ID.

**Request:**
- Method: `GET`
- Endpoint: `/cards/:id`
- Path Parameter: `id` (card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Card retrieved successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /cards

**Description:** Create a new card.

**Request:**
- Method: `POST`
- Endpoint: `/cards`
- Content-Type: `application/json`
- Body: `{ name: string, price: number, targetAmount: number, rewardPercent: number, capPercentage: number, benefitDays: string[], referralRewardPercent: number, referralRewardAmount: number, validityDays: number, status: string, visibility: string, images: string[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Card created successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /cards/:id

**Description:** Update a card.

**Request:**
- Method: `PUT`
- Endpoint: `/cards/:id`
- Path Parameter: `id` (card ID)
- Content-Type: `application/json`
- Body: `{ name: string, price: number, targetAmount: number, rewardPercent: number, capPercentage: number, benefitDays: string[], referralRewardPercent: number, referralRewardAmount: number, validityDays: number, status: string, visibility: string, images: string[] }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Card updated successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /cards/:id

**Description:** Delete a card.

**Request:**
- Method: `DELETE`
- Endpoint: `/cards/:id`
- Path Parameter: `id` (card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Card deleted successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /cards/:id/restore

**Description:** Restore a deleted card.

**Request:**
- Method: `PATCH`
- Endpoint: `/cards/:id/restore`
- Path Parameter: `id` (card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Card restored successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Subscription Card Management

### GET /subscription-cards

**Description:** Get all subscription cards.

**Request:**
- Method: `GET`
- Endpoint: `/subscription-cards`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription cards retrieved successfully",
  "data": {
    "cards": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "capPercentage": "number",
        "benefitDays": "string[]",
        "referralRewardPercent": "number",
        "referralRewardAmount": "number",
        "validityDays": "number",
        "status": "string",
        "visibility": "string",
        "images": "string[]",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /subscription-cards/:id

**Description:** Get subscription card by ID.

**Request:**
- Method: `GET`
- Endpoint: `/subscription-cards/:id`
- Path Parameter: `id` (subscription card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription card retrieved successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /subscription-cards

**Description:** Create a new subscription card.

**Request:**
- Method: `POST`
- Endpoint: `/subscription-cards`
- Content-Type: `application/json`
- Body: `{ name: string, price: number, targetAmount: number, rewardPercent: number, capPercentage: number, benefitDays: string[], referralRewardPercent: number, referralRewardAmount: number, validityDays: number, status: string, visibility: string, images: string[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription card created successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /subscription-cards/:id

**Description:** Update a subscription card.

**Request:**
- Method: `PUT`
- Endpoint: `/subscription-cards/:id`
- Path Parameter: `id` (subscription card ID)
- Content-Type: `application/json`
- Body: `{ name: string, price: number, targetAmount: number, rewardPercent: number, capPercentage: number, benefitDays: string[], referralRewardPercent: number, referralRewardAmount: number, validityDays: number, status: string, visibility: string, images: string[] }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription card updated successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /subscription-cards/:id

**Description:** Delete a subscription card.

**Request:**
- Method: `DELETE`
- Endpoint: `/subscription-cards/:id`
- Path Parameter: `id` (subscription card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription card deleted successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /subscription-cards/:id/restore

**Description:** Restore a deleted subscription card.

**Request:**
- Method: `PATCH`
- Endpoint: `/subscription-cards/:id/restore`
- Path Parameter: `id` (subscription card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Subscription card restored successfully",
  "data": {
    "card": {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "targetAmount": "number",
      "rewardPercent": "number",
      "capPercentage": "number",
      "benefitDays": "string[]",
      "referralRewardPercent": "number",
      "referralRewardAmount": "number",
      "validityDays": "number",
      "status": "string",
      "visibility": "string",
      "images": "string[]",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## User Subscription Card Management

### GET /user-subscription-cards

**Description:** Get all user subscription cards.

**Request:**
- Method: `GET`
- Endpoint: `/user-subscription-cards`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User subscription cards retrieved successfully",
  "data": {
    "cards": [
      {
        "id": "string",
        "customerId": "string",
        "cardId": "string",
        "referralCodeId": "string",
        "status": "string",
        "startDate": "string",
        "endDate": "string",
        "purchasedAt": "string",
        "activatedAt": "string",
        "expiredAt": "string",
        "currentAmount": "number"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /user-subscription-cards/:id

**Description:** Get user subscription card by ID.

**Request:**
- Method: `GET`
- Endpoint: `/user-subscription-cards/:id`
- Path Parameter: `id` (user subscription card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User subscription card retrieved successfully",
  "data": {
    "card": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "string",
      "startDate": "string",
      "endDate": "string",
      "purchasedAt": "string",
      "activatedAt": "string",
      "expiredAt": "string",
      "currentAmount": "number",
      "card": {
        "id": "string",
        "name": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "validityDays": "number"
      },
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /user-subscription-cards

**Description:** Create a new user subscription card.

**Request:**
- Method: `POST`
- Endpoint: `/user-subscription-cards`
- Content-Type: `application/json`
- Body: `{ customerId: string, cardId: string, referralCodeId: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User subscription card created successfully",
  "data": {
    "card": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "string",
      "startDate": "string",
      "endDate": "string",
      "purchasedAt": "string",
      "activatedAt": "string",
      "expiredAt": "string",
      "currentAmount": "number",
      "card": {
        "id": "string",
        "name": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "validityDays": "number"
      },
      "customer": {
        "id": "string",
        "userId": "string",
        "customerCode": "string",
        "tier": "BRONZE|SILVER|GOLD|PLATINUM",
        "loyaltyPoints": 0,
        "lifetimeValue": "0.00",
        "preferences": {},
        "totalOrders": 0,
        "totalSpent": "0.00",
        "lastOrderAt": "string",
        "metadata": {},
        "deletedAt": null,
        "createdAt": "string",
        "updatedAt": "string",
        "user": {
          "id": "string",
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
          "dateOfBirth": "string",
          "gender": "MALE|FEMALE|OTHER",
          "avatar": "string",
          "bio": "string",
          "lastLoginAt": "string",
          "lastLoginIp": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /user-subscription-cards/:id

**Description:** Update a user subscription card.

**Request:**
- Method: `PUT`
- Endpoint: `/user-subscription-cards/:id`
- Path Parameter: `id` (user subscription card ID)
- Content-Type: `application/json`
- Body: `{ status: string, startDate: string, endDate: string, activatedAt: string, expiredAt: string, currentAmount: number }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User subscription card updated successfully",
  "data": {
    "card": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "string",
      "startDate": "string",
      "endDate": "string",
      "purchasedAt": "string",
      "activatedAt": "string",
      "expiredAt": "string",
      "currentAmount": "number",
      "card": {
        "id": "string",
        "name": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "validityDays": "number"
      },
      "customer": {
        "id": "string",
        "userId": "string",
        "customerCode": "string",
        "tier": "BRONZE|SILVER|GOLD|PLATINUM",
        "loyaltyPoints": 0,
        "lifetimeValue": "0.00",
        "preferences": {},
        "totalOrders": 0,
        "totalSpent": "0.00",
        "lastOrderAt": "string",
        "metadata": {},
        "deletedAt": null,
        "createdAt": "string",
        "updatedAt": "string",
        "user": {
          "id": "string",
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
          "dateOfBirth": "string",
          "gender": "MALE|FEMALE|OTHER",
          "avatar": "string",
          "bio": "string",
          "lastLoginAt": "string",
          "lastLoginIp": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /user-subscription-cards/:id

**Description:** Delete a user subscription card.

**Request:**
- Method: `DELETE`
- Endpoint: `/user-subscription-cards/:id`
- Path Parameter: `id` (user subscription card ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User subscription card deleted successfully",
  "data": {
    "card": {
      "id": "string",
      "customerId": "string",
      "cardId": "string",
      "referralCodeId": "string",
      "status": "string",
      "startDate": "string",
      "endDate": "string",
      "purchasedAt": "string",
      "activatedAt": "string",
      "expiredAt": "string",
      "currentAmount": "number",
      "card": {
        "id": "string",
        "name": "string",
        "price": "number",
        "targetAmount": "number",
        "rewardPercent": "number",
        "validityDays": "number"
      },
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Customer Management

### GET /customers

**Description:** Get all customers.

**Request:**
- Method: `GET`
- Endpoint: `/customers`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customers fetched successfully",
  "data": {
    "customers": [
      {
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
        "dateOfBirth": "string",
        "gender": "MALE|FEMALE|OTHER",
        "avatar": "string",
        "bio": "string",
        "lastLoginAt": "string",
        "lastLoginIp": "string",
        "tier": "BRONZE|SILVER|GOLD|PLATINUM",
        "loyaltyPoints": 0,
        "lifetimeValue": "0.00",
        "preferences": {},
        "totalOrders": 0,
        "totalSpent": "0.00",
        "lastOrderAt": "string",
        "metadata": {},
        "deletedAt": null,
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /customers/:id

**Description:** Get customer by ID.

**Request:**
- Method: `GET`
- Endpoint: `/customers/:id`
- Path Parameter: `id` (customer ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer fetched successfully",
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
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "string",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /customers

**Description:** Create a new customer.

**Request:**
- Method: `POST`
- Endpoint: `/customers`
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, email: string, password: string, phone: string, dateOfBirth: string, gender: string, tier: string, preferences: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer created successfully",
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
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "string",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /customers/:id

**Description:** Update a customer.

**Request:**
- Method: `PUT`
- Endpoint: `/customers/:id`
- Path Parameter: `id` (customer ID)
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, phone: string, dateOfBirth: string, gender: string, tier: string, preferences: object }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer updated successfully",
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
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "string",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /customers/:id

**Description:** Delete a customer.

**Request:**
- Method: `DELETE`
- Endpoint: `/customers/:id`
- Path Parameter: `id` (customer ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully",
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
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "string",
      "metadata": {},
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /customers/:id/restore

**Description:** Restore a deleted customer.

**Request:**
- Method: `POST`
- Endpoint: `/customers/:id/restore`
- Path Parameter: `id` (customer ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer restored successfully",
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
      "dateOfBirth": "string",
      "gender": "MALE|FEMALE|OTHER",
      "avatar": "string",
      "bio": "string",
      "lastLoginAt": "string",
      "lastLoginIp": "string",
      "tier": "BRONZE|SILVER|GOLD|PLATINUM",
      "loyaltyPoints": 0,
      "lifetimeValue": "0.00",
      "preferences": {},
      "totalOrders": 0,
      "totalSpent": "0.00",
      "lastOrderAt": "string",
      "metadata": {},
      "deletedAt": null,
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Customer Segment Management

### GET /customers/:customerId/segments

**Description:** Get customer segments.

**Request:**
- Method: `GET`
- Endpoint: `/customers/:customerId/segments`
- Path Parameter: `customerId` (customer ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer segments retrieved successfully",
  "data": {
    "segments": [
      {
        "id": "string",
        "customerId": "string",
        "segmentName": "string",
        "segmentValue": "string",
        "createdAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### POST /customers/:customerId/segments

**Description:** Create a customer segment.

**Request:**
- Method: `POST`
- Endpoint: `/customers/:customerId/segments`
- Path Parameter: `customerId` (customer ID)
- Content-Type: `application/json`
- Body: `{ segmentName: string, segmentValue: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer segment created successfully",
  "data": {
    "segment": {
      "id": "string",
      "customerId": "string",
      "segmentName": "string",
      "segmentValue": "string",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /customers/segments/:id

**Description:** Update a customer segment.

**Request:**
- Method: `PUT`
- Endpoint: `/customers/segments/:id`
- Path Parameter: `id` (segment ID)
- Content-Type: `application/json`
- Body: `{ segmentName: string, segmentValue: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer segment updated successfully",
  "data": {
    "segment": {
      "id": "string",
      "customerId": "string",
      "segmentName": "string",
      "segmentValue": "string",
      "createdAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /customers/segments/:id

**Description:** Delete a customer segment.

**Request:**
- Method: `DELETE`
- Endpoint: `/customers/segments/:id`
- Path Parameter: `id` (segment ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Customer segment deleted successfully",
  "timestamp": "string"
}
```

## Wallet Management

### GET /admin/wallets

**Description:** Get all wallets.

**Request:**
- Method: `GET`
- Endpoint: `/admin/wallets`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallets retrieved successfully",
  "data": {
    "wallets": [
      {
        "id": "string",
        "customerId": "string",
        "type": "string",
        "balance": "number",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /admin/wallets/:id

**Description:** Get wallet by ID.

**Request:**
- Method: `GET`
- Endpoint: `/admin/wallets/:id`
- Path Parameter: `id` (wallet ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet retrieved successfully",
  "data": {
    "wallet": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "balance": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /admin/wallets

**Description:** Create a new wallet.

**Request:**
- Method: `POST`
- Endpoint: `/admin/wallets`
- Content-Type: `application/json`
- Body: `{ customerId: string, type: string, balance: number }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet created successfully",
  "data": {
    "wallet": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "balance": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /admin/wallets/:id

**Description:** Update a wallet.

**Request:**
- Method: `PUT`
- Endpoint: `/admin/wallets/:id`
- Path Parameter: `id` (wallet ID)
- Content-Type: `application/json`
- Body: `{ type: string, balance: number }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet updated successfully",
  "data": {
    "wallet": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "balance": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /admin/wallets/:id

**Description:** Delete a wallet.

**Request:**
- Method: `DELETE`
- Endpoint: `/admin/wallets/:id`
- Path Parameter: `id` (wallet ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet deleted successfully",
  "data": {
    "wallet": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "balance": "number",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Wallet Transaction Management

### GET /admin/wallet-transactions

**Description:** Get all wallet transactions.

**Request:**
- Method: `GET`
- Endpoint: `/admin/wallet-transactions`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": "string",
        "walletId": "string",
        "customerId": "string",
        "type": "string",
        "reason": "string",
        "status": "string",
        "amount": "number",
        "balanceBefore": "number",
        "balanceAfter": "number",
        "cardId": "string",
        "subscriptionId": "string",
        "referralId": "string",
        "rewardPercent": "number",
        "targetAmount": "number",
        "capPercentage": "number",
        "idempotencyKey": "string",
        "metadata": "object",
        "createdAt": "string",
        "customer": {
          "id": "string",
          "userId": "string",
          "customerCode": "string",
          "tier": "BRONZE|SILVER|GOLD|PLATINUM",
          "loyaltyPoints": 0,
          "lifetimeValue": "0.00",
          "preferences": {},
          "totalOrders": 0,
          "totalSpent": "0.00",
          "lastOrderAt": "string",
          "metadata": {},
          "deletedAt": null,
          "createdAt": "string",
          "updatedAt": "string",
          "user": {
            "id": "string",
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
            "dateOfBirth": "string",
            "gender": "MALE|FEMALE|OTHER",
            "avatar": "string",
            "bio": "string",
            "lastLoginAt": "string",
            "lastLoginIp": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /admin/wallet-transactions/:id

**Description:** Get wallet transaction by ID.

**Request:**
- Method: `GET`
- Endpoint: `/admin/wallet-transactions/:id`
- Path Parameter: `id` (wallet transaction ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet transaction retrieved successfully",
  "data": {
    "transaction": {
      "id": "string",
      "walletId": "string",
      "customerId": "string",
      "type": "string",
      "reason": "string",
      "status": "string",
      "amount": "number",
      "balanceBefore": "number",
      "balanceAfter": "number",
      "cardId": "string",
      "subscriptionId": "string",
      "referralId": "string",
      "rewardPercent": "number",
      "targetAmount": "number",
      "capPercentage": "number",
      "idempotencyKey": "string",
      "metadata": "object",
      "createdAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /admin/wallet-transactions

**Description:** Create a new wallet transaction.

**Request:**
- Method: `POST`
- Endpoint: `/admin/wallet-transactions`
- Content-Type: `application/json`
- Body: `{ walletId: string, type: string, reason: string, amount: number, cardId: string, subscriptionId: string, referralId: string, rewardPercent: number, targetAmount: number, capPercentage: number, idempotencyKey: string, metadata: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet transaction created successfully",
  "data": {
    "transaction": {
      "id": "string",
      "walletId": "string",
      "customerId": "string",
      "type": "string",
      "reason": "string",
      "status": "string",
      "amount": "number",
      "balanceBefore": "number",
      "balanceAfter": "number",
      "cardId": "string",
      "subscriptionId": "string",
      "referralId": "string",
      "rewardPercent": "number",
      "targetAmount": "number",
      "capPercentage": "number",
      "idempotencyKey": "string",
      "metadata": "object",
      "createdAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /admin/wallet-transactions/:id

**Description:** Update a wallet transaction.

**Request:**
- Method: `PUT`
- Endpoint: `/admin/wallet-transactions/:id`
- Path Parameter: `id` (wallet transaction ID)
- Content-Type: `application/json`
- Body: `{ type: string, reason: string, status: string, amount: number, metadata: object }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet transaction updated successfully",
  "data": {
    "transaction": {
      "id": "string",
      "walletId": "string",
      "customerId": "string",
      "type": "string",
      "reason": "string",
      "status": "string",
      "amount": "number",
      "balanceBefore": "number",
      "balanceAfter": "number",
      "cardId": "string",
      "subscriptionId": "string",
      "referralId": "string",
      "rewardPercent": "number",
      "targetAmount": "number",
      "capPercentage": "number",
      "idempotencyKey": "string",
      "metadata": "object",
      "createdAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /admin/wallet-transactions/:id

**Description:** Delete a wallet transaction.

**Request:**
- Method: `DELETE`
- Endpoint: `/admin/wallet-transactions/:id`
- Path Parameter: `id` (wallet transaction ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet transaction deleted successfully",
  "data": {
    "transaction": {
      "id": "string",
      "walletId": "string",
      "customerId": "string",
      "type": "string",
      "reason": "string",
      "status": "string",
      "amount": "number",
      "balanceBefore": "number",
      "balanceAfter": "number",
      "cardId": "string",
      "subscriptionId": "string",
      "referralId": "string",
      "rewardPercent": "number",
      "targetAmount": "number",
      "capPercentage": "number",
      "idempotencyKey": "string",
      "metadata": "object",
      "createdAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Order Management

### GET /orders

**Description:** Get all orders.

**Request:**
- Method: `GET`
- Endpoint: `/orders`
- Query Parameters:
  - `status`: string
  - `paymentStatus`: string
  - `startDate`: string
  - `endDate`: string
  - `search`: string
  - `customerId`: string
  - `vendorId`: string
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": "string",
        "orderNumber": "string",
        "customerId": "string",
        "vendorId": "string",
        "itemsTotal": "number",
        "taxAmount": "number",
        "shippingCharges": "number",
        "codCharges": "number",
        "discount": "number",
        "totalAmount": "number",
        "status": "string",
        "paymentStatus": "string",
        "shippingAddress": "object",
        "billingAddress": "object",
        "customerName": "string",
        "customerEmail": "string",
        "customerPhone": "string",
        "customerNotes": "string",
        "adminNotes": "string",
        "trackingNumber": "string",
        "courierPartner": "string",
        "confirmedAt": "string",
        "packedAt": "string",
        "shippedAt": "string",
        "deliveredAt": "string",
        "cancelledAt": "string",
        "returnRequestedAt": "string",
        "createdBy": "string",
        "source": "string",
        "deviceInfo": "object",
        "metadata": "object",
        "createdAt": "string",
        "updatedAt": "string",
        "customer": {
          "id": "string",
          "customerCode": "string",
          "user": {
            "firstName": "string",
            "lastName": "string"
          }
        },
        "vendor": {
          "id": "string",
          "businessName": "string"
        },
        "items": [
          {
            "id": "string",
            "orderId": "string",
            "productId": "string",
            "variantId": "string",
            "productName": "string",
            "productSku": "string",
            "variantName": "string",
            "productImage": "string",
            "mrp": "number",
            "sellingPrice": "number",
            "quantity": "number",
            "discount": "number",
            "taxRate": "number",
            "taxAmount": "number",
            "totalAmount": "number",
            "vendorId": "string",
            "vendorCommission": "number",
            "status": "string",
            "refundedQuantity": "number",
            "isReturned": "boolean",
            "createdAt": "string",
            "updatedAt": "string",
            "product": {
              "id": "string",
              "name": "string",
              "sku": "string",
              "slug": "string"
            },
            "variant": {
              "id": "string",
              "variantName": "string"
            }
          }
        ]
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  },
  "timestamp": "string"
}
```

### GET /orders/:id

**Description:** Get order by ID.

**Request:**
- Method: `GET`
- Endpoint: `/orders/:id`
- Path Parameter: `id` (order ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "userId": "string",
        "customerCode": "string",
        "tier": "BRONZE|SILVER|GOLD|PLATINUM",
        "loyaltyPoints": 0,
        "lifetimeValue": "0.00",
        "preferences": {},
        "totalOrders": 0,
        "totalSpent": "0.00",
        "lastOrderAt": "string",
        "metadata": {},
        "deletedAt": null,
        "createdAt": "string",
        "updatedAt": "string",
        "user": {
          "id": "string",
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
          "dateOfBirth": "string",
          "gender": "MALE|FEMALE|OTHER",
          "avatar": "string",
          "bio": "string",
          "lastLoginAt": "string",
          "lastLoginIp": "string",
          "createdAt": "string",
          "updatedAt": "string"
        },
        "addresses": []
      },
      "vendor": {
        "id": "string",
        "businessName": "string"
      },
      "items": [
        {
          "id": "string",
          "orderId": "string",
          "productId": "string",
          "variantId": "string",
          "productName": "string",
          "productSku": "string",
          "variantName": "string",
          "productImage": "string",
          "mrp": "number",
          "sellingPrice": "number",
          "quantity": "number",
          "discount": "number",
          "taxRate": "number",
          "taxAmount": "number",
          "totalAmount": "number",
          "vendorId": "string",
          "vendorCommission": "number",
          "status": "string",
          "refundedQuantity": "number",
          "isReturned": "boolean",
          "createdAt": "string",
          "updatedAt": "string",
          "product": {
            "id": "string",
            "name": "string",
            "sku": "string",
            "slug": "string"
          },
          "variant": {
            "id": "string",
            "variantName": "string"
          }
        }
      ],
      "payments": [
        {
          "id": "string",
          "orderId": "string",
          "amount": "number",
          "cash": "number",
          "online": "number",
          "currency": "string",
          "method": "string",
          "status": "string",
          "gatewayName": "string",
          "gatewayOrderId": "string",
          "gatewayPaymentId": "string",
          "gatewaySignature": "string",
          "gatewayResponse": "object",
          "cardLast4": "string",
          "cardBrand": "string",
          "bankName": "string",
          "upiId": "string",
          "isRefundable": "boolean",
          "refundedAmount": "number",
          "paidAt": "string",
          "failedAt": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "discounts": [
        {
          "id": "string",
          "orderId": "string",
          "discountId": "string",
          "discountCode": "string",
          "discountAmount": "number",
          "appliedAt": "string"
        }
      ],
      "statusHistory": [
        {
          "id": "string",
          "orderId": "string",
          "fromStatus": "string",
          "toStatus": "string",
          "reason": "string",
          "notes": "string",
          "changedBy": "string",
          "createdAt": "string"
        }
      ],
      "delivery": {
        "id": "string",
        "orderId": "string",
        "deliveryAgentId": "string",
        "deliveryType": "string",
        "trackingId": "string",
        "status": "string",
        "deliveryAddress": "object",
        "scheduledDate": "string",
        "scheduledSlot": "string",
        "deliveryTime": "string",
        "deliveryProof": "string",
        "receiverName": "string",
        "receiverRelation": "string",
        "signature": "string",
        "failureReason": "string",
        "failureNotes": "string",
        "attemptCount": "number",
        "maxAttempts": "number",
        "distance": "number",
        "duration": "number",
        "deliveryCharge": "number",
        "codAmount": "number",
        "codCollected": "number",
        "customerRating": "number",
        "customerFeedback": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "returns": [
        {
          "id": "string",
          "orderId": "string",
          "returnNumber": "string",
          "type": "string",
          "reason": "string",
          "detailedReason": "string",
          "status": "string",
          "customerComments": "string",
          "images": "string[]",
          "pickupAddress": "object",
          "pickupScheduledDate": "string",
          "pickupCompletedAt": "string",
          "inspectionNotes": "string",
          "inspectionCompletedAt": "string",
          "inspectedBy": "string",
          "refundAmount": "number",
          "refundMethod": "string",
          "exchangeOrderId": "string",
          "approvedAt": "string",
          "rejectedAt": "string",
          "processedAt": "string",
          "createdAt": "string",
          "updatedAt": "string",
          "source": "string",
          "createdBy": "string"
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### POST /orders

**Description:** Create a new order.

**Request:**
- Method: `POST`
- Endpoint: `/orders`
- Content-Type: `application/json`
- Body: `{ customerId: string, vendorId: string, items: object[], shippingAddress: object, billingAddress: object, customerNotes: string, adminNotes: string, source: string, deviceInfo: object, metadata: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /orders/:id

**Description:** Update an order.

**Request:**
- Method: `PUT`
- Endpoint: `/orders/:id`
- Path Parameter: `id` (order ID)
- Content-Type: `application/json`
- Body: `{ status: string, paymentStatus: string, adminNotes: string, trackingNumber: string, courierPartner: string, metadata: object }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /orders/:id

**Description:** Delete an order.

**Request:**
- Method: `DELETE`
- Endpoint: `/orders/:id`
- Path Parameter: `id` (order ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order deleted successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /orders/:id/status

**Description:** Update order status.

**Request:**
- Method: `PATCH`
- Endpoint: `/orders/:id/status`
- Path Parameter: `id` (order ID)
- Content-Type: `application/json`
- Body: `{ status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /orders/:id/cancel

**Description:** Cancel an order.

**Request:**
- Method: `PATCH`
- Endpoint: `/orders/:id/cancel`
- Path Parameter: `id` (order ID)
- Content-Type: `application/json`
- Body: `{ reason: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /orders/:id/confirm

**Description:** Confirm an order.

**Request:**
- Method: `PATCH`
- Endpoint: `/orders/:id/confirm`
- Path Parameter: `id` (order ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order confirmed successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /orders/:id/restore

**Description:** Restore a deleted order.

**Request:**
- Method: `PATCH`
- Endpoint: `/orders/:id/restore`
- Path Parameter: `id` (order ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Order restored successfully",
  "data": {
    "order": {
      "id": "string",
      "orderNumber": "string",
      "customerId": "string",
      "vendorId": "string",
      "itemsTotal": "number",
      "taxAmount": "number",
      "shippingCharges": "number",
      "codCharges": "number",
      "discount": "number",
      "totalAmount": "number",
      "status": "string",
      "paymentStatus": "string",
      "shippingAddress": "object",
      "billingAddress": "object",
      "customerName": "string",
      "customerEmail": "string",
      "customerPhone": "string",
      "customerNotes": "string",
      "adminNotes": "string",
      "trackingNumber": "string",
      "courierPartner": "string",
      "confirmedAt": "string",
      "packedAt": "string",
      "shippedAt": "string",
      "deliveredAt": "string",
      "cancelledAt": "string",
      "returnRequestedAt": "string",
      "createdBy": "string",
      "source": "string",
      "deviceInfo": "object",
      "metadata": "object",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Return Management

### POST /returns

**Description:** Create a return request.

**Request:**
- Method: `POST`
- Endpoint: `/returns`
- Content-Type: `application/json`
- Body: `{ orderId: string, type: string, reason: string, detailedReason: string, customerComments: string, images: string[], pickupAddress: object, pickupScheduledDate: string, items: object[] }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Return request created successfully",
  "data": {
    "return": {
      "id": "string",
      "orderId": "string",
      "returnNumber": "string",
      "type": "string",
      "reason": "string",
      "detailedReason": "string",
      "status": "string",
      "customerComments": "string",
      "images": "string[]",
      "pickupAddress": "object",
      "pickupScheduledDate": "string",
      "pickupCompletedAt": "string",
      "inspectionNotes": "string",
      "inspectionCompletedAt": "string",
      "inspectedBy": "string",
      "refundAmount": "number",
      "refundMethod": "string",
      "exchangeOrderId": "string",
      "approvedAt": "string",
      "rejectedAt": "string",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "source": "string",
      "createdBy": "string"
    }
  },
  "timestamp": "string"
}
```

### GET /returns/:returnId

**Description:** Get return by ID.

**Request:**
- Method: `GET`
- Endpoint: `/returns/:returnId`
- Path Parameter: `returnId` (return ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Return request retrieved successfully",
  "data": {
    "return": {
      "id": "string",
      "orderId": "string",
      "returnNumber": "string",
      "type": "string",
      "reason": "string",
      "detailedReason": "string",
      "status": "string",
      "customerComments": "string",
      "images": "string[]",
      "pickupAddress": "object",
      "pickupScheduledDate": "string",
      "pickupCompletedAt": "string",
      "inspectionNotes": "string",
      "inspectionCompletedAt": "string",
      "inspectedBy": "string",
      "refundAmount": "number",
      "refundMethod": "string",
      "exchangeOrderId": "string",
      "approvedAt": "string",
      "rejectedAt": "string",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "source": "string",
      "createdBy": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "customerEmail": "string",
        "totalAmount": "number"
      },
      "items": [
        {
          "id": "string",
          "returnId": "string",
          "orderItemId": "string",
          "quantity": "number",
          "condition": "string",
          "orderItem": {
            "id": "string",
            "productName": "string",
            "productSku": "string",
            "quantity": "number",
            "totalAmount": "number"
          }
        }
      ]
    }
  },
  "timestamp": "string"
}
```

### GET /returns

**Description:** Get all returns.

**Request:**
- Method: `GET`
- Endpoint: `/returns`
- Query Parameters:
  - `status`: string
  - `orderId`: string
  - `type`: string
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Returns retrieved successfully",
  "data": {
    "returns": [
      {
        "id": "string",
        "orderId": "string",
        "returnNumber": "string",
        "type": "string",
        "reason": "string",
        "detailedReason": "string",
        "status": "string",
        "customerComments": "string",
        "images": "string[]",
        "pickupAddress": "object",
        "pickupScheduledDate": "string",
        "pickupCompletedAt": "string",
        "inspectionNotes": "string",
        "inspectionCompletedAt": "string",
        "inspectedBy": "string",
        "refundAmount": "number",
        "refundMethod": "string",
        "exchangeOrderId": "string",
        "approvedAt": "string",
        "rejectedAt": "string",
        "processedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "source": "string",
        "createdBy": "string",
        "order": {
          "id": "string",
          "orderNumber": "string",
          "customerName": "string",
          "customerEmail": "string",
          "totalAmount": "number"
        }
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  },
  "timestamp": "string"
}
```

### PATCH /returns/:returnId/status

**Description:** Update return status.

**Request:**
- Method: `PATCH`
- Endpoint: `/returns/:returnId/status`
- Path Parameter: `returnId` (return ID)
- Content-Type: `application/json`
- Body: `{ status: string, inspectionNotes: string, refundAmount: number, refundMethod: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Return status updated successfully",
  "data": {
    "return": {
      "id": "string",
      "orderId": "string",
      "returnNumber": "string",
      "type": "string",
      "reason": "string",
      "detailedReason": "string",
      "status": "string",
      "customerComments": "string",
      "images": "string[]",
      "pickupAddress": "object",
      "pickupScheduledDate": "string",
      "pickupCompletedAt": "string",
      "inspectionNotes": "string",
      "inspectionCompletedAt": "string",
      "inspectedBy": "string",
      "refundAmount": "number",
      "refundMethod": "string",
      "exchangeOrderId": "string",
      "approvedAt": "string",
      "rejectedAt": "string",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "source": "string",
      "createdBy": "string"
    }
  },
  "timestamp": "string"
}
```

## Discount Management

### GET /discounts

**Description:** Get all discounts.

**Request:**
- Method: `GET`
- Endpoint: `/discounts`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Discounts retrieved successfully",
  "data": {
    "discounts": [
      {
        "id": "string",
        "code": "string",
        "description": "string",
        "type": "string",
        "value": "number",
        "minOrderAmount": "number",
        "maxDiscountAmount": "number",
        "usageLimit": "number",
        "usagePerCustomer": "number",
        "usedCount": "number",
        "validFrom": "string",
        "validUntil": "string",
        "applicableCategories": "string[]",
        "applicableProducts": "string[]",
        "applicableBrands": "string[]",
        "isActive": "boolean",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /discounts/:id

**Description:** Get discount by ID.

**Request:**
- Method: `GET`
- Endpoint: `/discounts/:id`
- Path Parameter: `id` (discount ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Discount retrieved successfully",
  "data": {
    "discount": {
      "id": "string",
      "code": "string",
      "description": "string",
      "type": "string",
      "value": "number",
      "minOrderAmount": "number",
      "maxDiscountAmount": "number",
      "usageLimit": "number",
      "usagePerCustomer": "number",
      "usedCount": "number",
      "validFrom": "string",
      "validUntil": "string",
      "applicableCategories": "string[]",
      "applicableProducts": "string[]",
      "applicableBrands": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /discounts

**Description:** Create a new discount.

**Request:**
- Method: `POST`
- Endpoint: `/discounts`
- Content-Type: `application/json`
- Body: `{ code: string, description: string, type: string, value: number, minOrderAmount: number, maxDiscountAmount: number, usageLimit: number, usagePerCustomer: number, validFrom: string, validUntil: string, applicableCategories: string[], applicableProducts: string[], applicableBrands: string[], isActive: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Discount created successfully",
  "data": {
    "discount": {
      "id": "string",
      "code": "string",
      "description": "string",
      "type": "string",
      "value": "number",
      "minOrderAmount": "number",
      "maxDiscountAmount": "number",
      "usageLimit": "number",
      "usagePerCustomer": "number",
      "usedCount": "number",
      "validFrom": "string",
      "validUntil": "string",
      "applicableCategories": "string[]",
      "applicableProducts": "string[]",
      "applicableBrands": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /discounts/:id

**Description:** Update a discount.

**Request:**
- Method: `PUT`
- Endpoint: `/discounts/:id`
- Path Parameter: `id` (discount ID)
- Content-Type: `application/json`
- Body: `{ code: string, description: string, type: string, value: number, minOrderAmount: number, maxDiscountAmount: number, usageLimit: number, usagePerCustomer: number, validFrom: string, validUntil: string, applicableCategories: string[], applicableProducts: string[], applicableBrands: string[], isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Discount updated successfully",
  "data": {
    "discount": {
      "id": "string",
      "code": "string",
      "description": "string",
      "type": "string",
      "value": "number",
      "minOrderAmount": "number",
      "maxDiscountAmount": "number",
      "usageLimit": "number",
      "usagePerCustomer": "number",
      "usedCount": "number",
      "validFrom": "string",
      "validUntil": "string",
      "applicableCategories": "string[]",
      "applicableProducts": "string[]",
      "applicableBrands": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /discounts/:id

**Description:** Delete a discount.

**Request:**
- Method: `DELETE`
- Endpoint: `/discounts/:id`
- Path Parameter: `id` (discount ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Discount deleted successfully",
  "data": {
    "discount": {
      "id": "string",
      "code": "string",
      "description": "string",
      "type": "string",
      "value": "number",
      "minOrderAmount": "number",
      "maxDiscountAmount": "number",
      "usageLimit": "number",
      "usagePerCustomer": "number",
      "usedCount": "number",
      "validFrom": "string",
      "validUntil": "string",
      "applicableCategories": "string[]",
      "applicableProducts": "string[]",
      "applicableBrands": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Review Management

### GET /reviews

**Description:** Get all reviews.

**Request:**
- Method: `GET`
- Endpoint: `/reviews`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "id": "string",
        "customerId": "string",
        "productId": "string",
        "orderId": "string",
        "rating": "number",
        "title": "string",
        "comment": "string",
        "pros": "string[]",
        "cons": "string[]",
        "images": "string[]",
        "videos": "string[]",
        "isVerifiedPurchase": "boolean",
        "helpfulCount": "number",
        "notHelpfulCount": "number",
        "status": "string",
        "approvedBy": "string",
        "approvedAt": "string",
        "sellerResponse": "string",
        "sellerRespondedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "customer": {
          "id": "string",
          "userId": "string",
          "customerCode": "string",
          "tier": "BRONZE|SILVER|GOLD|PLATINUM",
          "loyaltyPoints": 0,
          "lifetimeValue": "0.00",
          "preferences": {},
          "totalOrders": 0,
          "totalSpent": "0.00",
          "lastOrderAt": "string",
          "metadata": {},
          "deletedAt": null,
          "createdAt": "string",
          "updatedAt": "string",
          "user": {
            "id": "string",
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
            "dateOfBirth": "string",
            "gender": "MALE|FEMALE|OTHER",
            "avatar": "string",
            "bio": "string",
            "lastLoginAt": "string",
            "lastLoginIp": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        },
        "product": {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### PATCH /reviews/:id/approve

**Description:** Approve a review.

**Request:**
- Method: `PATCH`
- Endpoint: `/reviews/:id/approve`
- Path Parameter: `id` (review ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Review approved successfully",
  "data": {
    "review": {
      "id": "string",
      "customerId": "string",
      "productId": "string",
      "orderId": "string",
      "rating": "number",
      "title": "string",
      "comment": "string",
      "pros": "string[]",
      "cons": "string[]",
      "images": "string[]",
      "videos": "string[]",
      "isVerifiedPurchase": "boolean",
      "helpfulCount": "number",
      "notHelpfulCount": "number",
      "status": "string",
      "approvedBy": "string",
      "approvedAt": "string",
      "sellerResponse": "string",
      "sellerRespondedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PATCH /reviews/:id/reject

**Description:** Reject a review.

**Request:**
- Method: `PATCH`
- Endpoint: `/reviews/:id/reject`
- Path Parameter: `id` (review ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Review rejected successfully",
  "data": {
    "review": {
      "id": "string",
      "customerId": "string",
      "productId": "string",
      "orderId": "string",
      "rating": "number",
      "title": "string",
      "comment": "string",
      "pros": "string[]",
      "cons": "string[]",
      "images": "string[]",
      "videos": "string[]",
      "isVerifiedPurchase": "boolean",
      "helpfulCount": "number",
      "notHelpfulCount": "number",
      "status": "string",
      "approvedBy": "string",
      "approvedAt": "string",
      "sellerResponse": "string",
      "sellerRespondedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /reviews/:id

**Description:** Delete a review.

**Request:**
- Method: `DELETE`
- Endpoint: `/reviews/:id`
- Path Parameter: `id` (review ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "timestamp": "string"
}
```

### POST /reviews/:id/reply

**Description:** Reply to a review.

**Request:**
- Method: `POST`
- Endpoint: `/reviews/:id/reply`
- Path Parameter: `id` (review ID)
- Content-Type: `application/json`
- Body: `{ sellerResponse: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Reply added to review successfully",
  "data": {
    "review": {
      "id": "string",
      "customerId": "string",
      "productId": "string",
      "orderId": "string",
      "rating": "number",
      "title": "string",
      "comment": "string",
      "pros": "string[]",
      "cons": "string[]",
      "images": "string[]",
      "videos": "string[]",
      "isVerifiedPurchase": "boolean",
      "helpfulCount": "number",
      "notHelpfulCount": "number",
      "status": "string",
      "approvedBy": "string",
      "approvedAt": "string",
      "sellerResponse": "string",
      "sellerRespondedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Vendor Management

### GET /vendors

**Description:** Get all vendors.

**Request:**
- Method: `GET`
- Endpoint: `/vendors`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendors retrieved successfully",
  "data": {
    "vendors": [
      {
        "id": "string",
        "userId": "string",
        "vendorCode": "string",
        "businessName": "string",
        "businessType": "string",
        "gstNumber": "string",
        "panNumber": "string",
        "registrationNumber": "string",
        "businessEmail": "string",
        "businessPhone": "string",
        "supportEmail": "string",
        "supportPhone": "string",
        "businessAddress": "object",
        "warehouseAddresses": "object",
        "bankDetails": "object",
        "commissionRate": "number",
        "status": "string",
        "verifiedAt": "string",
        "rating": "number",
        "totalProducts": "number",
        "totalSales": "number",
        "metadata": "object",
        "deletedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "user": {
          "id": "string",
          "email": "string",
          "role": "string",
          "status": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /vendors/:id

**Description:** Get vendor by ID.

**Request:**
- Method: `GET`
- Endpoint: `/vendors/:id`
- Path Parameter: `id` (vendor ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor retrieved successfully",
  "data": {
    "vendor": {
      "id": "string",
      "userId": "string",
      "vendorCode": "string",
      "businessName": "string",
      "businessType": "string",
      "gstNumber": "string",
      "panNumber": "string",
      "registrationNumber": "string",
      "businessEmail": "string",
      "businessPhone": "string",
      "supportEmail": "string",
      "supportPhone": "string",
      "businessAddress": "object",
      "warehouseAddresses": "object",
      "bankDetails": "object",
      "commissionRate": "number",
      "status": "string",
      "verifiedAt": "string",
      "rating": "number",
      "totalProducts": "number",
      "totalSales": "number",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /vendors

**Description:** Create a new vendor.

**Request:**
- Method: `POST`
- Endpoint: `/vendors`
- Content-Type: `application/json`
- Body: `{ businessName: string, businessType: string, businessEmail: string, businessPhone: string, supportEmail: string, supportPhone: string, businessAddress: object, warehouseAddresses: object, commissionRate: number, gstNumber: string, panNumber: string, registrationNumber: string, bankDetails: object, metadata: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor created successfully",
  "data": {
    "vendor": {
      "id": "string",
      "userId": "string",
      "vendorCode": "string",
      "businessName": "string",
      "businessType": "string",
      "gstNumber": "string",
      "panNumber": "string",
      "registrationNumber": "string",
      "businessEmail": "string",
      "businessPhone": "string",
      "supportEmail": "string",
      "supportPhone": "string",
      "businessAddress": "object",
      "warehouseAddresses": "object",
      "bankDetails": "object",
      "commissionRate": "number",
      "status": "string",
      "verifiedAt": "string",
      "rating": "number",
      "totalProducts": "number",
      "totalSales": "number",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /vendors/:id

**Description:** Update a vendor.

**Request:**
- Method: `PUT`
- Endpoint: `/vendors/:id`
- Path Parameter: `id` (vendor ID)
- Content-Type: `application/json`
- Body: `{ businessName: string, businessType: string, businessEmail: string, businessPhone: string, supportEmail: string, supportPhone: string, businessAddress: object, warehouseAddresses: object, commissionRate: number, gstNumber: string, panNumber: string, registrationNumber: string, bankDetails: object, metadata: object, status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "data": {
    "vendor": {
      "id": "string",
      "userId": "string",
      "vendorCode": "string",
      "businessName": "string",
      "businessType": "string",
      "gstNumber": "string",
      "panNumber": "string",
      "registrationNumber": "string",
      "businessEmail": "string",
      "businessPhone": "string",
      "supportEmail": "string",
      "supportPhone": "string",
      "businessAddress": "object",
      "warehouseAddresses": "object",
      "bankDetails": "object",
      "commissionRate": "number",
      "status": "string",
      "verifiedAt": "string",
      "rating": "number",
      "totalProducts": "number",
      "totalSales": "number",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /vendors/:id

**Description:** Delete a vendor.

**Request:**
- Method: `DELETE`
- Endpoint: `/vendors/:id`
- Path Parameter: `id` (vendor ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor deleted successfully",
  "data": {
    "vendor": {
      "id": "string",
      "userId": "string",
      "vendorCode": "string",
      "businessName": "string",
      "businessType": "string",
      "gstNumber": "string",
      "panNumber": "string",
      "registrationNumber": "string",
      "businessEmail": "string",
      "businessPhone": "string",
      "supportEmail": "string",
      "supportPhone": "string",
      "businessAddress": "object",
      "warehouseAddresses": "object",
      "bankDetails": "object",
      "commissionRate": "number",
      "status": "string",
      "verifiedAt": "string",
      "rating": "number",
      "totalProducts": "number",
      "totalSales": "number",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /vendors/:id/status

**Description:** Update vendor status.

**Request:**
- Method: `PATCH`
- Endpoint: `/vendors/:id/status`
- Path Parameter: `id` (vendor ID)
- Content-Type: `application/json`
- Body: `{ status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor status updated successfully",
  "data": {
    "vendor": {
      "id": "string",
      "userId": "string",
      "vendorCode": "string",
      "businessName": "string",
      "businessType": "string",
      "gstNumber": "string",
      "panNumber": "string",
      "registrationNumber": "string",
      "businessEmail": "string",
      "businessPhone": "string",
      "supportEmail": "string",
      "supportPhone": "string",
      "businessAddress": "object",
      "warehouseAddresses": "object",
      "bankDetails": "object",
      "commissionRate": "number",
      "status": "string",
      "verifiedAt": "string",
      "rating": "number",
      "totalProducts": "number",
      "totalSales": "number",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Vendor Payout Management

### GET /vendor-payouts

**Description:** Get all vendor payouts.

**Request:**
- Method: `GET`
- Endpoint: `/vendor-payouts`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payouts retrieved successfully",
  "data": {
    "payouts": [
      {
        "id": "string",
        "vendorId": "string",
        "amount": "number",
        "currency": "string",
        "status": "string",
        "periodStart": "string",
        "periodEnd": "string",
        "transactionId": "string",
        "paymentMethod": "string",
        "paymentDetails": "object",
        "processedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "vendor": {
          "id": "string",
          "businessName": "string",
          "vendorCode": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /vendor-payouts/:id

**Description:** Get vendor payout by ID.

**Request:**
- Method: `GET`
- Endpoint: `/vendor-payouts/:id`
- Path Parameter: `id` (payout ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout retrieved successfully",
  "data": {
    "payout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "businessName": "string",
        "vendorCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /vendor-payouts

**Description:** Create a new vendor payout.

**Request:**
- Method: `POST`
- Endpoint: `/vendor-payouts`
- Content-Type: `application/json`
- Body: `{ vendorId: string, amount: number, currency: string, periodStart: string, periodEnd: string, transactionId: string, paymentMethod: string, paymentDetails: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout created successfully",
  "data": {
    "payout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "businessName": "string",
        "vendorCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /vendor-payouts/:id

**Description:** Update a vendor payout.

**Request:**
- Method: `PUT`
- Endpoint: `/vendor-payouts/:id`
- Path Parameter: `id` (payout ID)
- Content-Type: `application/json`
- Body: `{ amount: number, currency: string, periodStart: string, periodEnd: string, transactionId: string, paymentMethod: string, paymentDetails: object }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout updated successfully",
  "data": {
    "payout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "businessName": "string",
        "vendorCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /vendor-payouts/:id

**Description:** Delete a vendor payout.

**Request:**
- Method: `DELETE`
- Endpoint: `/vendor-payouts/:id`
- Path Parameter: `id` (payout ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout deleted successfully",
  "data": {
    "payout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "businessName": "string",
        "vendorCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /vendor-payouts/:id/status

**Description:** Update vendor payout status.

**Request:**
- Method: `PATCH`
- Endpoint: `/vendor-payouts/:id/status`
- Path Parameter: `id` (payout ID)
- Content-Type: `application/json`
- Body: `{ status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout status updated successfully",
  "data": {
    "payout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "businessName": "string",
        "vendorCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Warehouse Management

### GET /warehouses

**Description:** Get all warehouses.

**Request:**
- Method: `GET`
- Endpoint: `/warehouses`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Warehouses retrieved successfully",
  "data": {
    "warehouses": [
      {
        "id": "string",
        "code": "string",
        "name": "string",
        "type": "string",
        "address": "object",
        "lat": "number",
        "lng": "number",
        "managerId": "string",
        "contactPhone": "string",
        "contactEmail": "string",
        "totalCapacity": "number",
        "usedCapacity": "number",
        "isActive": "boolean",
        "createdAt": "string",
        "updatedAt": "string",
        "manager": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "employeeCode": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /warehouses/:id

**Description:** Get warehouse by ID.

**Request:**
- Method: `GET`
- Endpoint: `/warehouses/:id`
- Path Parameter: `id` (warehouse ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Warehouse retrieved successfully",
  "data": {
    "warehouse": {
      "id": "string",
      "code": "string",
      "name": "string",
      "type": "string",
      "address": "object",
      "lat": "number",
      "lng": "number",
      "managerId": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "totalCapacity": "number",
      "usedCapacity": "number",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "manager": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "employeeCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /warehouses

**Description:** Create a new warehouse.

**Request:**
- Method: `POST`
- Endpoint: `/warehouses`
- Content-Type: `application/json`
- Body: `{ code: string, name: string, type: string, address: object, lat: number, lng: number, managerId: string, contactPhone: string, contactEmail: string, totalCapacity: number, usedCapacity: number, isActive: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Warehouse created successfully",
  "data": {
    "warehouse": {
      "id": "string",
      "code": "string",
      "name": "string",
      "type": "string",
      "address": "object",
      "lat": "number",
      "lng": "number",
      "managerId": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "totalCapacity": "number",
      "usedCapacity": "number",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "manager": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "employeeCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /warehouses/:id

**Description:** Update a warehouse.

**Request:**
- Method: `PUT`
- Endpoint: `/warehouses/:id`
- Path Parameter: `id` (warehouse ID)
- Content-Type: `application/json`
- Body: `{ name: string, type: string, address: object, lat: number, lng: number, managerId: string, contactPhone: string, contactEmail: string, totalCapacity: number, usedCapacity: number, isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Warehouse updated successfully",
  "data": {
    "warehouse": {
      "id": "string",
      "code": "string",
      "name": "string",
      "type": "string",
      "address": "object",
      "lat": "number",
      "lng": "number",
      "managerId": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "totalCapacity": "number",
      "usedCapacity": "number",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "manager": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "employeeCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /warehouses/:id

**Description:** Delete a warehouse.

**Request:**
- Method: `DELETE`
- Endpoint: `/warehouses/:id`
- Path Parameter: `id` (warehouse ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Warehouse deleted successfully",
  "data": {
    "warehouse": {
      "id": "string",
      "code": "string",
      "name": "string",
      "type": "string",
      "address": "object",
      "lat": "number",
      "lng": "number",
      "managerId": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "totalCapacity": "number",
      "usedCapacity": "number",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "manager": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "employeeCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Inventory Management

### GET /inventories

**Description:** Get all inventories.


**Request:**
- Method: `GET`
- Endpoint: `/inventories`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Inventories retrieved successfully",
  "data": {
    "inventories": [
      {
        "id": "string",
        "productId": "string",
        "variantId": "string",
        "warehouseId": "string",
        "availableQuantity": "number",
        "reservedQuantity": "number",
        "damagedQuantity": "number",
        "minStockLevel": "number",
        "maxStockLevel": "number",
        "reorderPoint": "number",
        "reorderQuantity": "number",
        "rack": "string",
        "shelf": "string",
        "bin": "string",
        "lastRestockedAt": "string",
        "lastCountedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "product": {
          "id": "string",
          "name": "string",
          "sku": "string"
        },
        "variant": {
          "id": "string",
          "variantName": "string"
        },
        "warehouse": {
          "id": "string",
          "name": "string",
          "code": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /inventories/:id

**Description:** Get inventory by ID.

**Request:**
- Method: `GET`
- Endpoint: `/inventories/:id`
- Path Parameter: `id` (inventory ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Inventory retrieved successfully",
  "data": {
    "inventory": {
      "id": "string",
      "productId": "string",
      "variantId": "string",
      "warehouseId": "string",
      "availableQuantity": "number",
      "reservedQuantity": "number",
      "damagedQuantity": "number",
      "minStockLevel": "number",
      "maxStockLevel": "number",
      "reorderPoint": "number",
      "reorderQuantity": "number",
      "rack": "string",
      "shelf": "string",
      "bin": "string",
      "lastRestockedAt": "string",
      "lastCountedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "sku": "string"
      },
      "variant": {
        "id": "string",
        "variantName": "string"
      },
      "warehouse": {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /inventories

**Description:** Create a new inventory.

**Request:**
- Method: `POST`
- Endpoint: `/inventories`
- Content-Type: `application/json`
- Body: `{ productId: string, variantId: string, warehouseId: string, availableQuantity: number, reservedQuantity: number, damagedQuantity: number, minStockLevel: number, maxStockLevel: number, reorderPoint: number, reorderQuantity: number, rack: string, shelf: string, bin: string, lastRestockedAt: string, lastCountedAt: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Inventory created successfully",
  "data": {
    "inventory": {
      "id": "string",
      "productId": "string",
      "variantId": "string",
      "warehouseId": "string",
      "availableQuantity": "number",
      "reservedQuantity": "number",
      "damagedQuantity": "number",
      "minStockLevel": "number",
      "maxStockLevel": "number",
      "reorderPoint": "number",
      "reorderQuantity": "number",
      "rack": "string",
      "shelf": "string",
      "bin": "string",
      "lastRestockedAt": "string",
      "lastCountedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "sku": "string"
      },
      "variant": {
        "id": "string",
        "variantName": "string"
      },
      "warehouse": {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /inventories/:id

**Description:** Update an inventory.

**Request:**
- Method: `PUT`
- Endpoint: `/inventories/:id`
- Path Parameter: `id` (inventory ID)
- Content-Type: `application/json`
- Body: `{ availableQuantity: number, reservedQuantity: number, damagedQuantity: number, minStockLevel: number, maxStockLevel: number, reorderPoint: number, reorderQuantity: number, rack: string, shelf: string, bin: string, lastRestockedAt: string, lastCountedAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Inventory updated successfully",
  "data": {
    "inventory": {
      "id": "string",
      "productId": "string",
      "variantId": "string",
      "warehouseId": "string",
      "availableQuantity": "number",
      "reservedQuantity": "number",
      "damagedQuantity": "number",
      "minStockLevel": "number",
      "maxStockLevel": "number",
      "reorderPoint": "number",
      "reorderQuantity": "number",
      "rack": "string",
      "shelf": "string",
      "bin": "string",
      "lastRestockedAt": "string",
      "lastCountedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "sku": "string"
      },
      "variant": {
        "id": "string",
        "variantName": "string"
      },
      "warehouse": {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /inventories/:id

**Description:** Delete an inventory.

**Request:**
- Method: `DELETE`
- Endpoint: `/inventories/:id`
- Path Parameter: `id` (inventory ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Inventory deleted successfully",
  "data": {
    "inventory": {
      "id": "string",
      "productId": "string",
      "variantId": "string",
      "warehouseId": "string",
      "availableQuantity": "number",
      "reservedQuantity": "number",
      "damagedQuantity": "number",
      "minStockLevel": "number",
      "maxStockLevel": "number",
      "reorderPoint": "number",
      "reorderQuantity": "number",
      "rack": "string",
      "shelf": "string",
      "bin": "string",
      "lastRestockedAt": "string",
      "lastCountedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "sku": "string"
      },
      "variant": {
        "id": "string",
        "variantName": "string"
      },
      "warehouse": {
        "id": "string",
        "name": "string",
        "code": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Delivery Agent Management

### GET /delivery-agents

**Description:** Get all delivery agents.

**Request:**
- Method: `GET`
- Endpoint: `/delivery-agents`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery agents retrieved successfully",
  "data": {
    "deliveryAgents": [
      {
        "id": "string",
        "agentCode": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "phone": "string",
        "alternatePhone": "string",
        "profileImage": "string",
        "identityProof": "object",
        "addressProof": "object",
        "vehicleType": "string",
        "vehicleNumber": "string",
        "vehicleModel": "string",
        "licenseNumber": "string",
        "licenseExpiry": "string",
        "insuranceExpiry": "string",
        "employmentType": "string",
        "status": "string",
        "zones": "string[]",
        "currentZone": "string",
        "isAvailable": "boolean",
        "availableFrom": "string",
        "availableUntil": "string",
        "lastKnownLat": "number",
        "lastKnownLng": "number",
        "lastLocationUpdate": "string",
        "totalDeliveries": "number",
        "successfulDeliveries": "number",
        "failedDeliveries": "number",
        "avgDeliveryTime": "number",
        "rating": "number",
        "totalRatings": "number",
        "totalEarnings": "number",
        "pendingEarnings": "number",
        "bankDetails": "object",
        "onboardedBy": "string",
        "metadata": "object",
        "deletedAt": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /delivery-agents/:id

**Description:** Get delivery agent by ID.

**Request:**
- Method: `GET`
- Endpoint: `/delivery-agents/:id`
- Path Parameter: `id` (delivery agent ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery agent retrieved successfully",
  "data": {
    "deliveryAgent": {
      "id": "string",
      "agentCode": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "alternatePhone": "string",
      "profileImage": "string",
      "identityProof": "object",
      "addressProof": "object",
      "vehicleType": "string",
      "vehicleNumber": "string",
      "vehicleModel": "string",
      "licenseNumber": "string",
      "licenseExpiry": "string",
      "insuranceExpiry": "string",
      "employmentType": "string",
      "status": "string",
      "zones": "string[]",
      "currentZone": "string",
      "isAvailable": "boolean",
      "availableFrom": "string",
      "availableUntil": "string",
      "lastKnownLat": "number",
      "lastKnownLng": "number",
      "lastLocationUpdate": "string",
      "totalDeliveries": "number",
      "successfulDeliveries": "number",
      "failedDeliveries": "number",
      "avgDeliveryTime": "number",
      "rating": "number",
      "totalRatings": "number",
      "totalEarnings": "number",
      "pendingEarnings": "number",
      "bankDetails": "object",
      "onboardedBy": "string",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### POST /delivery-agents

**Description:** Create a new delivery agent.

**Request:**
- Method: `POST`
- Endpoint: `/delivery-agents`
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, email: string, phone: string, password: string, alternatePhone: string, profileImage: string, identityProof: object, addressProof: object, vehicleType: string, vehicleNumber: string, vehicleModel: string, licenseNumber: string, licenseExpiry: string, insuranceExpiry: string, employmentType: string, zones: string[], currentZone: string, bankDetails: object, metadata: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery agent created successfully",
  "data": {
    "deliveryAgent": {
      "id": "string",
      "agentCode": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "alternatePhone": "string",
      "profileImage": "string",
      "identityProof": "object",
      "addressProof": "object",
      "vehicleType": "string",
      "vehicleNumber": "string",
      "vehicleModel": "string",
      "licenseNumber": "string",
      "licenseExpiry": "string",
      "insuranceExpiry": "string",
      "employmentType": "string",
      "status": "string",
      "zones": "string[]",
      "currentZone": "string",
      "isAvailable": "boolean",
      "availableFrom": "string",
      "availableUntil": "string",
      "lastKnownLat": "number",
      "lastKnownLng": "number",
      "lastLocationUpdate": "string",
      "totalDeliveries": "number",
      "successfulDeliveries": "number",
      "failedDeliveries": "number",
      "avgDeliveryTime": "number",
      "rating": "number",
      "totalRatings": "number",
      "totalEarnings": "number",
      "pendingEarnings": "number",
      "bankDetails": "object",
      "onboardedBy": "string",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /delivery-agents/:id

**Description:** Update a delivery agent.

**Request:**
- Method: `PUT`
- Endpoint: `/delivery-agents/:id`
- Path Parameter: `id` (delivery agent ID)
- Content-Type: `application/json`
- Body: `{ firstName: string, lastName: string, phone: string, alternatePhone: string, profileImage: string, identityProof: object, addressProof: object, vehicleType: string, vehicleNumber: string, vehicleModel: string, licenseNumber: string, licenseExpiry: string, insuranceExpiry: string, zones: string[], currentZone: string, bankDetails: object, metadata: object, status: string, isAvailable: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery agent updated successfully",
  "data": {
    "deliveryAgent": {
      "id": "string",
      "agentCode": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "alternatePhone": "string",
      "profileImage": "string",
      "identityProof": "object",
      "addressProof": "object",
      "vehicleType": "string",
      "vehicleNumber": "string",
      "vehicleModel": "string",
      "licenseNumber": "string",
      "licenseExpiry": "string",
      "insuranceExpiry": "string",
      "employmentType": "string",
      "status": "string",
      "zones": "string[]",
      "currentZone": "string",
      "isAvailable": "boolean",
      "availableFrom": "string",
      "availableUntil": "string",
      "lastKnownLat": "number",
      "lastKnownLng": "number",
      "lastLocationUpdate": "string",
      "totalDeliveries": "number",
      "successfulDeliveries": "number",
      "failedDeliveries": "number",
      "avgDeliveryTime": "number",
      "rating": "number",
      "totalRatings": "number",
      "totalEarnings": "number",
      "pendingEarnings": "number",
      "bankDetails": "object",
      "onboardedBy": "string",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /delivery-agents/:id

**Description:** Delete a delivery agent.

**Request:**
- Method: `DELETE`
- Endpoint: `/delivery-agents/:id`
- Path Parameter: `id` (delivery agent ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery agent deleted successfully",
  "data": {
    "deliveryAgent": {
      "id": "string",
      "agentCode": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "alternatePhone": "string",
      "profileImage": "string",
      "identityProof": "object",
      "addressProof": "object",
      "vehicleType": "string",
      "vehicleNumber": "string",
      "vehicleModel": "string",
      "licenseNumber": "string",
      "licenseExpiry": "string",
      "insuranceExpiry": "string",
      "employmentType": "string",
      "status": "string",
      "zones": "string[]",
      "currentZone": "string",
      "isAvailable": "boolean",
      "availableFrom": "string",
      "availableUntil": "string",
      "lastKnownLat": "number",
      "lastKnownLng": "number",
      "lastLocationUpdate": "string",
      "totalDeliveries": "number",
      "successfulDeliveries": "number",
      "failedDeliveries": "number",
      "avgDeliveryTime": "number",
      "rating": "number",
      "totalRatings": "number",
      "totalEarnings": "number",
      "pendingEarnings": "number",
      "bankDetails": "object",
      "onboardedBy": "string",
      "metadata": "object",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Delivery Management

### GET /deliveries

**Description:** Get all deliveries.

**Request:**
- Method: `GET`
- Endpoint: `/deliveries`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Deliveries retrieved successfully",
  "data": {
    "deliveries": [
      {
        "id": "string",
        "orderId": "string",
        "deliveryAgentId": "string",
        "deliveryType": "string",
        "trackingId": "string",
        "status": "string",
        "pickupAddress": "object",
        "pickupTime": "string",
        "pickupOtp": "string",
        "deliveryAddress": "object",
        "scheduledDate": "string",
        "scheduledSlot": "string",
        "deliveryTime": "string",
        "deliveryOtp": "string",
        "deliveryProof": "string",
        "receiverName": "string",
        "receiverRelation": "string",
        "signature": "string",
        "failureReason": "string",
        "failureNotes": "string",
        "attemptCount": "number",
        "maxAttempts": "number",
        "distance": "number",
        "duration": "number",
        "deliveryCharge": "number",
        "codAmount": "number",
        "codCollected": "number",
        "customerRating": "number",
        "customerFeedback": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "order": {
          "id": "string",
          "orderNumber": "string",
          "customerName": "string",
          "customerEmail": "string",
          "totalAmount": "number"
        },
        "agent": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "agentCode": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /deliveries/:id

**Description:** Get delivery by ID.

**Request:**
- Method: `GET`
- Endpoint: `/deliveries/:id`
- Path Parameter: `id` (delivery ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery retrieved successfully",
  "data": {
    "delivery": {
      "id": "string",
      "orderId": "string",
      "deliveryAgentId": "string",
      "deliveryType": "string",
      "trackingId": "string",
      "status": "string",
      "pickupAddress": "object",
      "pickupTime": "string",
      "pickupOtp": "string",
      "deliveryAddress": "object",
      "scheduledDate": "string",
      "scheduledSlot": "string",
      "deliveryTime": "string",
      "deliveryOtp": "string",
      "deliveryProof": "string",
      "receiverName": "string",
      "receiverRelation": "string",
      "signature": "string",
      "failureReason": "string",
      "failureNotes": "string",
      "attemptCount": "number",
      "maxAttempts": "number",
      "distance": "number",
      "duration": "number",
      "deliveryCharge": "number",
      "codAmount": "number",
      "codCollected": "number",
      "customerRating": "number",
      "customerFeedback": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "customerEmail": "string",
        "totalAmount": "number"
      },
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /deliveries

**Description:** Create a new delivery.

**Request:**
- Method: `POST`
- Endpoint: `/deliveries`
- Content-Type: `application/json`
- Body: `{ orderId: string, deliveryAgentId: string, deliveryType: string, pickupAddress: object, deliveryAddress: object, scheduledDate: string, scheduledSlot: string, deliveryCharge: number, codAmount: number }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery created successfully",
  "data": {
    "delivery": {
      "id": "string",
      "orderId": "string",
      "deliveryAgentId": "string",
      "deliveryType": "string",
      "trackingId": "string",
      "status": "string",
      "pickupAddress": "object",
      "pickupTime": "string",
      "pickupOtp": "string",
      "deliveryAddress": "object",
      "scheduledDate": "string",
      "scheduledSlot": "string",
      "deliveryTime": "string",
      "deliveryOtp": "string",
      "deliveryProof": "string",
      "receiverName": "string",
      "receiverRelation": "string",
      "signature": "string",
      "failureReason": "string",
      "failureNotes": "string",
      "attemptCount": "number",
      "maxAttempts": "number",
      "distance": "number",
      "duration": "number",
      "deliveryCharge": "number",
      "codAmount": "number",
      "codCollected": "number",
      "customerRating": "number",
      "customerFeedback": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "customerEmail": "string",
        "totalAmount": "number"
      },
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /deliveries/:id

**Description:** Update a delivery.

**Request:**
- Method: `PUT`
- Endpoint: `/deliveries/:id`
- Path Parameter: `id` (delivery ID)
- Content-Type: `application/json`
- Body: `{ status: string, deliveryTime: string, deliveryOtp: string, deliveryProof: string, receiverName: string, receiverRelation: string, signature: string, failureReason: string, failureNotes: string, attemptCount: number, customerRating: number, customerFeedback: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery updated successfully",
  "data": {
    "delivery": {
      "id": "string",
      "orderId": "string",
      "deliveryAgentId": "string",
      "deliveryType": "string",
      "trackingId": "string",
      "status": "string",
      "pickupAddress": "object",
      "pickupTime": "string",
      "pickupOtp": "string",
      "deliveryAddress": "object",
      "scheduledDate": "string",
      "scheduledSlot": "string",
      "deliveryTime": "string",
      "deliveryOtp": "string",
      "deliveryProof": "string",
      "receiverName": "string",
      "receiverRelation": "string",
      "signature": "string",
      "failureReason": "string",
      "failureNotes": "string",
      "attemptCount": "number",
      "maxAttempts": "number",
      "distance": "number",
      "duration": "number",
      "deliveryCharge": "number",
      "codAmount": "number",
      "codCollected": "number",
      "customerRating": "number",
      "customerFeedback": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "customerEmail": "string",
        "totalAmount": "number"
      },
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /deliveries/:id

**Description:** Delete a delivery.

**Request:**
- Method: `DELETE`
- Endpoint: `/deliveries/:id`
- Path Parameter: `id` (delivery ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery deleted successfully",
  "data": {
    "delivery": {
      "id": "string",
      "orderId": "string",
      "deliveryAgentId": "string",
      "deliveryType": "string",
      "trackingId": "string",
      "status": "string",
      "pickupAddress": "object",
      "pickupTime": "string",
      "pickupOtp": "string",
      "deliveryAddress": "object",
      "scheduledDate": "string",
      "scheduledSlot": "string",
      "deliveryTime": "string",
      "deliveryOtp": "string",
      "deliveryProof": "string",
      "receiverName": "string",
      "receiverRelation": "string",
      "signature": "string",
      "failureReason": "string",
      "failureNotes": "string",
      "attemptCount": "number",
      "maxAttempts": "number",
      "distance": "number",
      "duration": "number",
      "deliveryCharge": "number",
      "codAmount": "number",
      "codCollected": "number",
      "customerRating": "number",
      "customerFeedback": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "customerEmail": "string",
        "totalAmount": "number"
      },
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```


## Delivery Earning Management

### GET /delivery-earnings

**Description:** Get all delivery earnings.

**Request:**
- Method: `GET`
- Endpoint: `/delivery-earnings`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery earnings retrieved successfully",
  "data": {
    "earnings": [
      {
        "id": "string",
        "agentId": "string",
        "deliveryId": "string",
        "type": "string",
        "amount": "number",
        "description": "string",
        "status": "string",
        "paidAt": "string",
        "paymentReference": "string",
        "createdAt": "string",
        "agent": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "agentCode": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /delivery-earnings/:id

**Description:** Get delivery earning by ID.

**Request:**
- Method: `GET`
- Endpoint: `/delivery-earnings/:id`
- Path Parameter: `id` (delivery earning ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery earning retrieved successfully",
  "data": {
    "earning": {
      "id": "string",
      "agentId": "string",
      "deliveryId": "string",
      "type": "string",
      "amount": "number",
      "description": "string",
      "status": "string",
      "paidAt": "string",
      "paymentReference": "string",
      "createdAt": "string",
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /delivery-earnings

**Description:** Create a new delivery earning.

**Request:**
- Method: `POST`
- Endpoint: `/delivery-earnings`
- Content-Type: `application/json`
- Body: `{ agentId: string, deliveryId: string, type: string, amount: number, description: string, status: string, paidAt: string, paymentReference: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery earning created successfully",
  "data": {
    "earning": {
      "id": "string",
      "agentId": "string",
      "deliveryId": "string",
      "type": "string",
      "amount": "number",
      "description": "string",
      "status": "string",
      "paidAt": "string",
      "paymentReference": "string",
      "createdAt": "string",
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /delivery-earnings/:id

**Description:** Update a delivery earning.

**Request:**
- Method: `PUT`
- Endpoint: `/delivery-earnings/:id`
- Path Parameter: `id` (delivery earning ID)
- Content-Type: `application/json`
- Body: `{ type: string, amount: number, description: string, status: string, paidAt: string, paymentReference: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery earning updated successfully",
  "data": {
    "earning": {
      "id": "string",
      "agentId": "string",
      "deliveryId": "string",
      "type": "string",
      "amount": "number",
      "description": "string",
      "status": "string",
      "paidAt": "string",
      "paymentReference": "string",
      "createdAt": "string",
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /delivery-earnings/:id

**Description:** Delete a delivery earning.

**Request:**
- Method: `DELETE`
- Endpoint: `/delivery-earnings/:id`
- Path Parameter: `id` (delivery earning ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Delivery earning deleted successfully",
  "data": {
    "earning": {
      "id": "string",
      "agentId": "string",
      "deliveryId": "string",
      "type": "string",
      "amount": "number",
      "description": "string",
      "status": "string",
      "paidAt": "string",
      "paymentReference": "string",
      "createdAt": "string",
      "agent": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "agentCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Referral Management

### GET /referral-codes/:id

**Description:** Get referral code by ID.

**Request:**
- Method: `GET`
- Endpoint: `/referral-codes/:id`
- Path Parameter: `id` (referral code ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral code retrieved successfully",
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": "boolean",
      "customerId": "string",
      "createdAt": "string",
      "deactivatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /referral-codes

**Description:** Create a new referral code.

**Request:**
- Method: `POST`
- Endpoint: `/referral-codes`
- Content-Type: `application/json`
- Body: `{ customerId: string, isActive: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral code created successfully",
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": "boolean",
      "customerId": "string",
      "createdAt": "string",
      "deactivatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /referral-codes/:id

**Description:** Update a referral code.

**Request:**
- Method: `PUT`
- Endpoint: `/referral-codes/:id`
- Path Parameter: `id` (referral code ID)
- Content-Type: `application/json`
- Body: `{ isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral code updated successfully",
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": "boolean",
      "customerId": "string",
      "createdAt": "string",
      "deactivatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /referral-codes/:id

**Description:** Delete a referral code.

**Request:**
- Method: `DELETE`
- Endpoint: `/referral-codes/:id`
- Path Parameter: `id` (referral code ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral code deleted successfully",
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": "boolean",
      "customerId": "string",
      "createdAt": "string",
      "deactivatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /referral-codes/:id/deactivate

**Description:** Deactivate a referral code.

**Request:**
- Method: `PATCH`
- Endpoint: `/referral-codes/:id/deactivate`
- Path Parameter: `id` (referral code ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral code deactivated successfully",
  "data": {
    "referralCode": {
      "id": "string",
      "code": "string",
      "isActive": "boolean",
      "customerId": "string",
      "createdAt": "string",
      "deactivatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### GET /referral-history

**Description:** Get all referral history.

**Request:**
- Method: `GET`
- Endpoint: `/referral-history`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral history retrieved successfully",
  "data": {
    "referralHistory": [
      {
        "id": "string",
        "referralCodeId": "string",
        "referrerId": "string",
        "referredUserId": "string",
        "referrerSubscriptionId": "string",
        "triggeredCardId": "string",
        "status": "string",
        "rewardAmount": "number",
        "rewardedAt": "string",
        "expiredAt": "string",
        "createdAt": "string",
        "referrer": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "customerCode": "string"
        },
        "referredUser": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "customerCode": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /referral-history/:id

**Description:** Get referral history by ID.

**Request:**
- Method: `GET`
- Endpoint: `/referral-history/:id`
- Path Parameter: `id` (referral history ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral history retrieved successfully",
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "string",
      "rewardAmount": "number",
      "rewardedAt": "string",
      "expiredAt": "string",
      "createdAt": "string",
      "referrer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      },
      "referredUser": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /referral-history

**Description:** Create a new referral history.

**Request:**
- Method: `POST`
- Endpoint: `/referral-history`
- Content-Type: `application/json`
- Body: `{ referralCodeId: string, referrerId: string, referredUserId: string, referrerSubscriptionId: string, triggeredCardId: string, status: string, rewardAmount: number, rewardedAt: string, expiredAt: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral history created successfully",
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "string",
      "rewardAmount": "number",
      "rewardedAt": "string",
      "expiredAt": "string",
      "createdAt": "string",
      "referrer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      },
      "referredUser": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /referral-history/:id

**Description:** Update a referral history.

**Request:**
- Method: `PUT`
- Endpoint: `/referral-history/:id`
- Path Parameter: `id` (referral history ID)
- Content-Type: `application/json`
- Body: `{ status: string, rewardAmount: number, rewardedAt: string, expiredAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral history updated successfully",
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "string",
      "rewardAmount": "number",
      "rewardedAt": "string",
      "expiredAt": "string",
      "createdAt": "string",
      "referrer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      },
      "referredUser": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /referral-history/:id

**Description:** Delete a referral history.

**Request:**
- Method: `DELETE`
- Endpoint: `/referral-history/:id`
- Path Parameter: `id` (referral history ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Referral history deleted successfully",
  "data": {
    "referralHistory": {
      "id": "string",
      "referralCodeId": "string",
      "referrerId": "string",
      "referredUserId": "string",
      "referrerSubscriptionId": "string",
      "triggeredCardId": "string",
      "status": "string",
      "rewardAmount": "number",
      "rewardedAt": "string",
      "expiredAt": "string",
      "createdAt": "string",
      "referrer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      },
      "referredUser": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Notification Management

### POST /notifications

**Description:** Create a new notification.

**Request:**
- Method: `POST`
- Endpoint: `/notifications`
- Content-Type: `application/json`
- Body: `{ userId: string, type: string, title: string, message: string, data: object, sentViaEmail: boolean, sentViaSms: boolean, sentViaPush: boolean, expiresAt: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Notification created successfully",
  "data": {
    "notification": {
      "id": "string",
      "userId": "string",
      "type": "string",
      "title": "string",
      "message": "string",
      "data": "object",
      "isRead": "boolean",
      "readAt": "string",
      "sentViaEmail": "boolean",
      "sentViaSms": "boolean",
      "sentViaPush": "boolean",
      "expiresAt": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /notifications/:id

**Description:** Update a notification.

**Request:**
- Method: `PUT`
- Endpoint: `/notifications/:id`
- Path Parameter: `id` (notification ID)
- Content-Type: `application/json`
- Body: `{ title: string, message: string, data: object, isRead: boolean, readAt: string, sentViaEmail: boolean, sentViaSms: boolean, sentViaPush: boolean, expiresAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Notification updated successfully",
  "data": {
    "notification": {
      "id": "string",
      "userId": "string",
      "type": "string",
      "title": "string",
      "message": "string",
      "data": "object",
      "isRead": "boolean",
      "readAt": "string",
      "sentViaEmail": "boolean",
      "sentViaSms": "boolean",
      "sentViaPush": "boolean",
      "expiresAt": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /notifications/:id

**Description:** Delete a notification.

**Request:**
- Method: `DELETE`
- Endpoint: `/notifications/:id`
- Path Parameter: `id` (notification ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": {
    "notification": {
      "id": "string",
      "userId": "string",
      "type": "string",
      "title": "string",
      "message": "string",
      "data": "object",
      "isRead": "boolean",
      "readAt": "string",
      "sentViaEmail": "boolean",
      "sentViaSms": "boolean",
      "sentViaPush": "boolean",
      "expiresAt": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Email Template Management

### POST /email-templates

**Description:** Create a new email template.

**Request:**
- Method: `POST`
- Endpoint: `/email-templates`
- Content-Type: `application/json`
- Body: `{ code: string, name: string, subject: string, body: string, variables: string[], isActive: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Email template created successfully",
  "data": {
    "emailTemplate": {
      "id": "string",
      "code": "string",
      "name": "string",
      "subject": "string",
      "body": "string",
      "variables": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /email-templates/:id

**Description:** Update an email template.

**Request:**
- Method: `PUT`
- Endpoint: `/email-templates/:id`
- Path Parameter: `id` (email template ID)
- Content-Type: `application/json`
- Body: `{ name: string, subject: string, body: string, variables: string[], isActive: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Email template updated successfully",
  "data": {
    "emailTemplate": {
      "id": "string",
      "code": "string",
      "name": "string",
      "subject": "string",
      "body": "string",
      "variables": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /email-templates/:id

**Description:** Delete an email template.

**Request:**
- Method: `DELETE`
- Endpoint: `/email-templates/:id`
- Path Parameter: `id` (email template ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Email template deleted successfully",
  "data": {
    "emailTemplate": {
      "id": "string",
      "code": "string",
      "name": "string",
      "subject": "string",
      "body": "string",
      "variables": "string[]",
      "isActive": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Address Management

### POST /addresses

**Description:** Create a new address.

**Request:**
- Method: `POST`
- Endpoint: `/addresses`
- Content-Type: `application/json`
- Body: `{ customerId: string, type: string, fullName: string, phone: string, alternatePhone: string, addressLine1: string, addressLine2: string, landmark: string, city: string, state: string, country: string, postalCode: string, lat: number, lng: number, deliveryInstructions: string, isDefault: boolean }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address created successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "isDefault": "boolean",
      "fullName": "string",
      "phone": "string",
      "alternatePhone": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCode": "string",
      "lat": "number",
      "lng": "number",
      "deliveryInstructions": "string",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /addresses/:id

**Description:** Update an address.

**Request:**
- Method: `PUT`
- Endpoint: `/addresses/:id`
- Path Parameter: `id` (address ID)
- Content-Type: `application/json`
- Body: `{ type: string, fullName: string, phone: string, alternatePhone: string, addressLine1: string, addressLine2: string, landmark: string, city: string, state: string, country: string, postalCode: string, lat: number, lng: number, deliveryInstructions: string, isDefault: boolean }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "isDefault": "boolean",
      "fullName": "string",
      "phone": "string",
      "alternatePhone": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCode": "string",
      "lat": "number",
      "lng": "number",
      "deliveryInstructions": "string",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /addresses/:id

**Description:** Delete an address.

**Request:**
- Method: `DELETE`
- Endpoint: `/addresses/:id`
- Path Parameter: `id` (address ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "isDefault": "boolean",
      "fullName": "string",
      "phone": "string",
      "alternatePhone": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCode": "string",
      "lat": "number",
      "lng": "number",
      "deliveryInstructions": "string",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /addresses/:id/restore

**Description:** Restore a deleted address.

**Request:**
- Method: `PATCH`
- Endpoint: `/addresses/:id/restore`
- Path Parameter: `id` (address ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Address restored successfully",
  "data": {
    "address": {
      "id": "string",
      "customerId": "string",
      "type": "string",
      "isDefault": "boolean",
      "fullName": "string",
      "phone": "string",
      "alternatePhone": "string",
      "addressLine1": "string",
      "addressLine2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "country": "string",
      "postalCode": "string",
      "lat": "number",
      "lng": "number",
      "deliveryInstructions": "string",
      "deletedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "customerCode": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Refund Management

### GET /refunds

**Description:** Get all refunds.

**Request:**
- Method: `GET`
- Endpoint: `/refunds`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Refunds retrieved successfully",
  "data": {
    "refunds": [
      {
        "id": "string",
        "paymentId": "string",
        "returnId": "string",
        "amount": "number",
        "reason": "string",
        "status": "string",
        "gatewayRefundId": "string",
        "gatewayResponse": "object",
        "processedAt": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "payment": {
          "id": "string",
          "orderId": "string",
          "amount": "number",
          "method": "string",
          "status": "string"
        },
        "return": {
          "id": "string",
          "orderId": "string",
          "returnNumber": "string",
          "status": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /refunds/:id

**Description:** Get refund by ID.

**Request:**
- Method: `GET`
- Endpoint: `/refunds/:id`
- Path Parameter: `id` (refund ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Refund retrieved successfully",
  "data": {
    "refund": {
      "id": "string",
      "paymentId": "string",
      "returnId": "string",
      "amount": "number",
      "reason": "string",
      "status": "string",
      "gatewayRefundId": "string",
      "gatewayResponse": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "payment": {
        "id": "string",
        "orderId": "string",
        "amount": "number",
        "method": "string",
        "status": "string"
      },
      "return": {
        "id": "string",
        "orderId": "string",
        "returnNumber": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /refunds

**Description:** Create a new refund.

**Request:**
- Method: `POST`
- Endpoint: `/refunds`
- Content-Type: `application/json`
- Body: `{ paymentId: string, returnId: string, amount: number, reason: string, status: string, gatewayRefundId: string, gatewayResponse: object, processedAt: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Refund created successfully",
  "data": {
    "refund": {
      "id": "string",
      "paymentId": "string",
      "returnId": "string",
      "amount": "number",
      "reason": "string",
      "status": "string",
      "gatewayRefundId": "string",
      "gatewayResponse": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "payment": {
        "id": "string",
        "orderId": "string",
        "amount": "number",
        "method": "string",
        "status": "string"
      },
      "return": {
        "id": "string",
        "orderId": "string",
        "returnNumber": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /refunds/:id

**Description:** Update a refund.

**Request:**
- Method: `PUT`
- Endpoint: `/refunds/:id`
- Path Parameter: `id` (refund ID)
- Content-Type: `application/json`
- Body: `{ status: string, gatewayRefundId: string, gatewayResponse: object, processedAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Refund updated successfully",
  "data": {
    "refund": {
      "id": "string",
      "paymentId": "string",
      "returnId": "string",
      "amount": "number",
      "reason": "string",
      "status": "string",
      "gatewayRefundId": "string",
      "gatewayResponse": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "payment": {
        "id": "string",
        "orderId": "string",
        "amount": "number",
        "method": "string",
        "status": "string"
      },
      "return": {
        "id": "string",
        "orderId": "string",
        "returnNumber": "string",
        "status": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Job Execution Management

### GET /job-executions

**Description:** Get all job executions.

**Request:**
- Method: `GET`
- Endpoint: `/job-executions`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Job executions retrieved successfully",
  "data": {
    "jobExecutions": [
      {
        "id": "string",
        "jobName": "string",
        "executionDate": "string",
        "status": "string",
        "result": "object",
        "errorMessage": "string",
        "startedAt": "string",
        "completedAt": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /job-executions/:id

**Description:** Get job execution by ID.

**Request:**
- Method: `GET`
- Endpoint: `/job-executions/:id`
- Path Parameter: `id` (job execution ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Job execution retrieved successfully",
  "data": {
    "jobExecution": {
      "id": "string",
      "jobName": "string",
      "executionDate": "string",
      "status": "string",
      "result": "object",
      "errorMessage": "string",
      "startedAt": "string",
      "completedAt": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Employee Activity Management

### GET /employee-activities

**Description:** Get all employee activities.

**Request:**
- Method: `GET`
- Endpoint: `/employee-activities`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee activities retrieved successfully",
  "data": {
    "activities": [
      {
        "id": "string",
        "employeeId": "string",
        "action": "string",
        "description": "string",
        "entityType": "string",
        "entityId": "string",
        "metadata": "object",
        "ipAddress": "string",
        "createdAt": "string",
        "employee": {
          "id": "string",
          "userId": "string",
          "employeeCode": "string",
          "designation": "string",
          "status": "string",
          "department": {
            "id": "string",
            "name": "string"
          },
          "user": {
            "id": "string",
            "firstName": "string",
            "lastName": "string",
            "middleName": "string",
            "email": "string",
            "phone": "string",
            "username": "string",
            "role": "EMPLOYEE",
            "status": "ACTIVE|INACTIVE|SUSPENDED",
            "isEmailVerified": true,
            "isPhoneVerified": true,
            "isTwoFactorEnabled": false,
            "dateOfBirth": "string",
            "gender": "MALE|FEMALE|OTHER",
            "avatar": "string",
            "bio": "string",
            "lastLoginAt": "string",
            "lastLoginIp": "string",
            "createdAt": "string",
            "updatedAt": "string"
          }
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /employee-activities/:id

**Description:** Get employee activity by ID.

**Request:**
- Method: `GET`
- Endpoint: `/employee-activities/:id`
- Path Parameter: `id` (employee activity ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Employee activity retrieved successfully",
  "data": {
    "activity": {
      "id": "string",
      "employeeId": "string",
      "action": "string",
      "description": "string",
      "entityType": "string",
      "entityId": "string",
      "metadata": "object",
      "ipAddress": "string",
      "createdAt": "string",
      "employee": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "employeeCode": "string",
        "designation": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Session Management

### GET /sessions

**Description:** Get all sessions.

**Request:**
- Method: `GET`
- Endpoint: `/sessions`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "string",
        "userId": "string",
        "token": "string",
        "ipAddress": "string",
        "userAgent": "string",
        "expiresAt": "string",
        "createdAt": "string",
        "user": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "role": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /sessions/:id

**Description:** Get session by ID.

**Request:**
- Method: `GET`
- Endpoint: `/sessions/:id`
- Path Parameter: `id` (session ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Session retrieved successfully",
  "data": {
    "session": {
      "id": "string",
      "userId": "string",
      "token": "string",
      "ipAddress": "string",
      "userAgent": "string",
      "expiresAt": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /sessions/:id

**Description:** Delete a session.

**Request:**
- Method: `DELETE`
- Endpoint: `/sessions/:id`
- Path Parameter: `id` (session ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully",
  "data": {
    "session": {
      "id": "string",
      "userId": "string",
      "token": "string",
      "ipAddress": "string",
      "userAgent": "string",
      "expiresAt": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /users/:userId/sessions

**Description:** Delete all sessions for a user.

**Request:**
- Method: `DELETE`
- Endpoint: `/users/:userId/sessions`
- Path Parameter: `userId` (user ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "User sessions deleted successfully",
  "data": {
    "count": "number"
  },
  "timestamp": "string"
}
```

## Payment Management

### GET /payments/:id

**Description:** Get payment by ID.

**Request:**
- Method: `GET`
- Endpoint: `/payments/:id`
- Path Parameter: `id` (payment ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "payment": {
      "id": "string",
      "orderId": "string",
      "amount": "number",
      "cash": "number",
      "online": "number",
      "currency": "string",
      "method": "string",
      "status": "string",
      "gatewayName": "string",
      "gatewayOrderId": "string",
      "gatewayPaymentId": "string",
      "gatewaySignature": "string",
      "gatewayResponse": "object",
      "cardLast4": "string",
      "cardBrand": "string",
      "bankName": "string",
      "upiId": "string",
      "isRefundable": "boolean",
      "refundedAmount": "number",
      "paidAt": "string",
      "failedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "totalAmount": "number"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /payments/:id/status

**Description:** Update payment status.

**Request:**
- Method: `PATCH`
- Endpoint: `/payments/:id/status`
- Path Parameter: `id` (payment ID)
- Content-Type: `application/json`
- Body: `{ status: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "payment": {
      "id": "string",
      "orderId": "string",
      "amount": "number",
      "cash": "number",
      "online": "number",
      "currency": "string",
      "method": "string",
      "status": "string",
      "gatewayName": "string",
      "gatewayOrderId": "string",
      "gatewayPaymentId": "string",
      "gatewaySignature": "string",
      "gatewayResponse": "object",
      "cardLast4": "string",
      "cardBrand": "string",
      "bankName": "string",
      "upiId": "string",
      "isRefundable": "boolean",
      "refundedAmount": "number",
      "paidAt": "string",
      "failedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "totalAmount": "number"
      }
    }
  },
  "timestamp": "string"
}
```

## Vendor Payout Management

### POST /vendor-payouts

**Description:** Create a new vendor payout.

**Request:**
- Method: `POST`
- Endpoint: `/vendor-payouts`
- Content-Type: `application/json`
- Body: `{ vendorId: string, amount: number, currency: string, status: string, periodStart: string, periodEnd: string, transactionId: string, paymentMethod: string, paymentDetails: object }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout created successfully",
  "data": {
    "vendorPayout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "vendorCode": "string",
        "businessName": "string",
        "businessEmail": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /vendor-payouts/:id

**Description:** Update a vendor payout.

**Request:**
- Method: `PUT`
- Endpoint: `/vendor-payouts/:id`
- Path Parameter: `id` (vendor payout ID)
- Content-Type: `application/json`
- Body: `{ status: string, transactionId: string, paymentMethod: string, paymentDetails: object, processedAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout updated successfully",
  "data": {
    "vendorPayout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "vendorCode": "string",
        "businessName": "string",
        "businessEmail": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /vendor-payouts/:id

**Description:** Delete a vendor payout.

**Request:**
- Method: `DELETE`
- Endpoint: `/vendor-payouts/:id`
- Path Parameter: `id` (vendor payout ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout deleted successfully",
  "data": {
    "vendorPayout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "vendorCode": "string",
        "businessName": "string",
        "businessEmail": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### PATCH /vendor-payouts/:id/status

**Description:** Update vendor payout status.

**Request:**
- Method: `PATCH`
- Endpoint: `/vendor-payouts/:id/status`
- Path Parameter: `id` (vendor payout ID)
- Content-Type: `application/json`
- Body: `{ status: string, processedAt: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Vendor payout status updated successfully",
  "data": {
    "vendorPayout": {
      "id": "string",
      "vendorId": "string",
      "amount": "number",
      "currency": "string",
      "status": "string",
      "periodStart": "string",
      "periodEnd": "string",
      "transactionId": "string",
      "paymentMethod": "string",
      "paymentDetails": "object",
      "processedAt": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "vendor": {
        "id": "string",
        "vendorCode": "string",
        "businessName": "string",
        "businessEmail": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Invoice Management

### POST /invoices

**Description:** Create a new invoice.

**Request:**
- Method: `POST`
- Endpoint: `/invoices`
- Content-Type: `application/json`
- Body: `{ orderId: string, type: string, subtotal: number, taxAmount: number, totalAmount: number, taxDetails: object, status: string, issuedAt: string, dueDate: string, paidAt: string, pdfUrl: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "invoice": {
      "id": "string",
      "invoiceNumber": "string",
      "orderId": "string",
      "type": "string",
      "subtotal": "number",
      "taxAmount": "number",
      "totalAmount": "number",
      "taxDetails": "object",
      "status": "string",
      "issuedAt": "string",
      "dueDate": "string",
      "paidAt": "string",
      "pdfUrl": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "totalAmount": "number"
      }
    }
  },
  "timestamp": "string"
}
```

### PUT /invoices/:id

**Description:** Update an invoice.

**Request:**
- Method: `PUT`
- Endpoint: `/invoices/:id`
- Path Parameter: `id` (invoice ID)
- Content-Type: `application/json`
- Body: `{ type: string, subtotal: number, taxAmount: number, totalAmount: number, taxDetails: object, status: string, issuedAt: string, dueDate: string, paidAt: string, pdfUrl: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Invoice updated successfully",
  "data": {
    "invoice": {
      "id": "string",
      "invoiceNumber": "string",
      "orderId": "string",
      "type": "string",
      "subtotal": "number",
      "taxAmount": "number",
      "totalAmount": "number",
      "taxDetails": "object",
      "status": "string",
      "issuedAt": "string",
      "dueDate": "string",
      "paidAt": "string",
      "pdfUrl": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "totalAmount": "number"
      }
    }
  },
  "timestamp": "string"
}
```

### DELETE /invoices/:id

**Description:** Delete an invoice.

**Request:**
- Method: `DELETE`
- Endpoint: `/invoices/:id`
- Path Parameter: `id` (invoice ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully",
  "data": {
    "invoice": {
      "id": "string",
      "invoiceNumber": "string",
      "orderId": "string",
      "type": "string",
      "subtotal": "number",
      "taxAmount": "number",
      "totalAmount": "number",
      "taxDetails": "object",
      "status": "string",
      "issuedAt": "string",
      "dueDate": "string",
      "paidAt": "string",
      "pdfUrl": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "order": {
        "id": "string",
        "orderNumber": "string",
        "customerName": "string",
        "totalAmount": "number"
      }
    }
  },
  "timestamp": "string"
}
```

## Stock Movement Management

### GET /stock-movements

**Description:** Get all stock movements.

**Request:**
- Method: `GET`
- Endpoint: `/stock-movements`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Stock movements retrieved successfully",
  "data": {
    "movements": [
      {
        "id": "string",
        "inventoryId": "string",
        "warehouseId": "string",
        "type": "string",
        "quantity": "number",
        "referenceType": "string",
        "referenceId": "string",
        "fromWarehouseId": "string",
        "toWarehouseId": "string",
        "reason": "string",
        "notes": "string",
        "performedBy": "string",
        "performedAt": "string",
        "createdAt": "string",
        "inventory": {
          "id": "string",
          "productId": "string",
          "variantId": "string",
          "warehouseId": "string",
          "availableQuantity": "number",
          "reservedQuantity": "number",
          "damagedQuantity": "number"
        },
        "warehouse": {
          "id": "string",
          "code": "string",
          "name": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /stock-movements/:id

**Description:** Get stock movement by ID.

**Request:**
- Method: `GET`
- Endpoint: `/stock-movements/:id`
- Path Parameter: `id` (stock movement ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Stock movement retrieved successfully",
  "data": {
    "movement": {
      "id": "string",
      "inventoryId": "string",
      "warehouseId": "string",
      "type": "string",
      "quantity": "number",
      "referenceType": "string",
      "referenceId": "string",
      "fromWarehouseId": "string",
      "toWarehouseId": "string",
      "reason": "string",
      "notes": "string",
      "performedBy": "string",
      "performedAt": "string",
      "createdAt": "string",
      "inventory": {
        "id": "string",
        "productId": "string",
        "variantId": "string",
        "warehouseId": "string",
        "availableQuantity": "number",
        "reservedQuantity": "number",
        "damagedQuantity": "number"
      },
      "warehouse": {
        "id": "string",
        "code": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### POST /stock-movements

**Description:** Create a new stock movement.

**Request:**
- Method: `POST`
- Endpoint: `/stock-movements`
- Content-Type: `application/json`
- Body: `{ inventoryId: string, warehouseId: string, type: string, quantity: number, referenceType: string, referenceId: string, fromWarehouseId: string, toWarehouseId: string, reason: string, notes: string, performedBy: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Stock movement created successfully",
  "data": {
    "movement": {
      "id": "string",
      "inventoryId": "string",
      "warehouseId": "string",
      "type": "string",
      "quantity": "number",
      "referenceType": "string",
      "referenceId": "string",
      "fromWarehouseId": "string",
      "toWarehouseId": "string",
      "reason": "string",
      "notes": "string",
      "performedBy": "string",
      "performedAt": "string",
      "createdAt": "string",
      "inventory": {
        "id": "string",
        "productId": "string",
        "variantId": "string",
        "warehouseId": "string",
        "availableQuantity": "number",
        "reservedQuantity": "number",
        "damagedQuantity": "number"
      },
      "warehouse": {
        "id": "string",
        "code": "string",
        "name": "string"
      }
    }
  },
  "timestamp": "string"
}
```

## Price History Management

### GET /price-history

**Description:** Get all price history.

**Request:**
- Method: `GET`
- Endpoint: `/price-history`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Price history retrieved successfully",
  "data": {
    "priceHistory": [
      {
        "id": "string",
        "productId": "string",
        "oldMrp": "number",
        "newMrp": "number",
        "oldSellingPrice": "number",
        "newSellingPrice": "number",
        "reason": "string",
        "changedBy": "string",
        "createdAt": "string",
        "product": {
          "id": "string",
          "name": "string",
          "sku": "string",
          "mrp": "number",
          "sellingPrice": "number"
        }
      }
    ]
  },
  "timestamp": "string"
}
```

### GET /price-history/:id

**Description:** Get price history by ID.

**Request:**
- Method: `GET`
- Endpoint: `/price-history/:id`
- Path Parameter: `id` (price history ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Price history retrieved successfully",
  "data": {
    "priceHistory": {
      "id": "string",
      "productId": "string",
      "oldMrp": "number",
      "newMrp": "number",
      "oldSellingPrice": "number",
      "newSellingPrice": "number",
      "reason": "string",
      "changedBy": "string",
      "createdAt": "string",
      "product": {
        "id": "string",
        "name": "string",
        "sku": "string",
        "mrp": "number",
        "sellingPrice": "number"
      }
    }
  },
  "timestamp": "string"
}
```

## System Setting Management

### POST /system-settings

**Description:** Create a new system setting.

**Request:**
- Method: `POST`
- Endpoint: `/system-settings`
- Content-Type: `application/json`
- Body: `{ key: string, value: object, description: string }`

**Response:**
- Success: `201 Created`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "System setting created successfully",
  "data": {
    "systemSetting": {
      "id": "string",
      "key": "string",
      "value": "object",
      "description": "string",
      "updatedBy": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### PUT /system-settings/:key

**Description:** Update a system setting.

**Request:**
- Method: `PUT`
- Endpoint: `/system-settings/:key`
- Path Parameter: `key` (setting key)
- Content-Type: `application/json`
- Body: `{ value: object, description: string }`

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "System setting updated successfully",
  "data": {
    "systemSetting": {
      "id": "string",
      "key": "string",
      "value": "object",
      "description": "string",
      "updatedBy": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

### DELETE /system-settings/:key

**Description:** Delete a system setting.

**Request:**
- Method: `DELETE`
- Endpoint: `/system-settings/:key`
- Path Parameter: `key` (setting key)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "System setting deleted successfully",
  "data": {
    "systemSetting": {
      "id": "string",
      "key": "string",
      "value": "object",
      "description": "string",
      "updatedBy": "string",
      "updatedAt": "string"
    }
  },
  "timestamp": "string"
}
```

## Audit Log Management

### GET /audit-logs/:id

**Description:** Get audit log by ID.

**Request:**
- Method: `GET`
- Endpoint: `/audit-logs/:id`
- Path Parameter: `id` (audit log ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Audit log retrieved successfully",
  "data": {
    "auditLog": {
      "id": "string",
      "userId": "string",
      "userEmail": "string",
      "action": "string",
      "entityType": "string",
      "entityId": "string",
      "oldValues": "object",
      "newValues": "object",
      "ipAddress": "string",
      "userAgent": "string",
      "createdAt": "string",
      "user": {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string"
      }
    }
  },
  "timestamp": "string"
}
```

### GET /audit-logs/:entityType/:entityId

**Description:** Get audit logs by entity type and entity ID.

**Request:**
- Method: `GET`
- Endpoint: `/audit-logs/:entityType/:entityId`
- Path Parameters: `entityType` (entity type), `entityId` (entity ID)

**Response:**
- Success: `200 OK`
- Error: `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "auditLogs": [
      {
        "id": "string",
        "userId": "string",
        "userEmail": "string",
        "action": "string",
        "entityType": "string",
        "entityId": "string",
        "oldValues": "object",
        "newValues": "object",
        "ipAddress": "string",
        "userAgent": "string",
        "createdAt": "string",
        "user": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "role": "string"
        }
      }
    ]
  },
  "timestamp": "string"
}
```