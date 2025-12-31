# File Upload API Documentation

This document provides comprehensive API documentation for the file upload functionality in the DPBazaar application.

## Base Path

- All endpoints below are mounted under the API prefix `/v1`.
- File upload routes are mounted at `/file-upload`. The full base path for this document is `/v1/file-upload`.

## Authentication

Most file upload endpoints are public, but some require authentication:

- **Public endpoints:** No authentication required
- **Admin endpoints:** Require admin authentication with appropriate permissions

## Endpoints

### POST /file-upload/presigned-url

**Description:** Generate a pre-signed URL for direct upload to R2 storage.

**Request:**
- Method: `POST`
- Endpoint: `/file-upload/presigned-url`
- Content-Type: `application/json`
- Body: `{ fileName: string, fileType: string, folderPath: string (optional) }`
  - `fileName`: Name of the file to be uploaded
  - `fileType`: MIME type of the file (e.g., 'image/jpeg', 'application/pdf')
  - `folderPath`: Optional folder path in R2 (e.g., 'products', 'users', 'banners')

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Pre-signed URL generated successfully",
  "data": {
    "presignedUrl": "string",
    "key": "string",
    "fileName": "string",
    "fileType": "string"
  },
  "timestamp": "string"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string",
  "message": "Failed to generate pre-signed upload URL",
  "timestamp": "string"
}
```

### GET /file-upload/public-url/:key

**Description:** Get public URL for a file key in R2 storage.

**Request:**
- Method: `GET`
- Endpoint: `/file-upload/public-url/:key`
- Path Parameter: `key` (R2 file key)

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "Public URL generated successfully",
  "data": {
    "publicUrl": "string",
    "key": "string"
  },
  "timestamp": "string"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string",
  "message": "Failed to generate public URL",
  "timestamp": "string"
}
```

### DELETE /file-upload/:key

**Description:** Delete a file from R2 storage (admin only).

**Request:**
- Method: `DELETE`
- Endpoint: `/file-upload/:key`
- Path Parameter: `key` (R2 file key)
- Requires admin permissions with 'USERS' 'DELETE' permission

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `500 Internal Server Error`

**Success Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "timestamp": "string"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "string",
  "message": "Failed to delete file",
  "timestamp": "string"
}
```

## Workflow

The file upload functionality follows a pre-signed URL workflow:

1. **Request Pre-signed URL:** Client requests a pre-signed URL by calling the `/presigned-url` endpoint with file details
2. **Direct Upload:** Client uploads the file directly to the returned pre-signed URL
3. **Store Key:** Client stores the returned file key in the database as needed
4. **Retrieve Public URL:** Use the file key to generate public URLs for display using the `/public-url/:key` endpoint
5. **Delete File:** Admin users can delete files from storage using the `/file-upload/:key` DELETE endpoint

## Usage Examples

### Generate Pre-signed URL

```javascript
const response = await fetch('/v1/file-upload/presigned-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fileName: 'example.jpg',
    fileType: 'image/jpeg',
    folderPath: 'products'
  })
});

const { data } = await response.json();
// data.presignedUrl contains the URL to upload to
// data.key contains the file key to store
```

### Get Public URL

```javascript
const response = await fetch(`/v1/file-upload/public-url/${fileKey}`);
const { data } = await response.json();
// data.publicUrl contains the public URL for the file
```

### Delete File (Admin Only)

```javascript
const response = await fetch(`/v1/file-upload/${fileKey}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <admin-token>'
  }
});
```

## Error Handling

- **400 Bad Request:** Returned when required parameters are missing or invalid
- **401 Unauthorized:** Returned when authentication is required but missing
- **403 Forbidden:** Returned when user doesn't have required permissions
- **500 Internal Server Error:** Returned when an unexpected error occurs on the server