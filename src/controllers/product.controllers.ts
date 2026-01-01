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

  // Products
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.repo.getAll();
      
      // Transform image keys to public URLs in the products response
      const transformedProducts = await this.imageUrlTransformer.transformCommonImageFields(products);
      
      const response: ApiResponse = {
        success: true,
        data: { products: transformedProducts },
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