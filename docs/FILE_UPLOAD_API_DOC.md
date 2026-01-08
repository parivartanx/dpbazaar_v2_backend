# File Upload API Documentation

This document provides comprehensive API documentation for the file upload functionality in the DPBazaar application.

## Base Path

- All endpoints below are mounted under the API prefix `/v1`.
- File upload routes are mounted at `/file-upload`. The full base path for this document is `/v1/file-upload`.
- Base URL: `http://localhost:4000` (or your server URL)

## Authentication

Most file upload endpoints are public, but some require authentication:

- **Public endpoints:** No authentication required
- **Admin endpoints:** Require admin authentication with appropriate permissions

## Endpoints

### 1. POST /v1/file-upload/presigned-url

**Description:** Generate a pre-signed URL for direct upload to R2 storage (Cloudflare R2).

**Request:**
- Method: `POST`
- Endpoint: `/v1/file-upload/presigned-url`
- Content-Type: `application/json`
- Body Parameters:
  - `fileName` (required): Name of the file to be uploaded (e.g., "test-image.jpg")
  - `fileType` (required): MIME type of the file (e.g., "image/jpeg", "application/pdf", "image/png")
  - `folderPath` (optional): Folder path in R2 storage (e.g., "uploads", "products", "users", "banners")

**cURL Command:**
```bash
curl -X POST http://localhost:4000/v1/file-upload/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-image.jpg",
    "fileType": "image/jpeg",
    "folderPath": "uploads"
  }'
```

**Request Example:**
```json
{
  "fileName": "test-image.jpg",
  "fileType": "image/jpeg",
  "folderPath": "uploads"
}
```

**Minimal Request (without folderPath):**
```json
{
  "fileName": "document.pdf",
  "fileType": "application/pdf"
}
```

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `500 Internal Server Error`

**Success Response Example:**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://dp-bazaar.213f4a66f1bc242a106c8e01f2973dc5.r2.cloudflarestorage.com/uploads/1767853341050-fudnb22.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=18221e71168d94f8c51c350d51f37c4a%2F20260108%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260108T062221Z&X-Amz-Expires=3600&X-Amz-Signature=a6e81f7b852636500c6cb9d7f207164de74e677096b7e1d1b08590829495e87d&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject",
    "key": "uploads/1767853341050-fudnb22.jpg",
    "fileName": "test-image.jpg",
    "fileType": "image/jpeg"
  },
  "message": "Pre-signed URL generated successfully",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Error Response Example (Missing Required Fields):**
```json
{
  "success": false,
  "error": "File name and type are required",
  "message": "File name and type are required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Error Response Example (Validation Error):**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "File name is required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Response Fields:**
- `presignedUrl`: The pre-signed URL to upload the file directly to R2 storage (expires in 3600 seconds / 1 hour)
- `key`: The file key/path in R2 storage (store this in your database)
- `fileName`: The original file name
- `fileType`: The MIME type of the file

### 2. GET /v1/file-upload/signed-url/:key

**Description:** Get a signed URL for downloading/viewing a file from R2 storage.

**Request:**
- Method: `GET`
- Endpoint: `/v1/file-upload/signed-url/:key`
- Path Parameter: `key` (R2 file key, e.g., "uploads/1767853341050-fudnb22.jpg")

**cURL Command:**
```bash
curl -X GET http://localhost:4000/v1/file-upload/signed-url/uploads/1767853341050-fudnb22.jpg
```

**Request Example:**
```
GET /v1/file-upload/signed-url/uploads/1767853341050-fudnb22.jpg
```

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `500 Internal Server Error`

**Success Response Example:**
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://dp-bazaar.213f4a66f1bc242a106c8e01f2973dc5.r2.cloudflarestorage.com/uploads/1767853341050-fudnb22.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=20260108T062221Z&X-Amz-Expires=3600&X-Amz-Signature=...",
    "key": "uploads/1767853341050-fudnb22.jpg"
  },
  "message": "Signed URL generated successfully",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "error": "File key is required",
  "message": "File key is required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

### 3. DELETE /v1/file-upload/:key

**Description:** Delete a file from R2 storage (admin only).

**Request:**
- Method: `DELETE`
- Endpoint: `/v1/file-upload/:key`
- Path Parameter: `key` (R2 file key)
- Headers: `Authorization: Bearer <admin-token>`
- Requires admin permissions with 'USERS' 'DELETE' permission

**cURL Command:**
```bash
curl -X DELETE http://localhost:4000/v1/file-upload/uploads/1767853341050-fudnb22.jpg \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Request Example:**
```
DELETE /v1/file-upload/uploads/1767853341050-fudnb22.jpg
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
- Success: `200 OK`
- Error: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`

**Success Response Example:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Error Response Example (Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Error Response Example (Forbidden):**
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

## Workflow

The file upload functionality follows a pre-signed URL workflow:

1. **Request Pre-signed URL:** Client requests a pre-signed URL by calling the `/presigned-url` endpoint with file details
2. **Direct Upload:** Client uploads the file directly to the returned pre-signed URL using PUT request
3. **Store Key:** Client stores the returned file key in the database as needed
4. **Retrieve Signed URL:** Use the file key to generate signed URLs for viewing/downloading using the `/signed-url/:key` endpoint
5. **Delete File:** Admin users can delete files from storage using the `/file-upload/:key` DELETE endpoint

## Complete Usage Examples

### Example 1: Upload an Image File

**Step 1: Generate Pre-signed URL**

```bash
curl -X POST http://localhost:4000/v1/file-upload/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "product-image.jpg",
    "fileType": "image/jpeg",
    "folderPath": "products"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "presignedUrl": "https://dp-bazaar.213f4a66f1bc242a106c8e01f2973dc5.r2.cloudflarestorage.com/products/1767853341050-abc123.jpg?X-Amz-Algorithm=...",
    "key": "products/1767853341050-abc123.jpg",
    "fileName": "product-image.jpg",
    "fileType": "image/jpeg"
  },
  "message": "Pre-signed URL generated successfully",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**Step 2: Upload File to Pre-signed URL**

Once you have the presigned URL, you need to upload the file directly to that URL using a PUT request. The file should be sent as binary data with the correct Content-Type header.

**Using cURL:**
```bash
curl -X PUT "https://dp-bazaar.213f4a66f1bc242a106c8e01f2973dc5.r2.cloudflarestorage.com/products/1767853341050-abc123.jpg?X-Amz-Algorithm=..." \
  -H "Content-Type: image/jpeg" \
  --data-binary @/path/to/your/image.jpg
```

**Important Notes:**
- Use **PUT** method (not POST)
- Set the **Content-Type** header to match the file type (e.g., `image/jpeg`, `application/pdf`)
- Send the file as binary data
- Do NOT include any additional headers beyond Content-Type
- The presigned URL already contains all authentication parameters

**Step 3: Get Signed URL for Display**

```bash
curl -X GET http://localhost:4000/v1/file-upload/signed-url/products/1767853341050-abc123.jpg
```

### Example 2: Upload a PDF Document

**Generate Pre-signed URL:**
```bash
curl -X POST http://localhost:4000/v1/file-upload/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "invoice.pdf",
    "fileType": "application/pdf",
    "folderPath": "documents"
  }'
```

### Example 3: Complete Frontend Upload Flow (JavaScript/TypeScript)

**Complete Example with Error Handling:**

```javascript
// Step 1: Generate presigned URL
const generatePresignedUrl = async (fileName, fileType, folderPath = '') => {
  const response = await fetch('http://localhost:4000/v1/file-upload/presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      fileType,
      folderPath
    })
  });

  const result = await response.json();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message || 'Failed to generate presigned URL');
  }
};

// Step 2: Upload file to presigned URL
const uploadFileToPresignedUrl = async (presignedUrl, file) => {
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed with status: ${uploadResponse.status}`);
  }

  return uploadResponse;
};

// Complete upload function
const uploadFile = async (file, folderPath = 'uploads') => {
  try {
    // Step 1: Get presigned URL
    console.log('Step 1: Requesting presigned URL...');
    const { presignedUrl, key, fileName } = await generatePresignedUrl(
      file.name,
      file.type,
      folderPath
    );
    
    console.log('Presigned URL received:', presignedUrl);
    console.log('File key:', key);

    // Step 2: Upload file to R2
    console.log('Step 2: Uploading file to R2...');
    await uploadFileToPresignedUrl(presignedUrl, file);
    
    console.log('File uploaded successfully!');
    
    // Step 3: Return the key to store in your database
    return {
      key,
      fileName,
      success: true
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Usage with HTML file input
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }

  try {
    const result = await uploadFile(file, 'uploads');
    console.log('Upload complete! Store this key in your database:', result.key);
    
    // Store the key in your database
    // await saveFileKeyToDatabase(result.key);
  } catch (error) {
    alert('Upload failed: ' + error.message);
  }
};

// HTML example
// <input type="file" id="fileInput" onchange="handleFileUpload(event)" />
```

**Using Axios:**

```javascript
import axios from 'axios';

// Step 1: Generate presigned URL
const generatePresignedUrl = async (fileName, fileType, folderPath = '') => {
  const response = await axios.post('http://localhost:4000/v1/file-upload/presigned-url', {
    fileName,
    fileType,
    folderPath
  });

  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Failed to generate presigned URL');
  }
};

// Step 2: Upload file to presigned URL
const uploadFileToPresignedUrl = async (presignedUrl, file) => {
  const response = await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  });

  return response;
};

// Complete upload function
const uploadFile = async (file, folderPath = 'uploads') => {
  try {
    // Get presigned URL
    const { presignedUrl, key } = await generatePresignedUrl(
      file.name,
      file.type,
      folderPath
    );

    // Upload to R2
    await uploadFileToPresignedUrl(presignedUrl, file);

    return { key, success: true };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

**With Upload Progress Tracking:**

```javascript
const uploadFileWithProgress = async (file, folderPath = 'uploads', onProgress) => {
  try {
    // Step 1: Get presigned URL
    const { presignedUrl, key } = await generatePresignedUrl(
      file.name,
      file.type,
      folderPath
    );

    // Step 2: Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          if (onProgress) {
            onProgress(percentComplete);
          }
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve({ key, success: true });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Open and send
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (error) {
    throw error;
  }
};

// Usage with progress callback
const handleFileUploadWithProgress = async (event) => {
  const file = event.target.files[0];
  
  try {
    await uploadFileWithProgress(file, 'uploads', (progress) => {
      console.log(`Upload progress: ${progress.toFixed(2)}%`);
      // Update progress bar in UI
      // document.getElementById('progressBar').style.width = progress + '%';
    });
    
    console.log('Upload complete!');
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

**Get Signed URL:**
```javascript
const getSignedUrl = async (fileKey) => {
  const response = await fetch(`http://localhost:4000/v1/file-upload/signed-url/${encodeURIComponent(fileKey)}`);
  const result = await response.json();
  
  if (result.success) {
    return result.data.signedUrl;
  } else {
    throw new Error(result.message || 'Failed to generate signed URL');
  }
};

// Usage
const signedUrl = await getSignedUrl('uploads/1767853341050-abc123.jpg');
// Use signedUrl to display or download the file
```

**Delete File (Admin):**
```javascript
const deleteFile = async (fileKey, adminToken) => {
  const response = await fetch(`http://localhost:4000/v1/file-upload/${encodeURIComponent(fileKey)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('File deleted successfully');
  } else {
    throw new Error(result.message || 'Failed to delete file');
  }
};
```

### Example 4: React Hook Example with Upload Progress

```typescript
import { useState } from 'react';

interface UploadResult {
  key: string;
  fileName: string;
}

interface UseFileUploadReturn {
  uploadFile: (file: File, folderPath?: string) => Promise<UploadResult>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

const useFileUpload = (): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folderPath: string = 'uploads'): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Step 1: Get presigned URL
      setProgress(10);
      const presignedResponse = await fetch('http://localhost:4000/v1/file-upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folderPath
        })
      });

      const presignedData = await presignedResponse.json();

      if (!presignedData.success) {
        throw new Error(presignedData.message);
      }

      setProgress(30);

      // Step 2: Upload file to presigned URL
      const uploadResponse = await fetch(presignedData.data.presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      setProgress(100);

      return {
        key: presignedData.data.key,
        fileName: presignedData.data.fileName
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress, error };
};

// Usage in React Component
const FileUploadComponent = () => {
  const { uploadFile, uploading, progress, error } = useFileUpload();
  const [fileKey, setFileKey] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, 'uploads');
      setFileKey(result.key);
      console.log('File uploaded! Key:', result.key);
      // Store the key in your database
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={uploading}
      />
      {uploading && (
        <div>
          <progress value={progress} max={100} />
          <span>Uploading... {progress}%</span>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {fileKey && <div>File uploaded! Key: {fileKey}</div>}
    </div>
  );
};
```

**React Hook with XMLHttpRequest for Better Progress Tracking:**

```typescript
import { useState } from 'react';

const useFileUploadWithProgress = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folderPath: string = 'uploads') => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Step 1: Get presigned URL
      const presignedResponse = await fetch('http://localhost:4000/v1/file-upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folderPath
        })
      });

      const presignedData = await presignedResponse.json();

      if (!presignedData.success) {
        throw new Error(presignedData.message);
      }

      // Step 2: Upload using XMLHttpRequest for progress tracking
      return new Promise<{ key: string; fileName: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setProgress(percentComplete);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            setProgress(100);
            resolve({
              key: presignedData.data.key,
              fileName: presignedData.data.fileName
            });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        // Open and send
        xhr.open('PUT', presignedData.data.presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress, error };
};
```

## Frontend Upload Guide

### How to Upload Files After Getting Presigned URL

After receiving the presigned URL from the API, you need to upload the file directly to that URL. Here's a step-by-step guide:

#### Step-by-Step Process

1. **Get Presigned URL** - Call `/v1/file-upload/presigned-url` with file details
2. **Upload File** - Use PUT request to upload file to the presigned URL
3. **Store Key** - Save the returned key in your database
4. **Get Signed URL** - Use the key to generate signed URLs for display

#### Important Upload Requirements

- **Method:** Use `PUT` (not POST)
- **Headers:** Only include `Content-Type` header matching the file's MIME type
- **Body:** Send the file as binary data (File object, Blob, or ArrayBuffer)
- **No Authentication:** The presigned URL contains all auth parameters
- **CORS:** Ensure your R2 bucket allows CORS from your frontend domain

#### Common Frontend Upload Patterns

**Pattern 1: Basic Fetch API**
```javascript
// After getting presignedUrl from API
const uploadResponse = await fetch(presignedUrl, {
  method: 'PUT',
  body: file,  // File object from input
  headers: {
    'Content-Type': file.type
  }
});

if (uploadResponse.ok) {
  console.log('Upload successful!');
}
```

**Pattern 2: With File Validation**
```javascript
const uploadFile = async (file, folderPath = 'uploads') => {
  // Validate file
  if (!file) {
    throw new Error('No file selected');
  }

  // Validate file size (e.g., max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }

  // Get presigned URL
  const { presignedUrl, key } = await generatePresignedUrl(
    file.name,
    file.type,
    folderPath
  );

  // Upload to R2
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }

  return key;
};
```

**Pattern 3: Multiple File Upload**
```javascript
const uploadMultipleFiles = async (files, folderPath = 'uploads') => {
  const uploadPromises = files.map(async (file) => {
    try {
      // Get presigned URL for each file
      const { presignedUrl, key } = await generatePresignedUrl(
        file.name,
        file.type,
        folderPath
      );

      // Upload each file
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      return { key, fileName: file.name, success: true };
    } catch (error) {
      return { fileName: file.name, success: false, error: error.message };
    }
  });

  const results = await Promise.all(uploadPromises);
  return results;
};

// Usage
const files = Array.from(fileInput.files);
const results = await uploadMultipleFiles(files, 'products');
console.log('Upload results:', results);
```

**Pattern 4: Drag and Drop Upload**
```javascript
const handleDrop = async (event) => {
  event.preventDefault();
  
  const files = Array.from(event.dataTransfer.files);
  
  for (const file of files) {
    try {
      // Get presigned URL
      const { presignedUrl, key } = await generatePresignedUrl(
        file.name,
        file.type,
        'uploads'
      );

      // Upload file
      await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      console.log(`File ${file.name} uploaded! Key: ${key}`);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }
};

// HTML
// <div 
//   onDrop={handleDrop} 
//   onDragOver={(e) => e.preventDefault()}
//   onDragEnter={(e) => e.preventDefault()}
// >
//   Drop files here
// </div>
```

### Frontend Upload Best Practices

1. **Validate Files Before Upload**
   - Check file size limits
   - Validate file types
   - Verify file name format

2. **Handle Errors Gracefully**
   - Show user-friendly error messages
   - Retry failed uploads
   - Log errors for debugging

3. **Show Upload Progress**
   - Use XMLHttpRequest for accurate progress
   - Display progress bars
   - Show upload status

4. **Optimize Large Files**
   - Consider chunked uploads for very large files
   - Compress images before upload
   - Show file size to users

5. **Security Considerations**
   - Never expose R2 credentials in frontend
   - Validate file types on both frontend and backend
   - Sanitize file names
   - Set appropriate CORS policies

### Troubleshooting Common Issues

**Issue 1: CORS Error**
```
Access to fetch at 'https://...r2.cloudflarestorage.com/...' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:** Configure CORS on your R2 bucket to allow your frontend domain.

**Issue 2: 403 Forbidden**
```
403 Forbidden
```
**Solution:** Check that:
- Presigned URL hasn't expired (valid for 1 hour)
- Content-Type header matches the file type
- Using PUT method (not POST)

**Issue 3: Upload Hangs**
**Solution:** 
- Check network connection
- Verify file size isn't too large
- Ensure presigned URL is valid

**Issue 4: Wrong Content-Type**
**Solution:** Always set Content-Type header to match the file's MIME type:
```javascript
headers: {
  'Content-Type': file.type  // e.g., 'image/jpeg', 'application/pdf'
}
```

## Error Handling

### HTTP Status Codes

- **200 OK:** Request successful
- **400 Bad Request:** Returned when required parameters are missing or invalid
- **401 Unauthorized:** Returned when authentication is required but missing
- **403 Forbidden:** Returned when user doesn't have required permissions
- **500 Internal Server Error:** Returned when an unexpected error occurs on the server

### Common Error Scenarios

**1. Missing Required Fields:**
```json
{
  "success": false,
  "error": "File name and type are required",
  "message": "File name and type are required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**2. Validation Error:**
```json
{
  "success": false,
  "error": "Validation error",
  "message": "File name is required",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

**3. Server Error:**
```json
{
  "success": false,
  "error": "Internal server error message",
  "message": "Failed to generate pre-signed upload URL",
  "timestamp": "2026-01-08T06:22:21.061Z"
}
```

## Notes

- Pre-signed URLs expire after **3600 seconds (1 hour)**
- File keys are automatically generated with timestamps and random strings to prevent collisions
- The `folderPath` parameter is optional - if not provided, files will be stored in the root of the bucket
- Supported file types include: images (jpeg, png, gif, webp), documents (pdf, doc, docx), and other common MIME types
- Always store the `key` returned from the presigned URL response in your database for later retrieval