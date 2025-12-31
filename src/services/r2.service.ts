import { r2Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, getSignedUrl } from '../config/r2Client';
import { logger } from '../utils/logger';

export interface FileUploadResult {
  key: string;
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export interface FileMetadata {
  key: string;
  fileName: string;
  size: number;
  type: string;
  uploadDate: Date;
}

export interface FileUploadResult {
  url: string;
  key: string;
  fileName: string;
  size: number;
  type: string;
}

export interface MultipleFileUploadResult {
  files: FileUploadResult[];
  urls: string[];
  keys: string[];
}

export interface BannerFileUploadResult {
  imageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  fileKeys: string[]; // Store the R2 keys for potential cleanup
}

export class R2Service {
  private bucketName: string = process.env.R2_BUCKET || '';
  private publicBaseUrl: string = process.env.R2_PUBLIC_BASE_URL || '';

  /**
   * Upload a file to R2
   * @param fileBuffer - File buffer to upload
   * @param fileName - Original file name
   * @param fileType - File MIME type
   * @param folderPath - Optional folder path in R2 (e.g. 'products', 'users', 'banners')
   * @returns File upload result with key, URL, and metadata
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
    folderPath?: string
  ): Promise<FileUploadResult> {
    try {
      // Generate a unique key for the file
      const fileExtension = fileName.split('.').pop() || '';
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
      const key = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;

      // Upload file to R2
      await r2Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: fileType,
        })
      );

      // Generate public URL
      const url = `${this.publicBaseUrl}/${key}`;

      return {
        key,
        url,
        fileName: uniqueFileName,
        size: fileBuffer.length,
        type: fileType,
      };
    } catch (error) {
      logger.error(`Error uploading file to R2: ${error}`);
      throw new Error(`Failed to upload file to R2: ${(error as Error).message}`);
    }
  }

  /**
   * Generate a pre-signed URL for file upload
   * @param fileName - File name
   * @param fileType - File MIME type
   * @param folderPath - Optional folder path in R2
   * @param expiresIn - Expiration time in seconds (default: 3600 seconds / 1 hour)
   * @returns Pre-signed URL for direct upload to R2
   */
  async generatePresignedUploadUrl(
    fileName: string,
    fileType: string,
    folderPath?: string,
    expiresIn: number = 3600
  ): Promise<{ url: string; key: string }> {
    try {
      // Generate a unique key for the file
      const fileExtension = fileName.split('.').pop() || '';
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
      const key = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;

      // Create a PutObjectCommand for the pre-signed URL
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: fileType,
      });

      // Generate pre-signed URL
      const url = await getSignedUrl(r2Client, command, { expiresIn });

      return { url, key };
    } catch (error) {
      logger.error(`Error generating pre-signed upload URL: ${error}`);
      throw new Error(`Failed to generate pre-signed upload URL: ${(error as Error).message}`);
    }
  }

  /**
   * Generate a pre-signed URL to access a file (for download)
   * @param key - File key in R2
   * @param expiresIn - Expiration time in seconds (default: 3600 seconds / 1 hour)
   * @returns Pre-signed URL for accessing the file
   */
  async generatePresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(r2Client, command, { expiresIn });

      return url;
    } catch (error) {
      logger.error(`Error generating pre-signed download URL: ${error}`);
      throw new Error(`Failed to generate pre-signed download URL: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a file from R2
   * @param key - File key in R2
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        })
      );
    } catch (error) {
      logger.error(`Error deleting file from R2: ${error}`);
      throw new Error(`Failed to delete file from R2: ${(error as Error).message}`);
    }
  }

  /**
   * Get file metadata from R2
   * @param key - File key in R2
   * @returns File metadata
   */
  async getFileMetadata(key: string): Promise<FileMetadata> {
    try {
      // Note: Getting metadata requires a separate headObject command which we don't have imported
      // For now, we'll return a basic metadata object based on the key
      const fileName = key.split('/').pop() || key;
      
      return {
        key,
        fileName,
        size: 0, // Size not available without additional API call
        type: '', // Type not available without additional API call
        uploadDate: new Date(),
      };
    } catch (error) {
      logger.error(`Error getting file metadata: ${error}`);
      throw new Error(`Failed to get file metadata: ${(error as Error).message}`);
    }
  }

  /**
   * Validate file type
   * @param fileType - File MIME type to validate
   * @param allowedTypes - Array of allowed MIME types
   * @returns Boolean indicating if file type is allowed
   */
  validateFileType(fileType: string, allowedTypes: string[]): boolean {
    return allowedTypes.some(allowedType => {
      if (allowedType.endsWith('/*')) {
        // Handle wildcard types like 'image/*'
        const baseType = allowedType.slice(0, -2);
        return fileType.startsWith(baseType);
      }
      return fileType === allowedType;
    });
  }

  /**
   * Validate file size
   * @param fileSize - File size in bytes
   * @param maxSizeInBytes - Maximum allowed size in bytes
   * @returns Boolean indicating if file size is within limit
   */
  validateFileSize(fileSize: number, maxSizeInBytes: number): boolean {
    return fileSize <= maxSizeInBytes;
  }

  /**
   * Upload banner media files (image/video) to R2
   * @param imageFile - Banner image file buffer
   * @param mobileImageFile - Mobile banner image file buffer
   * @param videoFile - Banner video file buffer
   * @returns Banner file upload result with URLs and keys
   */
  async uploadBannerFiles(
    imageFile?: { buffer: Buffer; originalname: string; mimetype: string },
    mobileImageFile?: { buffer: Buffer; originalname: string; mimetype: string },
    videoFile?: { buffer: Buffer; originalname: string; mimetype: string }
  ): Promise<BannerFileUploadResult> {
    const fileKeys: string[] = [];
    const result: BannerFileUploadResult = {
      fileKeys
    };

    try {
      // Upload image file if provided
      if (imageFile) {
        const imageResult = await this.uploadFile(
          imageFile.buffer,
          imageFile.originalname,
          imageFile.mimetype,
          'banners'
        );
        result.imageUrl = imageResult.url;
        fileKeys.push(imageResult.key);
      }

      // Upload mobile image file if provided
      if (mobileImageFile) {
        const mobileImageResult = await this.uploadFile(
          mobileImageFile.buffer,
          mobileImageFile.originalname,
          mobileImageFile.mimetype,
          'banners'
        );
        result.mobileImageUrl = mobileImageResult.url;
        fileKeys.push(mobileImageResult.key);
      }

      // Upload video file if provided
      if (videoFile) {
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!this.validateFileType(videoFile.mimetype, allowedVideoTypes)) {
          throw new Error(`Invalid video file type: ${videoFile.mimetype}`);
        }

        const videoResult = await this.uploadFile(
          videoFile.buffer,
          videoFile.originalname,
          videoFile.mimetype,
          'banners'
        );
        result.videoUrl = videoResult.url;
        fileKeys.push(videoResult.key);
      }

      return result;
    } catch (error) {
      // If any upload fails, delete already uploaded files to avoid orphaned files
      for (const key of fileKeys) {
        try {
          await this.deleteFile(key);
        } catch (deleteError) {
          logger.error(`Failed to delete orphaned file ${key}: ${deleteError}`);
        }
      }
      throw error;
    }
  }

  /**
   * Generate pre-signed URLs for banner media uploads
   * @param imageFileName - Banner image file name
   * @param mobileImageFileName - Mobile banner image file name
   * @param videoFileName - Banner video file name
   * @returns Object with pre-signed URLs and keys
   */
  async generateBannerPresignedUrls(
    imageFileName?: string,
    mobileImageFileName?: string,
    videoFileName?: string
  ): Promise<{
    imageUrl?: { url: string; key: string };
    mobileImageUrl?: { url: string; key: string };
    videoUrl?: { url: string; key: string };
  }> {
    const result: {
      imageUrl?: { url: string; key: string };
      mobileImageUrl?: { url: string; key: string };
      videoUrl?: { url: string; key: string };
    } = {};

    if (imageFileName) {
      result.imageUrl = await this.generatePresignedUploadUrl(
        imageFileName,
        'image/jpeg', // Will be determined by actual file type
        'banners'
      );
    }

    if (mobileImageFileName) {
      result.mobileImageUrl = await this.generatePresignedUploadUrl(
        mobileImageFileName,
        'image/jpeg', // Will be determined by actual file type
        'banners'
      );
    }

    if (videoFileName) {
      result.videoUrl = await this.generatePresignedUploadUrl(
        videoFileName,
        'video/mp4', // Will be determined by actual file type
        'banners'
      );
    }

    return result;
  }

  /**
   * Delete banner media files from R2
   * @param imageUrl - Banner image URL
   * @param mobileImageUrl - Mobile banner image URL
   * @param videoUrl - Banner video URL
   */
  async deleteBannerFiles(
    imageUrl?: string,
    mobileImageUrl?: string,
    videoUrl?: string
  ): Promise<void> {
    const urls = [imageUrl, mobileImageUrl, videoUrl].filter(Boolean) as string[];
    
    for (const url of urls) {
      try {
        // Extract key from URL (assuming format: base_url/key)
        const key = url.replace(this.publicBaseUrl + '/', '');
        await this.deleteFile(key);
      } catch (error) {
        logger.error(`Failed to delete banner file ${url}: ${error}`);
        // Don't throw error as we want to continue deleting other files
      }
    }
  }

  /**
   * Upload multiple files to R2
   * @param files - Array of file objects to upload
   * @param folderPath - Folder path in R2 to store files
   * @returns Multiple file upload result
   */
  async uploadMultipleFiles(
    files: { buffer: Buffer; originalname: string; mimetype: string }[],
    folderPath: string
  ): Promise<MultipleFileUploadResult> {
    const results: FileUploadResult[] = [];
    const urls: string[] = [];
    const keys: string[] = [];

    for (const file of files) {
      const result = await this.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        folderPath
      );
      results.push({
        url: result.url,
        key: result.key,
        fileName: result.fileName,
        size: result.size,
        type: result.type,
      });
      urls.push(result.url);
      keys.push(result.key);
    }

    return { files: results, urls, keys };
  }

  /**
   * Upload user profile image
   * @param file - Profile image file buffer
   * @returns File upload result
   */
  async uploadUserProfileImage(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<FileUploadResult> {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!this.validateFileType(file.mimetype, allowedTypes)) {
      throw new Error(`Invalid image type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const result = await this.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      'users/profiles'
    );
    
    return {
      url: result.url,
      key: result.key,
      fileName: result.fileName,
      size: result.size,
      type: result.type,
    };
  }

  /**
   * Upload product images
   * @param files - Array of product image files
   * @returns Multiple file upload result
   */
  async uploadProductImages(files: { buffer: Buffer; originalname: string; mimetype: string }[]): Promise<MultipleFileUploadResult> {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (const file of files) {
      if (!this.validateFileType(file.mimetype, allowedTypes)) {
        throw new Error(`Invalid image type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`);
      }
    }

    return await this.uploadMultipleFiles(files, 'products');
  }

  /**
   * Upload document files (PDF, DOC, etc.)
   * @param file - Document file buffer
   * @returns File upload result
   */
  async uploadDocument(file: { buffer: Buffer; originalname: string; mimetype: string }): Promise<FileUploadResult> {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (!this.validateFileType(file.mimetype, allowedTypes)) {
      throw new Error(`Invalid document type: ${file.mimetype}`);
    }

    const result = await this.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      'documents'
    );
    
    return {
      url: result.url,
      key: result.key,
      fileName: result.fileName,
      size: result.size,
      type: result.type,
    };
  }

  /**
   * Generate a public URL for a file key
   * @param key - File key in R2
   * @returns Public URL for the file
   */
  generatePublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  /**
   * Delete multiple files from R2
   * @param keys - Array of file keys to delete
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    for (const key of keys) {
      try {
        await this.deleteFile(key);
      } catch (error) {
        logger.error(`Failed to delete file ${key}: ${error}`);
        // Don't throw error as we want to continue deleting other files
      }
    }
  }
}