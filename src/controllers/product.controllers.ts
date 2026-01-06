import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { ProductRepository } from '../repositories/prisma/ProductRepository';
import { VariantRepository } from '../repositories/prisma/VariantRepository';
import { AttributeRepository } from '../repositories/prisma/AttributeRepository';
import { RelationRepository } from '../repositories/prisma/RelationRepository';
// import { ReviewRepository } from '../repositories/prisma/ReviewRepository';
// import { ReportRepository } from '../repositories/prisma/ReportRepository';

import { R2Service } from '../services/r2.service';
import { ImageUrlTransformer } from '../utils/imageUrlTransformer';

/**
 * Shared param types
 */
type IdParam = { id: string };
type AttrParam = { attrId: string };
// type ProductImageParams = { productId: string; imageId: string };

export class ProductController {
  private repo = new ProductRepository();
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  /**
   * Extracts only essential fields for product card/list view
   * Optimized for displaying products in a grid/list, not full product details
   */
  private extractProductCardFields(product: any): any {
    // First sanitize to remove internal fields and convert Decimals
    const sanitized = this.sanitizeProductForPublic(product);
    
    // Get primary image or first image
    const primaryImage = sanitized.images && sanitized.images.length > 0
      ? sanitized.images.find((img: any) => img.isPrimary) || sanitized.images[0]
      : null;
    
    // Get prices - use product prices, or fallback to first variant prices if product prices are null
    let mrp = sanitized.mrp;
    let sellingPrice = sanitized.sellingPrice;
    
    // If product prices are null, try to get from first active variant
    if ((mrp === null || mrp === undefined) && sanitized.variants && sanitized.variants.length > 0) {
      const firstActiveVariant = sanitized.variants.find((v: any) => v.isActive !== false) || sanitized.variants[0];
      if (firstActiveVariant) {
        mrp = firstActiveVariant.mrp || mrp;
        sellingPrice = firstActiveVariant.sellingPrice || sellingPrice;
      }
    }
    
    // Calculate discount if prices are available
    let discount = null;
    if (mrp !== null && mrp !== undefined && 
        sellingPrice !== null && sellingPrice !== undefined) {
      const mrpNum = Number(mrp);
      const sellingPriceNum = Number(sellingPrice);
      if (!isNaN(mrpNum) && !isNaN(sellingPriceNum) && mrpNum > 0) {
        const discountAmount = mrpNum - sellingPriceNum;
        const discountPercent = ((discountAmount / mrpNum) * 100);
        discount = {
          amount: discountAmount,
          percent: parseFloat(discountPercent.toFixed(2))
        };
      }
    }
    
    // Extract category names only
    const categoryNames = sanitized.categories
      ? sanitized.categories.map((cat: any) => cat.category?.name || cat.name).filter(Boolean)
      : [];
    
    // Extract brand name and logo only
    const brand = sanitized.brand
      ? {
          id: sanitized.brand.id,
          name: sanitized.brand.name,
          logo: sanitized.brand.logo,
          slug: sanitized.brand.slug
        }
      : null;
    
    // Return only essential fields for product cards
    return {
      id: sanitized.id,
      sku: sanitized.sku,
      name: sanitized.name,
      slug: sanitized.slug,
      shortDescription: sanitized.shortDescription || (sanitized.description ? sanitized.description.substring(0, 100) : null),
      mrp: mrp,
      sellingPrice: sellingPrice,
      discount: discount,
      image: primaryImage ? {
        url: primaryImage.url,
        thumbnailUrl: primaryImage.thumbnailUrl,
        alt: primaryImage.alt
      } : null,
      brand: brand,
      categories: categoryNames,
      stockStatus: sanitized.stockStatus,
      status: sanitized.status,
      isFeatured: sanitized.isFeatured,
      isNewArrival: sanitized.isNewArrival,
      isBestSeller: sanitized.isBestSeller,
      avgRating: sanitized.avgRating,
      totalReviews: sanitized.totalReviews
    };
  }

  /**
   * Sanitizes product data for public e-commerce API by removing internal/admin-only fields
   */
  private sanitizeProductForPublic(product: any): any {
    const {
      costPrice,
      vendorId,
      vendor,
      metadata,
      deletedAt,
      createdAt,
      updatedAt,
      publishedAt,
      viewCount,
      salesCount,
      metaTitle,
      metaDescription,
      metaKeywords,
      ...sanitizedProduct
    } = product;

    // Convert Decimal fields to numbers (should already be numbers from getAllProducts, but handle as fallback)
    // Handle both Decimal instances and already-converted numbers
    const convertDecimal = (value: any): number | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number') return isNaN(value) ? null : value;
      
      // If already a number, return it
      if (typeof value === 'number') return value;
      
      // Try toNumber() if available (Decimal instance)
      if (value && typeof value === 'object' && 'toNumber' in value && typeof value.toNumber === 'function') {
        try {
          const num = value.toNumber();
          return isNaN(num) ? null : num;
        } catch {
          // Fall through to next method
        }
      }
      
      // Handle serialized Decimal format: {s: 1, e: 4, d: [15995]}
      if (value && typeof value === 'object' && 'd' in value && Array.isArray(value.d) && 'e' in value) {
        try {
          // Reconstruct from serialized format
          const digits = value.d;
          const exponent = value.e || 0;
          const sign = value.s === -1 ? -1 : 1;
          
          // For simple single-digit cases: {d: [15995], e: 4} means 15995 * 10^4
          // But actually, Decimal.js uses base-1e7, so this is more complex
          // For now, try simple reconstruction
          if (digits.length === 1) {
            const num = digits[0];
            // If exponent is 0, the number is just the digit
            if (exponent === 0) {
              return sign * num;
            }
            // Otherwise, apply exponent (this is approximate)
            return sign * num * Math.pow(10, exponent);
          }
          
          // For multiple digits, reconstruct properly
          let result = 0;
          for (let i = 0; i < digits.length; i++) {
            result += digits[i] * Math.pow(1e7, digits.length - 1 - i);
          }
          result *= Math.pow(10, exponent);
          return sign * result;
        } catch {
          // Fall through
        }
      }
      
      // Try direct Number() conversion
      try {
        const num = Number(value);
        return isNaN(num) ? null : num;
      } catch {
        return null;
      }
    };
    
    sanitizedProduct.mrp = convertDecimal(sanitizedProduct.mrp);
    sanitizedProduct.sellingPrice = convertDecimal(sanitizedProduct.sellingPrice);
    sanitizedProduct.taxRate = convertDecimal(sanitizedProduct.taxRate);
    sanitizedProduct.weight = convertDecimal(sanitizedProduct.weight);
    sanitizedProduct.avgRating = convertDecimal(sanitizedProduct.avgRating);

    // Also sanitize nested relations if they exist
    if (sanitizedProduct.brand) {
      const { createdAt: brandCreatedAt, updatedAt: brandUpdatedAt, ...sanitizedBrand } = sanitizedProduct.brand;
      sanitizedProduct.brand = sanitizedBrand;
    }

    if (sanitizedProduct.categories) {
      sanitizedProduct.categories = sanitizedProduct.categories.map((cat: any) => {
        if (cat.category) {
          const { createdAt: catCreatedAt, updatedAt: catUpdatedAt, ...sanitizedCategory } = cat.category;
          return { ...cat, category: sanitizedCategory };
        }
        return cat;
      });
    }

    if (sanitizedProduct.variants) {
      sanitizedProduct.variants = sanitizedProduct.variants.map((variant: any) => {
        const {
          createdAt: variantCreatedAt,
          updatedAt: variantUpdatedAt,
          ...sanitizedVariant
        } = variant;
        
        // Convert Decimal fields in variants
        const convertDecimal = (value: any): number | null => {
          if (value === null || value === undefined) return null;
          if (typeof value === 'number') return isNaN(value) ? null : value;
          try {
            const num = Number(value);
            return isNaN(num) ? null : num;
          } catch {
            return null;
          }
        };
        
        sanitizedVariant.mrp = convertDecimal(sanitizedVariant.mrp);
        sanitizedVariant.sellingPrice = convertDecimal(sanitizedVariant.sellingPrice);
        sanitizedVariant.weight = convertDecimal(sanitizedVariant.weight);
        
        return sanitizedVariant;
      });
    }

    if (sanitizedProduct.images) {
      sanitizedProduct.images = sanitizedProduct.images.map((image: any) => {
        const {
          createdAt: imageCreatedAt,
          updatedAt: imageUpdatedAt,
          ...sanitizedImage
        } = image;
        return sanitizedImage;
      });
    }

    return sanitizedProduct;
  }

  // Products
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.repo.getAll();
      
      // Convert Decimal fields to numbers BEFORE image transformation
      // This prevents serialization issues with Decimal objects
      const productsWithConvertedDecimals = products.map(product => {
        const converted = { ...product } as any;
        
        // Convert product-level Decimal fields
        if (converted.mrp != null && typeof converted.mrp === 'object' && 'toNumber' in converted.mrp) {
          converted.mrp = converted.mrp.toNumber();
        } else if (converted.mrp != null) {
          converted.mrp = Number(converted.mrp);
        }
        
        if (converted.sellingPrice != null && typeof converted.sellingPrice === 'object' && 'toNumber' in converted.sellingPrice) {
          converted.sellingPrice = converted.sellingPrice.toNumber();
        } else if (converted.sellingPrice != null) {
          converted.sellingPrice = Number(converted.sellingPrice);
        }
        
        if (converted.taxRate != null && typeof converted.taxRate === 'object' && 'toNumber' in converted.taxRate) {
          converted.taxRate = converted.taxRate.toNumber();
        } else if (converted.taxRate != null) {
          converted.taxRate = Number(converted.taxRate);
        }
        
        if (converted.weight != null && typeof converted.weight === 'object' && 'toNumber' in converted.weight) {
          converted.weight = converted.weight.toNumber();
        } else if (converted.weight != null) {
          converted.weight = Number(converted.weight);
        }
        
        if (converted.avgRating != null && typeof converted.avgRating === 'object' && 'toNumber' in converted.avgRating) {
          converted.avgRating = converted.avgRating.toNumber();
        } else if (converted.avgRating != null) {
          converted.avgRating = Number(converted.avgRating);
        }
        
        // Convert variant-level Decimal fields
        if (converted.variants && Array.isArray(converted.variants)) {
          converted.variants = converted.variants.map((variant: any) => {
            const convertedVariant = { ...variant };
            if (convertedVariant.mrp != null && typeof convertedVariant.mrp === 'object' && 'toNumber' in convertedVariant.mrp) {
              convertedVariant.mrp = convertedVariant.mrp.toNumber();
            } else if (convertedVariant.mrp != null) {
              convertedVariant.mrp = Number(convertedVariant.mrp);
            }
            
            if (convertedVariant.sellingPrice != null && typeof convertedVariant.sellingPrice === 'object' && 'toNumber' in convertedVariant.sellingPrice) {
              convertedVariant.sellingPrice = convertedVariant.sellingPrice.toNumber();
            } else if (convertedVariant.sellingPrice != null) {
              convertedVariant.sellingPrice = Number(convertedVariant.sellingPrice);
            }
            
            if (convertedVariant.weight != null && typeof convertedVariant.weight === 'object' && 'toNumber' in convertedVariant.weight) {
              convertedVariant.weight = convertedVariant.weight.toNumber();
            } else if (convertedVariant.weight != null) {
              convertedVariant.weight = Number(convertedVariant.weight);
            }
            
            return convertedVariant;
          });
        }
        
        return converted;
      });
      
      // Transform image keys to public URLs in the products response
      const transformedProducts = await this.imageUrlTransformer.transformCommonImageFields(productsWithConvertedDecimals);
      
      // Extract only essential fields for product cards/list view (optimized for performance)
      const productCards = transformedProducts.map(product => this.extractProductCardFields(product));
      
      const response: ApiResponse = {
        success: true,
        data: { products: productCards },
        message: 'Products Found',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching Products',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Dashboard stats
  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.repo.getDashboardStats();
      
      const response: ApiResponse = {
        success: true,
        data: {
          productOverview: {
            totalProducts: stats.totalProducts,
            activeProducts: stats.activeProducts,
            draftProducts: stats.draftProducts,
            stockStatus: {
              inStock: stats.inStockCount,
              lowStock: stats.lowStockCount,
              outOfStock: stats.outOfStockCount
            },
            featured: {
              total: stats.featuredCount,
              newArrivals: stats.newArrivalsCount,
              bestSellers: stats.bestSellersCount
            },
            categories: {
              total: stats.activeCategories
            }
          }
        },
        message: 'Dashboard stats retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching dashboard stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Paginated products with filters
  getProductsFiltered = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info('getProductsFiltered called with query params:', req.query);
      logger.info('Request URL:', req.url);
      logger.info('Request method:', req.method);
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const brand = req.query.brand as string;
      const status = req.query.status as string;
      const stockStatus = req.query.stockStatus as string;
      const isFeatured = req.query.isFeatured as string;
      const isNewArrival = req.query.isNewArrival as string;
      const isBestSeller = req.query.isBestSeller as string;

      const filters: any = {
        page,
        limit,
        search,
        category,
        brand,
        status,
        stockStatus
      };

      // Convert string booleans to actual booleans
      if (isFeatured !== undefined) {
        filters.isFeatured = isFeatured === 'true';
      }
      if (isNewArrival !== undefined) {
        filters.isNewArrival = isNewArrival === 'true';
      }
      if (isBestSeller !== undefined) {
        filters.isBestSeller = isBestSeller === 'true';
      }

      logger.info('Applying filters:', filters);
      
      const { products, totalCount } = await this.repo.getAllWithFilters(filters);
      
      logger.info(`Found ${totalCount} products, returning ${products.length} products`);
      
      const totalPages = Math.ceil(totalCount / limit);
      
      // Transform image keys to public URLs in the products response
      const transformedProducts = await this.imageUrlTransformer.transformCommonImageFields(products);
      
      const response: ApiResponse = {
        success: true,
        data: {
          products: transformedProducts,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        },
        message: 'Products retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`error in getProductsFiltered: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching products',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const product = await this.repo.getById(id);
      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: 'Not Found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product Found',
        data: { product: transformedProduct },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching Product',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      if (!slug) {
        const response: ApiResponse = {
          success: false,
          message: 'Product slug is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const product = await this.repo.getBySlug(slug);
      if (!product) {
        const response: ApiResponse = {
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      // Transform image keys to public URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      // Sanitize product to remove internal/admin-only fields
      const sanitizedProduct = this.sanitizeProductForPublic(transformedProduct);
      
      res.status(200).json({
        success: true,
        message: 'Product Found',
        data: { product: sanitizedProduct },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching Product by slug',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.repo.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Product Created',
        data: { product },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating Product',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.update(id, req.body);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformImageKeysToSignedUrls(product);
      
      res.status(200).json({
        success: true,
        message: 'product updated',
        data: { product: transformedProduct },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating Product',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  softDeleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.softDelete(id);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted',
        data: { product: transformedProduct },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting Product',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  restoreProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.restore(id);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product recovered successfully',
        data: { product: transformedProduct },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in restoring Product',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Add image by providing image key (R2 key) - frontend uploads directly using pre-signed URL
  addImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const { imageKey, isPrimary = false } = req.body;
      
      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      
      if (!imageKey) {
        res.status(400).json({
          success: false,
          message: 'Image key is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      // Store the image key in the database
      const image = await this.repo.addProductImage(productId, imageKey, isPrimary);
      
      // Transform the response to include public URL instead of key
      const transformedImage = await this.imageUrlTransformer.transformCommonImageFields(image);
      
      res.status(201).json({
        success: true,
        message: 'Image added',
        data: { image: transformedImage },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in adding image',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  addImagesBulk = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const { imageKeys = [] } = req.body;
      
      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      
      if (!Array.isArray(imageKeys) || imageKeys.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Image keys array is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      // Store the image keys in the database
      const images = await this.repo.addProductImagesBulk(productId, imageKeys);
      
      // Transform the response to include public URLs instead of keys
      const transformedImages = await this.imageUrlTransformer.transformCommonImageFields(images);
      
      res.status(201).json({
        success: true,
        message: 'Images added',
        data: { images: transformedImages },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in adding images',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { imageId } = req.params;
      if (!imageId) {
        res.status(400).json({
          success: false,
          message: 'Image ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      await this.repo.deleteImage(imageId);
      res.json({
        success: true,
        message: 'Image deleted successfully',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting images',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  setPrimaryImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, imageId } = req.params;
      if (!productId || !imageId) {
        res.status(400).json({
          success: false,
          message: 'Product ID and Image ID are required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }

      await this.repo.setPrimaryImage(productId, imageId);
      res.status(200).json({
        success: true,
        message: 'Image set to Primary',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: "can't set image as primary",
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}
/**
 * PRODUCT VARIANT
 */

export class VariantController {
  private repo = new VariantRepository();
  private r2Service = new R2Service();
  private imageUrlTransformer = new ImageUrlTransformer({ r2Service: this.r2Service });

  getProductVariants = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      const variants = await this.repo.getByProduct(id);
      
      // Transform image keys to public URLs in the variants response
      const transformedVariants = await this.imageUrlTransformer.transformCommonImageFields(variants);
      
      res.status(200).json({
        success: true,
        message: 'Variants found',
        data: { variants: transformedVariants },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in getting ProductVariants',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Product ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      const variant = await this.repo.create(id, req.body);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(201).json({
        success: true,
        message: 'variant created',
        data: { variant: transformedVariant },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating Product variants',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Variant ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      const variant = await this.repo.update(id, req.body);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(200).json({
        success: true,
        message: 'variant updated',
        data: { variant: transformedVariant },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating Product variants',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Variant ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      await this.repo.delete(id);
      res.status(200).json({
        success: true,
        message: 'variant deleted successfully',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting Product variants',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  toggleVariantActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Variant ID is required',
          timeStamp: new Date().toISOString(),
        });
        return;
      }
      const variant = await this.repo.toggleActive(id, req.body.isActive);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(200).json({
        success: true,
        message: 'variant toggle activated',
        data: { variant: transformedVariant },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in toggle variant',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}

/***
 * PRODUCT ATTRIBUTE
 */

export class AttributeController {
  private repo = new AttributeRepository();

  // Types
  getAllAttributes = async (req: Request, res: Response): Promise<void> => {
    try {
      const attrs = await this.repo.getAllTypes();
      res.status(200).json({
        success: true,
        message: 'Attribute Found',
        data: { attrs },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in fetching Attributes',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createAttribute = async (req: Request, res: Response): Promise<void> => {
    try {
      const attr = await this.repo.createType(req.body);
      res.status(201).json({
        success: true,
        message: 'Attribute created',
        data: { attr },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating Attribute',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateAttribute = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const attr = await this.repo.updateType(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Attribute Updated',
        data: { attr },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in updating Attribute',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteAttribute = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      await this.repo.deleteType(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Attribute deleted',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting attribute',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Product
  addToProduct = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const attr = await this.repo.addToProduct(
        req.params.id,
        req.body.attributeTypeId,
        req.body.value
      );
      res.status(200).json({
        success: true,
        message: 'Attribute added',
        data: { attr },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: "can't add  Product in attribute",
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  removeFromProduct = async (
    req: Request<AttrParam>,
    res: Response
  ): Promise<void> => {
    try {
      await this.repo.removeFromProduct(req.params.attrId);
      res.status(200).json({
        success: true,
        message: 'Attribute removed',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in removing attribute',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Category
  assignToCategory = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const attr = await this.repo.assignToCategory(
        req.params.id,
        req.body.attributeTypeId
      );
      res.status(200).json({
        success: true,
        message: 'assigned to category',
        data: { attr },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in assigning category',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  removeFromCategory = async (
    req: Request<IdParam & AttrParam>,
    res: Response
  ): Promise<void> => {
    try {
      await this.repo.removeFromCategory(req.params.id, req.params.attrId);
      res.status(200).json({
        success: true,
        message: 'Removed from category',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in removing from category',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}

/**
 * PRODUCT RELATION
 */

export class RelationController {
  private repo = new RelationRepository();

  getProductRelations = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const relations = await this.repo.getByProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Relation found',
        data: { relations },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in getting Product relation',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  createRelation = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      const relation = await this.repo.create(req.params.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Relation Created',
        data: { relation },
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating relation in products',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  deleteRelation = async (
    req: Request<IdParam>,
    res: Response
  ): Promise<void> => {
    try {
      await this.repo.delete(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Relation deleted',
        timeStamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in deleting Product relation',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };
}

/**
 * PRODUCT REVIEW
 */

// export class ReviewController {
//   private repo = new ReviewRepository();

//   getAllReviews = async (_req: Request, res: Response): Promise<void> => {
//     const reviews = await this.repo.getAll();
//     res.json(reviews);
//   };

//   approveReview = async (
//     req: Request<IdParam>,
//     res: Response
//   ): Promise<void> => {
//     const review = await this.repo.approve(req.params.id);
//     res.json(review);
//   };

//   rejectReview = async (
//     req: Request<IdParam>,
//     res: Response
//   ): Promise<void> => {
//     const review = await this.repo.reject(req.params.id, req.body.reason);
//     res.json(review);
//   };

//   deleteReview = async (
//     req: Request<IdParam>,
//     res: Response
//   ): Promise<void> => {
//     await this.repo.delete(req.params.id);
//     res.json({ success: true });
//   };

//   replyToReview = async (
//     req: Request<IdParam>,
//     res: Response
//   ): Promise<void> => {
//     const review = await this.repo.reply(req.params.id, req.body.reply);
//     res.json(review);
//   };
// }

// /**
//  * PRODUCT REPORT
//  */
// export class ReportController {
//   private repo = new ReportRepository();

//   getSalesReport = async (req: Request, res: Response) => {
//     const report = await this.repo.getSalesReport();
//     res.json(report);
//   };

//   getBestSellers = async (req: Request, res: Response) => {
//     const report = await this.repo.getBestSellers();
//     res.json(report);
//   };

//   getCategorySales = async (req: Request, res: Response) => {
//     const report = await this.repo.getCategorySales();
//     res.json(report);
//   };

//   getReturnsReport = async (req: Request, res: Response) => {
//     const report = await this.repo.getReturnsReport();
//     res.json(report);
//   };