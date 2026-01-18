import { R2Service } from '../services/r2.service';

export interface ImageUrlTransformerOptions {
  r2Service?: R2Service;
}

export class ImageUrlTransformer {
  private r2Service: R2Service;

  constructor(options?: ImageUrlTransformerOptions) {
    this.r2Service = options?.r2Service || new R2Service();
  }

  /**
   * Transform image keys to public URLs in an object
   * @param obj - Object containing image keys
   * @param fields - Array of field names that contain image keys to transform
   * @returns Object with image keys replaced by public URLs
   */
  transformImageKeysToUrls<T>(obj: T, fields: string[] = []): T {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Preserve Date objects - don't spread them (spreading a Date creates an empty {})
    if (obj instanceof Date) {
      return obj;
    }

    // If it's an array, process each element
    if (Array.isArray(obj)) {
      return obj.map(item =>
        this.transformImageKeysToUrls(item, fields)
      ) as any;
    }

    // Create a copy of the object to avoid mutating the original
    const result: any = { ...obj };

    // Process each field that might contain image keys
    for (const [key, value] of Object.entries(result)) {
      if (value === null || value === undefined) {
        continue;
      }

      // If this field is in our target fields list, transform it
      if (fields.includes(key)) {
        if (typeof value === 'string') {
          // Check if the value looks like an R2 key (not a full URL)
          if (!value.startsWith('http')) {
            result[key] = this.r2Service.generatePublicUrl(value);
          }
        } else if (Array.isArray(value)) {
          // Handle array of image keys
          result[key] = value.map(item => {
            if (typeof item === 'string' && !item.startsWith('http')) {
              return this.r2Service.generatePublicUrl(item);
            }
            return item;
          });
        } else if (typeof value === 'object') {
          // If it's an object, it might be a complex structure with image keys
          result[key] = this.transformImageKeysToUrls(value, fields);
        }
      }
      // If the value is an object or array, process it recursively
      else if (typeof value === 'object') {
        result[key] = this.transformImageKeysToUrls(value, fields);
      }
    }

    return result;
  }

  /**
   * Transform image keys to signed URLs in an object (async version)
   * @param obj - Object containing image keys
   * @param fields - Array of field names that contain image keys to transform
   * @returns Object with image keys replaced by signed URLs
   */
  async transformImageKeysToSignedUrls<T>(
    obj: T,
    fields: string[] = []
  ): Promise<T> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Preserve Date objects - don't spread them (spreading a Date creates an empty {})
    if (obj instanceof Date) {
      return obj;
    }

    // If it's an array, process each element
    if (Array.isArray(obj)) {
      const result = [];
      for (const item of obj) {
        result.push(await this.transformImageKeysToSignedUrls(item, fields));
      }
      return result as any;
    }

    // Create a copy of the object to avoid mutating the original
    const result: any = { ...obj };

    // Process each field that might contain image keys
    for (const [key, value] of Object.entries(result)) {
      if (value === null || value === undefined) {
        continue;
      }

      // If this field is in our target fields list, transform it
      if (fields.includes(key)) {
        if (typeof value === 'string') {
          // Check if the value looks like an R2 key (not a full URL)
          if (!value.startsWith('http')) {
            result[key] =
              await this.r2Service.generatePresignedDownloadUrl(value);
          }
        } else if (Array.isArray(value)) {
          // Handle array of image keys
          const transformedArray = [];
          for (const item of value) {
            if (typeof item === 'string' && !item.startsWith('http')) {
              transformedArray.push(
                await this.r2Service.generatePresignedDownloadUrl(item)
              );
            } else {
              transformedArray.push(item);
            }
          }
          result[key] = transformedArray;
        } else if (typeof value === 'object') {
          // If it's an object, it might be a complex structure with image keys
          result[key] = await this.transformImageKeysToSignedUrls(
            value,
            fields
          );
        }
      }
      // If the value is an object or array, process it recursively
      else if (typeof value === 'object') {
        result[key] = await this.transformImageKeysToSignedUrls(value, fields);
      }
    }

    return result;
  }

  /**
   * Transform specific image key fields in an object
   * @param obj - Object to transform
   * @param keyField - Field name that contains the R2 key
   * @param urlField - Field name where the public URL should be stored (defaults to same as keyField)
   * @returns Object with image keys converted to URLs
   */
  transformImageKeyToUrl<T>(obj: T, keyField: string, urlField?: string): T {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Preserve Date objects - don't spread them (spreading a Date creates an empty {})
    if (obj instanceof Date) {
      return obj;
    }

    const targetField = urlField || keyField;

    // If it's an array, process each element
    if (Array.isArray(obj)) {
      return obj.map(item =>
        this.transformImageKeyToUrl(item, keyField, urlField)
      ) as any;
    }

    const result: any = { ...obj };

    if (keyField in result) {
      const value = result[keyField];
      if (typeof value === 'string' && !value.startsWith('http')) {
        result[targetField] = this.r2Service.generatePublicUrl(value);
      }
    }

    // Process nested objects
    for (const [nestedKey, nestedValue] of Object.entries(result)) {
      if (
        nestedValue &&
        typeof nestedValue === 'object' &&
        !Array.isArray(nestedValue)
      ) {
        result[nestedKey] = this.transformImageKeyToUrl(
          nestedValue,
          keyField,
          urlField
        );
      } else if (Array.isArray(nestedValue)) {
        result[nestedKey] = nestedValue.map((item: any) => {
          if (item && typeof item === 'object') {
            return this.transformImageKeyToUrl(item, keyField, urlField);
          }
          return item;
        });
      }
    }

    return result;
  }

  /**
   * Transform specific image key fields in an object to signed URLs (async version)
   * @param obj - Object to transform
   * @param keyField - Field name that contains the R2 key
   * @param urlField - Field name where the signed URL should be stored (defaults to same as keyField)
   * @returns Object with image keys converted to signed URLs
   */
  async transformImageKeyToSignedUrl<T>(
    obj: T,
    keyField: string,
    urlField?: string
  ): Promise<T> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Preserve Date objects - don't spread them (spreading a Date creates an empty {})
    if (obj instanceof Date) {
      return obj;
    }

    const targetField = urlField || keyField;

    // If it's an array, process each element
    if (Array.isArray(obj)) {
      const result = [];
      for (const item of obj) {
        result.push(
          await this.transformImageKeyToSignedUrl(item, keyField, urlField)
        );
      }
      return result as any;
    }

    const result: any = { ...obj };

    if (keyField in result) {
      const value = result[keyField];
      if (typeof value === 'string' && !value.startsWith('http')) {
        result[targetField] =
          await this.r2Service.generatePresignedDownloadUrl(value);
      }
    }

    // Process nested objects
    for (const [nestedKey, nestedValue] of Object.entries(result)) {
      if (
        nestedValue &&
        typeof nestedValue === 'object' &&
        !Array.isArray(nestedValue)
      ) {
        result[nestedKey] = await this.transformImageKeyToSignedUrl(
          nestedValue,
          keyField,
          urlField
        );
      } else if (Array.isArray(nestedValue)) {
        const nestedResult = [];
        for (const item of nestedValue) {
          if (item && typeof item === 'object') {
            nestedResult.push(
              await this.transformImageKeyToSignedUrl(item, keyField, urlField)
            );
          } else {
            nestedResult.push(item);
          }
        }
        result[nestedKey] = nestedResult;
      }
    }

    return result;
  }

  /**
   * Transform common image fields in an object (like 'url', 'imageUrl', 'image', etc.) to signed URLs
   * @param obj - Object to transform
   * @returns Object with image keys converted to signed URLs
   */
  async transformCommonImageFields<T>(obj: T): Promise<T> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // Common image-related field names that might contain R2 keys
    const imageFields = [
      'url',
      'imageUrl',
      'mobileImageUrl',
      'videoUrl',
      'thumbnailUrl',
      'image',
      'avatar',
      'logo',
      'bannerImage',
      'productImage',
      'profileImage',
    ];

    return await this.transformImageKeysToSignedUrls(obj, imageFields);
  }
}
