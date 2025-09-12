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

<!-- #### POST /auth/forgot-password

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
 -->
<!-- --- -->

<!-- ### User Management Endpoints

#### GET /users/me
Get current authenticated user's profile.

**Headers:**Authorization: Bearer <access_token>

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
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
  "timestamp": "2024-01-01T00:00:00.000Z" 
}
```

**Status Codes:**
- `200` - Profile retrieved successfully
- `401` - Unauthorized

--- -->


### Department Management Endpoints

#### GET admin/departments
List all departments.
**Headers:** 
```Authorization: Bearer <access_token>```

**Response:**
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": [
    {
      "id": "department-id",
      "name": "Electronics",
      "description": "All electronic items",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Departments retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/departments
Create a new department.
**Headers:** 
```Authorization: Bearer <access_token>```

**Request Body:**
{
  "name": "New Department",
  "description": "New department description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": "new-department-id",
    "name": "New Department",
    "description": "New department description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Department created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/departments/:id
Get a specific department by ID.
**Headers:** 
```Authorization: Bearer <access_token>```

**Response:**
```json
{
  "success": true,
  "message": "Department retrieved successfully",
  "data": {
    "id": "department-id",
    "name": "Electronics",
    "description": "All electronic items",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Department retrieved successfully
- `401` - Unauthorized
- `404` - Department not found

---

#### PUT /admin/departments/:id
Update a specific department by ID.
**Headers:** 
```Authorization: Bearer <access_token>```

**Request Body:**
{
  "name": "Updated Department",
  "description": "Updated department description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": "department-id",
    "name": "Updated Department",
    "description": "Updated department description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Department updated successfully
- `401` - Unauthorized
- `404` - Department not found
- `400` - Validation error

---

#### DELETE /admin/departments/:id
Delete a specific department by ID.
**Headers:** 
```Authorization: Bearer <access_token>```

**Response:**
```json
{
  "success": true,
  "message": "Department deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Department deleted successfully
- `401` - Unauthorized
- `404` - Department not found

---

### Employee Management Endpoints
#### GET /admin/employees
List all employees.
**Headers:** 
```Authorization: Bearer <access_token>```

**Response:**
```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": {
    "employees": [
      {
        "id": "emp-123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "status": "ACTIVE",
        "department": {
          "id": "dept-1",
          "name": "Engineering"
        },
        "permissions": [
          {
            "id": "empPerm-1",
            "permission": {
              "id": "perm-1",
              "name": "CAN_VIEW_DASHBOARD"
            }
          }
        ]
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}

```

**Status Codes:**
- `200` - Employees retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/employees
Create a new employee.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePass123!",
  "status": "ACTIVE",
  "departmentId": "dept-1"
}
**Validation Rules:**
- `firstName`: 2-50 characters, letters and spaces only
- `lastName`: 2-50 characters, letters and spaces only
- `email`: Valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `status`: One of `ACTIVE`, `INACTIVE`, `SUSPENDED`
- `departmentId`: Required

**Response:**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `201` - Employee created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/employees/:id
Get a specific employee by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee retrieved successfully
- `401` - Unauthorized
- `404` - Employee not found

---

#### PUT /admin/employees/:id
Update a specific employee by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "firstName": "Updated Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "status": "INACTIVE",
  "departmentId": "dept-2"
}
**Validation Rules:**
- `firstName`: 2-50 characters, letters and spaces only
- `lastName`: 2-50 characters, letters and spaces only
- `email`: Valid email format
- `status`: One of `ACTIVE`, `INACTIVE`, `SUSPENDED`
- `departmentId`: Required

**Response:**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Updated Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "INACTIVE",
    "department": {
      "id": "dept-2",
      "name": "Sales"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee updated successfully
- `401` - Unauthorized
- `404` - Employee not found
- `400` - Validation error

---

#### DELETE /admin/employees/:id
Delete a specific employee by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee deleted successfully
- `401` - Unauthorized
- `404` - Employee not found

---

#### PATCH /admin/employees/:id/status
Update an employee's status.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "status": "SUSPENDED"
}
**Validation Rules:**
- `status`: One of `ACTIVE`, `INACTIVE`, `SUSPENDED`

**Response:**
```json
{
  "success": true,
  "message": "Employee status updated successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "SUSPENDED",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee status updated successfully
- `401` - Unauthorized
- `404` - Employee not found
- `400` - Validation error

---

#### PATCH /admin/employees/:id/department
Change an employee's department.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "departmentId": "dept-2"
}
**Validation Rules:**
- `departmentId`: Required

**Response:**
```json
{
  "success": true,
  "message": "Employee department updated successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-2",
      "name": "Sales"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee department updated successfully
- `401` - Unauthorized
- `404` - Employee or department not found
- `400` - Validation error

---

### Permission Management Endpoints
#### GET /admin/permissions
List all permissions.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": [
    {
      "id": "perm-1",
      "name": "CAN_VIEW_DASHBOARD",
      "description": "Permission to view the dashboard",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Permissions retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/permissions
Create a new permission.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "CAN_MANAGE_EMPLOYEES",
  "description": "Permission to manage employees"
}
**Validation Rules:**
- `name`: 2-100 characters, uppercase letters, numbers, and underscores only
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "id": "perm-2",
    "name": "CAN_MANAGE_EMPLOYEES",
    "description": "Permission to manage employees",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Permission created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/permissions/:id
Get a specific permission by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:** 
```json
{
  "success": true,
  "message": "Permission retrieved successfully",
  "data": {
    "id": "perm-1",
    "name": "CAN_VIEW_DASHBOARD",
    "description": "Permission to view the dashboard",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Permission retrieved successfully
- `401` - Unauthorized
- `404` - Permission not found

---

#### PUT /admin/permissions/:id
Update a specific permission by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "CAN_MANAGE_USERS",
  "description": "Permission to manage users"
}
**Validation Rules:**
- `name`: 2-100 characters, uppercase letters, numbers, and underscores only
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "id": "perm-1",
    "name": "CAN_MANAGE_USERS",
    "description": "Permission to manage users",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Permission updated successfully
- `401` - Unauthorized
- `404` - Permission not found
- `400` - Validation error
---

#### DELETE /admin/permissions/:id
Delete a specific permission by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Permission deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
``` 
**Status Codes:**
- `200` - Permission deleted successfully
- `401` - Unauthorized
- `404` - Permission not found

---

### Assign Permissions to Employee
#### POST /admin/employees/:id/permissions
Assign permissions to an employee.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "permissionIds": ["perm-1", "perm-2"]
}
**Validation Rules:**
- `permissionIds`: Array of permission IDs

**Response:**
```json
{
  "success": true,
  "message": "Permissions assigned successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "permissions": [
      {
        "id": "empPerm-1",
        "permission": {
          "id": "perm-1",
          "name": "CAN_VIEW_DASHBOARD"
        }
      },
      {
        "id": "empPerm-2",
        "permission": {
          "id": "perm-2",
          "name": "CAN_MANAGE_USERS"
        }
      }
    ], 
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },  
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Permissions assigned successfully
- `401` - Unauthorized
- `404` - Employee or permission not found
- `400` - Validation error

---

### Unassign Permissions from Employee
#### DELETE /admin/employees/:id/permissions/:permissionId
Unassign a permission from an employee.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Permission unassigned successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "permissions": [
      {
        "id": "empPerm-2",
        "permission": {
          "id": "perm-2",
          "name": "CAN_MANAGE_USERS"
        }
      }
    ], 
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },  
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Permission unassigned successfully
- `401` - Unauthorized
- `404` - Employee or permission not found
---

### See All Permissions of an Employee
#### GET /admin/employees/permissions/:EmployeeId
See all permissions of an employee.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Employee permissions retrieved successfully",
  "data": {
    "id": "emp-123",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "john@example.com",
    "status": "ACTIVE",
    "department": {
      "id": "dept-1",
      "name": "Engineering"
    },
    "permissions": [
      {
        "id": "empPerm-1",
        "permission": {
          "id": "perm-1",
          "name": "CAN_VIEW_DASHBOARD"
        }
      },
      {
        "id": "empPerm-2",
        "permission": {
          "id": "perm-2",
          "name": "CAN_MANAGE_USERS"
        }
      }
    ], 
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },  
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Employee permissions retrieved successfully
- `401` - Unauthorized
- `404` - Employee not found

---

### Brand Management Endpoints
#### GET /admin/brands
List all brands.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": [
    {
      "id": "brand-id",
      "name": "BrandName",
      "description": "Brand description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Brands retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/brands
Create a new brand.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "NewBrand",
  "description": "New brand description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "id": "new-brand-id",
    "name": "NewBrand",
    "description": "New brand description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Brand created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/brands/:id
Get a specific brand by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Brand retrieved successfully",
  "data": {
    "id": "brand-id",
    "name": "BrandName",
    "description": "Brand description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Brand retrieved successfully
- `401` - Unauthorized
- `404` - Brand not found

---

#### PUT /admin/brands/:id
Update a specific brand by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "UpdatedBrand",
  "description": "Updated brand description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "id": "brand-id",
    "name": "UpdatedBrand",
    "description": "Updated brand description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Brand updated successfully
- `401` - Unauthorized
- `404` - Brand not found
- `400` - Validation error

---

#### DELETE /admin/brands/:id
Delete a specific brand by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Brand deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Brand deleted successfully
- `401` - Unauthorized
- `404` - Brand not found

---

### Category Management Endpoints
#### GET /admin/categories
List all categories.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "category-id",
      "name": "CategoryName",
      "description": "Category description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Categories retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/categories
Create a new category.
**Headers:**
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "NewCategory",
  "description": "New category description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "new-category-id",
    "name": "NewCategory",
    "description": "New category description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Category created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/categories/:id
Get a specific category by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": "category-id",
    "name": "CategoryName",
    "description": "Category description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Category retrieved successfully
- `401` - Unauthorized
- `404` - Category not found

---

#### PUT /admin/categories/:id
Update a specific category by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "UpdatedCategory",
  "description": "Updated category description"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": "category-id",
    "name": "UpdatedCategory",
    "description": "Updated category description",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Category updated successfully
- `401` - Unauthorized
- `404` - Category not found
- `400` - Validation error

---

#### DELETE /admin/categories/:id
Delete a specific category by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Category deleted successfully
- `401` - Unauthorized
- `404` - Category not found

---

#### PATCH /admin/categories/:id/feature
Feature or unfeature a category.
**Headers:**
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "isFeatured": true
}
**Validation Rules:**
- `isFeatured`: Boolean value

**Response:**
```json
{
  "success": true,
  "message": "Category feature status updated successfully",
  "data": {
    "id": "category-id",
    "name": "CategoryName",
    "description": "Category description",
    "isFeatured": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Category feature status updated successfully
- `401` - Unauthorized
- `404` - Category not found
- `400` - Validation error

---

#### PATCH /admin/categories/:id/activate
Activate or deactivate a category.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "isActive": true
}
**Validation Rules:**
- `isActive`: Boolean value

**Response:**
```json
{
  "success": true,
  "message": "Category activation status updated successfully",
  "data": {
    "id": "category-id",
    "name": "CategoryName",
    "description": "Category description",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Category activation status updated successfully
- `401` - Unauthorized
- `404` - Category not found
- `400` - Validation error

---

### Product Management Endpoints
#### GET /admin/products
List all products.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "product-id",
      "name": "ProductName",
      "description": "Product description",
      "price": 99.99,
      "brand": {
        "id": "brand-id",
        "name": "BrandName"
      },
      "category": {
        "id": "category-id",
        "name": "CategoryName"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Products retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/products
Create a new product.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "NewProduct",
  "description": "New product description",
  "price": 49.99,
  "brandId": "brand-id",
  "categoryId": "category-id"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters
- `price`: Required
- `brandId`: Required
- `categoryId`: Required

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "new-product-id",
    "name": "NewProduct",
    "description": "New product description",
    "price": 49.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Product created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### GET /admin/products/:id
Get a specific product by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product retrieved successfully
- `401` - Unauthorized
- `404` - Product not found

---

#### PUT /admin/products/:id
Update a specific product by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "UpdatedProduct",
  "description": "Updated product description",
  "price": 79.99,
  "brandId": "brand-id",
  "categoryId": "category-id"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `description`: 0-500 characters
- `price`: Required
- `brandId`: Required
- `categoryId`: Required

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "product-id",
    "name": "UpdatedProduct",
    "description": "Updated product description",
    "price": 79.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product updated successfully
- `401` - Unauthorized
- `404` - Product not found
- `400` - Validation error

---

#### DELETE /admin/products/:id
Delete a specific product by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product deleted successfully
- `401` - Unauthorized
- `404` - Product not found

---

#### PATCH /admin/products/:id/restore
Restore a soft-deleted product by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Product restored successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product restored successfully
- `401` - Unauthorized
- `404` - Product not found

---

### Variant Management Endpoints
#### GET /admin/:id/variants
List all variants.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Variants retrieved successfully",
  "data": [
    {
      "id": "variant-id",
      "name": "VariantName",
      "additionalPrice": 10.00,
      "product": {
        "id": "product-id",
        "name": "ProductName"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Variants retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/variants
Create a new variant.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "NewVariant",
  "additionalPrice": 15.00,
  "productId": "product-id"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `additionalPrice`: Required, non-negative
- `productId`: Required
**Response:**
```json
{
  "success": true,
  "message": "Variant created successfully",
  "data": {
    "id": "new-variant-id",
    "name": "NewVariant",
    "additionalPrice": 15.00,
    "product": {
      "id": "product-id",
      "name": "ProductName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Variant created successfully
- `401` - Unauthorized
- `400` - Validation error

---

#### PUT /admin/variants/:id
Update a specific variant by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "UpdatedVariant",
  "additionalPrice": 20.00,
  "productId": "product-id"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `additionalPrice`: Required, non-negative
- `productId`: Required
**Response:**
```json
{
  "success": true,
  "message": "Variant updated successfully",
  "data": {
    "id": "variant-id",
    "name": "UpdatedVariant",
    "additionalPrice": 20.00,
    "product": {
      "id": "product-id",
      "name": "ProductName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Variant updated successfully
- `401` - Unauthorized
- `404` - Variant not found
- `400` - Validation error

---

#### DELETE /admin/variants/:id
Delete a specific variant by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Variant deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Variant deleted successfully
- `401` - Unauthorized
- `404` - Variant not found

---

### PATCH /admin/variants/:id/toggle
Toggle the active status of a variant.
**Headers:**
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "isActive": true
}
**Validation Rules:**
- `isActive`: Boolean value
**Response:**
```json
{
  "success": true,
  "message": "Variant active status updated successfully",
  "data": {
    "id": "variant-id",
    "name": "VariantName",
    "additionalPrice": 10.00,
    "isActive": true,
    "product": {
      "id": "product-id",
      "name": "ProductName"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Variant active status updated successfully
- `401` - Unauthorized
- `404` - Variant not found
- `400` - Validation error

---

### Attribute Management Endpoints
#### GET /admin/attributes
List all attributes.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Attributes retrieved successfully",
  "data": [
    {
      "id": "attribute-id",
      "name": "AttributeName",
      "value": "AttributeValue",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attributes retrieved successfully
- `401` - Unauthorized

---

#### POST /admin/attributes
Create a new attribute.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "NewAttribute",
  "value": "AttributeValue"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `value`: 2-100 characters, required
**Response:**
```json
{
  "success": true,
  "message": "Attribute created successfully",
  "data": {
    "id": "new-attribute-id",
    "name": "NewAttribute",
    "value": "AttributeValue",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Attribute created successfully
- `401` - Unauthorized
- `400` - Validation error
---

#### PUT /admin/attributes/:id
Update a specific attribute by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "UpdatedAttribute",
  "value": "UpdatedValue"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `value`: 2-100 characters, required
**Response:**
```json
{
  "success": true,
  "message": "Attribute updated successfully",
  "data": {
    "id": "attribute-id",
    "name": "UpdatedAttribute",
    "value": "UpdatedValue",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attribute updated successfully
- `401` - Unauthorized
- `404` - Attribute not found
- `400` - Validation error

---

#### DELETE /admin/attributes/:id
Delete a specific attribute by ID.  
**Headers:**
```Authorization: Bearer <access_token>```
**Response:** 
```json
{
  "success": true,
  "message": "Attribute deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
``` 
**Status Codes:**
- `200` - Attribute deleted successfully
- `401` - Unauthorized
- `404` - Attribute not found

---

#### POST /admin/:id/attributes
Assign attributes to a product.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "attributeIds": ["attr-1", "attr-2"]
}
**Validation Rules:**
- `attributeIds`: Array of attribute IDs
**Response:**
```json
{
  "success": true,
  "message": "Attributes assigned successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "attributes": [
      {
        "id": "prodAttr-1",
        "attribute": {
          "id": "attr-1",
          "name": "AttributeName1",
          "value": "AttributeValue1"
        }
      },
      {
        "id": "prodAttr-2",
        "attribute": {
          "id": "attr-2",
          "name": "AttributeName2",
          "value": "AttributeValue2"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attributes assigned successfully
- `401` - Unauthorized
- `404` - Product or attribute not found
- `400` - Validation error

---

#### DELETE /admin/attributes/:attrId
Unassign an attribute from a product.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Attribute unassigned successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "attributes": [
      {
        "id": "prodAttr-2",
        "attribute": {
          "id": "attr-2",
          "name": "AttributeName2",
          "value": "AttributeValue2"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attribute unassigned successfully
- `401` - Unauthorized
- `404` - Product or attribute not found

---

#### POST /admin/categories/:id/attributes
Assign attributes to a category.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "attributeIds": ["attr-1", "attr-2"]
}
**Validation Rules:**
- `attributeIds`: Array of attribute IDs
**Response:**
```json 
{
  "success": true,
  "message": "Attributes assigned to category successfully",
  "data": {
    "id": "category-id",
    "name": "CategoryName",
    "description": "Category description",
    "attributes": [
      {
        "id": "catAttr-1",
        "attribute": {
          "id": "attr-1",
          "name": "AttributeName1",
          "value": "AttributeValue1"
        }
      },
      {
        "id": "catAttr-2",
        "attribute": {
          "id": "attr-2",
          "name": "AttributeName2",
          "value": "AttributeValue2"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attributes assigned to category successfully
- `401` - Unauthorized
- `404` - Category or attribute not found

---

#### DELETE /admin/categories/:catId/attributes/:attrId
Unassign an attribute from a category.
**Headers:**
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Attribute unassigned from category successfully",
  "data": {
    "id": "category-id",
    "name": "CategoryName",
    "description": "Category description",
    "attributes": [
      {
        "id": "catAttr-2",
        "attribute": {
          "id": "attr-2",
          "name": "AttributeName2",
          "value": "AttributeValue2"
        }
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Attribute unassigned from category successfully
- `401` - Unauthorized
- `404` - Category or attribute not found

---

### Relation Management Endpoints
#### POST /admin/:id/relations
Create a relation between products.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "relatedProductIds": ["prod-1", "prod-2"]
}
**Validation Rules:**
- `relatedProductIds`: Array of product IDs
**Response:**
```json
{
  "success": true,
  "message": "Product relations created successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "relatedProducts": [
      {
        "id": "prod-1",
        "name": "RelatedProduct1"
      },
      {
        "id": "prod-2",
        "name": "RelatedProduct2"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product relations created successfully
- `401` - Unauthorized
- `404` - Product not found
- `400` - Validation error

---

#### GET /admin/:id/relations
Get related products for a specific product.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Related products retrieved successfully",
  "data": {
    "id": "product-id",
    "name": "ProductName",
    "description": "Product description",
    "price": 99.99,
    "brand": {
      "id": "brand-id",
      "name": "BrandName"
    },
    "category": {
      "id": "category-id",
      "name": "CategoryName"
    },
    "relatedProducts": [
      {
        "id": "prod-1",
        "name": "RelatedProduct1"
      },
      {
        "id": "prod-2",
        "name": "RelatedProduct2"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Related products retrieved successfully
- `401` - Unauthorized
- `404` - Product not found

---

#### DELETE /admin/relations/:id
Delete a relation between products.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Product relation deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Product relation deleted successfully
- `401` - Unauthorized
- `404` - Relation not found

---

### Card Management Endpoints
#### GET /admin/cards
List all cards.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Cards retrieved successfully",
  "data": [
    {
  "name": "Gold Membership",
  "validityDays": 365,
  "benefitDays": ["Monday", "Wednesday"],
  "benefitPercent": 15,
  "price": 499.99,
  "image": "https://example.com/card.png",
  "visibility": "PUBLIC",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Cards retrieved successfully
- `401` - Unauthorized
---

#### GET /admin/cards/:id
Get a specific card by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Card retrieved successfully",
  "data": {
    "id": "card-id",
    "name": "Gold Membership",
    "validityDays": 365,
    "benefitDays": ["Monday", "Wednesday"],
    "benefitPercent": 15,
    "price": 499.99,
    "image": "https://example.com/card.png",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Card retrieved successfully
- `401` - Unauthorized
- `404` - Card not found

---

#### POST /admin/cards
Create a new card.
**Headers:** 
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "Gold Membership",
  "validityDays": 365,
  "benefitDays": ["Monday", "Wednesday"],
  "benefitPercent": 15,
  "price": 499.99,
  "image": "https://example.com/card.png",
  "visibility": "PUBLIC"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `validityDays`: Required, non-negative
- `benefitDays`: Array of valid days
- `benefitPercent`: 0-100, required
- `price`: Required, non-negative
- `image`: Valid URL
- `visibility`: Enum: PUBLIC, PRIVATE, required
**Response:**
```json
{
  "success": true,
  "message": "Card created successfully",
  "data": {
    "id": "new-card-id",
    "name": "Gold Membership",
    "validityDays": 365,
    "benefitDays": ["Monday", "Wednesday"],
    "benefitPercent": 15,
    "price": 499.99,
    "image": "https://example.com/card.png",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
**Status Codes:**
- `201` - Card created successfully
- `401` - Unauthorized
- `400` - Validation error  

---

#### PUT /admin/cards/:id
Update a specific card by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Request Body:**
{
  "name": "Platinum Membership",
  "validityDays": 730,
  "benefitDays": ["Monday", "Wednesday", "Friday"],
  "benefitPercent": 20,
  "price": 899.99,
  "image": "https://example.com/platinum-card.png",
  "visibility": "PRIVATE",
  "status": "INACTIVE"
}
**Validation Rules:**
- `name`: 2-100 characters, required
- `validityDays`: Required, non-negative
- `benefitDays`: Array of valid days
- `benefitPercent`: 0-100, required
- `price`: Required, non-negative
- `image`: Valid URL
- `visibility`: Enum: PUBLIC, PRIVATE, required
- `status`: Enum: ACTIVE, INACTIVE, required
**Response:**
```json
{
  "success": true,
  "message": "Card updated successfully",
  "data": {
    "id": "card-id",
    "name": "Platinum Membership",
    "validityDays": 730,
    "benefitDays": ["Monday", "Wednesday", "Friday"],
    "benefitPercent": 20,
    "price": 899.99,
    "image": "https://example.com/platinum-card.png",
    "visibility": "PRIVATE",
    "status": "INACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Card updated successfully
- `401` - Unauthorized
- `404` - Card not found
- `400` - Validation error

---

#### DELETE /admin/cards/:id
Delete a specific card by ID.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Card deleted successfully",
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Card deleted successfully
- `401` - Unauthorized
- `404` - Card not found
---

#### PATCH /admin/cards/:id/restore
Restore a soft-deleted card by ID.
**Headers:**
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Card restored successfully",
  "data": {
    "id": "card-id",
    "name": "Gold Membership",
    "validityDays": 365,
    "benefitDays": ["Monday", "Wednesday"],
    "benefitPercent": 15,
    "price": 499.99,
    "image": "https://example.com/card.png",
    "visibility": "PUBLIC",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "timestamp": "2024-01-02T00:00:00.000Z"
}
```
**Status Codes:**
- `200` - Card restored successfully
- `401` - Unauthorized
- `404` - Card not found
---

<!-- ### Customer Management Endpoints
#### GET /admin/customers
List all customers.
**Headers:** 
```Authorization: Bearer <access_token>```
**Response:**
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": [
    {
      "id": "customer-id",
      "firstName": "Jane",
      "lastName": "Doe",
      "email":  -->







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