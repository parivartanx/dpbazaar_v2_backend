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
    // First sanitize to remove internal fields and convert Float fields
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

    // Convert Float fields to numbers (already numbers from Prisma, but ensure proper conversion)
    // Handle null/undefined and ensure proper number type
    const convertToNumber = (value: any): number | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number') return isNaN(value) ? null : value;
      
      // Try direct Number() conversion for any other type
      try {
        const num = Number(value);
        return isNaN(num) ? null : num;
      } catch {
        return null;
      }
    };
    
    sanitizedProduct.mrp = convertToNumber(sanitizedProduct.mrp);
    sanitizedProduct.sellingPrice = convertToNumber(sanitizedProduct.sellingPrice);
    sanitizedProduct.taxRate = convertToNumber(sanitizedProduct.taxRate);
    sanitizedProduct.weight = convertToNumber(sanitizedProduct.weight);
    sanitizedProduct.avgRating = convertToNumber(sanitizedProduct.avgRating);

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
        
        // Convert Float fields in variants (already numbers from Prisma, but ensure proper conversion)
        const convertToNumber = (value: any): number | null => {
          if (value === null || value === undefined) return null;
          if (typeof value === 'number') return isNaN(value) ? null : value;
          try {
            const num = Number(value);
            return isNaN(num) ? null : num;
          } catch {
            return null;
          }
        };
        
        sanitizedVariant.mrp = convertToNumber(sanitizedVariant.mrp);
        sanitizedVariant.sellingPrice = convertToNumber(sanitizedVariant.sellingPrice);
        sanitizedVariant.weight = convertToNumber(sanitizedVariant.weight);
        
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

  // Products - Public route with pagination, search, and filtering
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract query parameters for pagination, search, and filtering
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const category = req.query.category as string;
      const brand = req.query.brand as string;
      const status = req.query.status as string;
      const stockStatus = req.query.stockStatus as string;
      const isFeatured = req.query.isFeatured as string;
      const isNewArrival = req.query.isNewArrival as string;
      const isBestSeller = req.query.isBestSeller as string;
      const barcode = req.query.barcode as string;

      // Build filters object
      const filters: any = {
        page,
        limit,
        search,
        category,
        brand,
        stockStatus,
      };

      // Only include status filter if explicitly provided (admin should see all statuses by default)
      if (status) {
        filters.status = status;
      }

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

      if (barcode) {
        filters.barcode = barcode;
      }

      // Get products with filters and pagination
      const { products, totalCount } = await this.repo.getAllWithFilters(filters);
      
      // Convert Float fields to numbers (already numbers from Prisma, but ensure proper conversion)
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'number') return isNaN(value) ? null : value;
        try {
          const num = Number(value);
          return isNaN(num) ? null : num;
        } catch {
          return null;
        }
      };
      
      const productsWithConvertedNumbers = products.map(product => {
        const converted = { ...product } as any;
        
        // Convert product-level Float fields
        converted.mrp = convertToNumber(converted.mrp);
        converted.sellingPrice = convertToNumber(converted.sellingPrice);
        converted.taxRate = convertToNumber(converted.taxRate);
        converted.weight = convertToNumber(converted.weight);
        converted.avgRating = convertToNumber(converted.avgRating);
        
        // Convert variant-level Float fields
        if (converted.variants && Array.isArray(converted.variants)) {
          converted.variants = converted.variants.map((variant: any) => {
            const convertedVariant = { ...variant };
            convertedVariant.mrp = convertToNumber(convertedVariant.mrp);
            convertedVariant.sellingPrice = convertToNumber(convertedVariant.sellingPrice);
            convertedVariant.weight = convertToNumber(convertedVariant.weight);
            return convertedVariant;
          });
        }
        
        return converted;
      });
      
      // Transform image keys to public URLs in the products response
      const transformedProducts = await this.imageUrlTransformer.transformCommonImageFields(productsWithConvertedNumbers);
      
      // Extract only essential fields for product cards/list view (optimized for performance)
      const productCards = transformedProducts.map(product => this.extractProductCardFields(product));
      
      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);
      
      const response: ApiResponse = {
        success: true,
        data: { 
          products: productCards,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
          }
        },
        message: 'Products fetched successfully',
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
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      // Check if product is soft-deleted
      if (product.deletedAt) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product fetched successfully',
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
      
      // Transform image keys to signed URLs in the product response
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product: product },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - SKU/slug/barcode uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        let fieldName = 'field';
        if (target?.includes('sku')) fieldName = 'SKU';
        else if (target?.includes('slug')) fieldName = 'slug';
        else if (target?.includes('barcode')) fieldName = 'barcode';
        
        res.status(409).json({
          success: false,
          error: 'Duplicate product',
          message: `A product with this ${fieldName} already exists. Field(s): ${target?.join(', ') || 'sku, slug, barcode'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Product',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product exists before updating
      const existingProduct = await this.repo.getById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.update(id, req.body);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformImageKeysToSignedUrls(product);
      
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: { product: transformedProduct },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - SKU/slug/barcode uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        let fieldName = 'field';
        if (target?.includes('sku')) fieldName = 'SKU';
        else if (target?.includes('slug')) fieldName = 'slug';
        else if (target?.includes('barcode')) fieldName = 'barcode';
        
        res.status(409).json({
          success: false,
          error: 'Duplicate product',
          message: `A product with this ${fieldName} already exists. Field(s): ${target?.join(', ') || 'sku, slug, barcode'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Product',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product exists before deleting
      const existingProduct = await this.repo.getById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if already soft-deleted
      if (existingProduct.deletedAt) {
        res.status(400).json({
          success: false,
          message: 'Product is already deleted',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.softDelete(id);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: { product: transformedProduct },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Product',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product exists before restoring
      const existingProduct = await this.repo.getById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product is not soft-deleted
      if (!existingProduct.deletedAt) {
        res.status(400).json({
          success: false,
          message: 'Product is not deleted',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const product = await this.repo.restore(id);
      
      // Transform image keys to signed URLs in the product response
      const transformedProduct = await this.imageUrlTransformer.transformCommonImageFields(product);
      
      res.status(200).json({
        success: true,
        message: 'Product restored successfully',
        data: { product: transformedProduct },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Restoring Product',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product exists
      const productRepo = new ProductRepository();
      const product = await productRepo.getById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const variants = await this.repo.getByProduct(id);
      
      // Transform image keys to public URLs in the variants response
      const transformedVariants = await this.imageUrlTransformer.transformCommonImageFields(variants);
      
      res.status(200).json({
        success: true,
        message: 'Variants fetched successfully',
        data: { variants: transformedVariants },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Product Variants',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if product exists
      const productRepo = new ProductRepository();
      const product = await productRepo.getById(id);
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const variant = await this.repo.create(id, req.body);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(201).json({
        success: true,
        message: 'Variant created successfully',
        data: { variant: transformedVariant },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - variantSku uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        res.status(409).json({
          success: false,
          error: 'Duplicate variant',
          message: `A variant with this ${target?.includes('variantSku') ? 'SKU' : 'field'} already exists. Field(s): ${target?.join(', ') || 'variantSku'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Product Variant',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if variant exists
      const existingVariant = await this.repo.getById(id);
      if (!existingVariant) {
        res.status(404).json({
          success: false,
          message: 'Variant not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const variant = await this.repo.update(id, req.body);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(200).json({
        success: true,
        message: 'Variant updated successfully',
        data: { variant: transformedVariant },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - variantSku uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        res.status(409).json({
          success: false,
          error: 'Duplicate variant',
          message: `A variant with this ${target?.includes('variantSku') ? 'SKU' : 'field'} already exists. Field(s): ${target?.join(', ') || 'variantSku'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Product Variant',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if variant exists
      const existingVariant = await this.repo.getById(id);
      if (!existingVariant) {
        res.status(404).json({
          success: false,
          message: 'Variant not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.repo.delete(id);
      res.status(200).json({
        success: true,
        message: 'Variant deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma foreign key constraint (P2003) - variant has inventory/order items
      if (error.code === 'P2003') {
        res.status(400).json({
          success: false,
          error: 'Cannot delete variant',
          message: 'Variant cannot be deleted because it has associated inventory or order items. Please remove or reassign them first.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Product Variant',
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if variant exists
      const existingVariant = await this.repo.getById(id);
      if (!existingVariant) {
        res.status(404).json({
          success: false,
          message: 'Variant not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const isActive = req.body.isActive;
      if (typeof isActive !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const variant = await this.repo.toggleActive(id, isActive);
      
      // Transform image keys to public URLs in the variant response
      const transformedVariant = await this.imageUrlTransformer.transformCommonImageFields(variant);
      
      res.status(200).json({
        success: true,
        message: 'Variant active status updated successfully',
        data: { variant: transformedVariant },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Toggling Variant Active Status',
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
      const { search, page, limit } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 20;

      let attrs = await this.repo.getAllTypes();

      // Apply search filter if provided
      if (search) {
        const searchLower = (search as string).toLowerCase();
        attrs = attrs.filter(attr => 
          attr.name.toLowerCase().includes(searchLower) ||
          attr.dataType.toLowerCase().includes(searchLower)
        );
      }

      // Apply pagination
      const totalCount = attrs.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedAttrs = attrs.slice(startIndex, startIndex + limitNum);

      res.status(200).json({
        success: true,
        message: 'Attributes fetched successfully',
        data: { 
          attrs: paginatedAttrs,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalItems: totalCount,
            itemsPerPage: limitNum,
          }
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Fetching Attributes',
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
        message: 'Attribute created successfully',
        data: { attr },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - name uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        res.status(409).json({
          success: false,
          error: 'Duplicate attribute',
          message: `An attribute with this name already exists. Field(s): ${target?.join(', ') || 'name'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Creating Attribute',
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
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Attribute ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if attribute exists
      const existingAttr = await this.repo.getTypeById(id);
      if (!existingAttr) {
        res.status(404).json({
          success: false,
          message: 'Attribute not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const attr = await this.repo.updateType(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Attribute updated successfully',
        data: { attr },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma unique constraint error (P2002) - name uniqueness
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        res.status(409).json({
          success: false,
          error: 'Duplicate attribute',
          message: `An attribute with this name already exists. Field(s): ${target?.join(', ') || 'name'}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Updating Attribute',
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
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Attribute ID is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Check if attribute exists
      const existingAttr = await this.repo.getTypeById(id);
      if (!existingAttr) {
        res.status(404).json({
          success: false,
          message: 'Attribute not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.repo.deleteType(id);
      res.status(200).json({
        success: true,
        message: 'Attribute deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error(`error: ${error}`);
      
      // Handle Prisma foreign key constraint (P2003) - attribute has product/category associations
      if (error.code === 'P2003') {
        res.status(400).json({
          success: false,
          error: 'Cannot delete attribute',
          message: 'Attribute cannot be deleted because it has associated products or categories. Please remove associations first.',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in Deleting Attribute',
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