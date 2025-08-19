import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types/common';
// import { string } from 'joi';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // ==========================
  // PRODUCTS CRUD & LISTING
  // ==========================

  public getAllProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        status,
        brandId,
        categoryId,
      } = req.query;
      const products = await this.productService.getAllProducts({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: String(search || ''),
        sortBy: String(sortBy || 'createdAt'),
        sortOrder: String(sortOrder || 'desc'),
        status: status ? String(status) : undefined,
        brandId: brandId ? String(brandId) : undefined,
        categoryId: categoryId ? String(categoryId) : undefined,
      });

      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'Products fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching products: ${error}`);
      this.sendError(res, error, 'Failed to fetch products');
    }
  };

  public getProductById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductById(
        req.params.id as string
      );
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Product fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching product: ${error}`);
      this.sendError(res, error, 'Failed to fetch product');
    }
  };

  public getProductBySlug = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductBySlug(
        (req.params.slug as string).replace(/-/g, ' ')
      );
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Product fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching product by slug: ${error}`);
      this.sendError(res, error, 'Failed to fetch product');
    }
  };

  public createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const createdProduct = await this.productService.createProduct(req.body);
      const response: ApiResponse = {
        success: true,
        data: createdProduct,
        message: 'Product created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating product: ${error}`);
      this.sendError(res, error, 'Failed to create product');
    }
  };

  public updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedProduct = await this.productService.updateProduct(
        req.params.id as string,
        req.body
      );
      const response: ApiResponse = {
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating product: ${error}`);
      this.sendError(res, error, 'Failed to update product');
    }
  };

  public deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id as string);
      const response: ApiResponse = {
        success: true,
        message: 'Product deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting product: ${error}`);
      this.sendError(res, error, 'Failed to delete product');
    }
  };

  public softDeleteProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await this.productService.softDeleteProduct(req.params.id as string);
      const response: ApiResponse = {
        success: true,
        message: 'Product soft deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error soft deleting product: ${error}`);
      this.sendError(res, error, 'Failed to soft delete product');
    }
  };

  public restoreProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await this.productService.restoreProduct(req.params.id as string);
      const response: ApiResponse = {
        success: true,
        message: 'Product restored successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error restoring product: ${error}`);
      this.sendError(res, error, 'Failed to restore product');
    }
  };

  // ==========================
  // SPECIAL LISTINGS
  // ==========================

  public getProductsByBrand = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products = await this.productService.getProductsByBrand(
        (req.params.brandId as string).replace(/-/g, ' ')
      );
      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'Products fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching products by brand: ${error}`);
      this.sendError(res, error, 'Failed to fetch products by brand');
    }
  };

  public getProductsByCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    // try {
    //   const products = await this.productService.getProductsByCategory(
    //     (req.params.categoryId as string).replace(/-/g, ' ')
    //   );
    //   const response: ApiResponse = {
    //     success: true,
    //     data: products,
    //     message: 'Products fetched successfully',
    //     timestamp: new Date().toISOString(),
    //   };
    //   res.status(200).json(response);
    // } catch (error) {
    //   logger.error(`Error fetching products by category: ${error}`);
    //   this.sendError(res, error, 'Failed to fetch products by category');
    // }
  };

  public getFeaturedProducts = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products = await this.productService.getFeaturedProducts();
      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'Featured products fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching featured products: ${error}`);
      this.sendError(res, error, 'Failed to fetch featured products');
    }
  };

  public getNewArrivals = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products = await this.productService.getNewArrivals();
      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'New arrivals fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching new arrivals: ${error}`);
      this.sendError(res, error, 'Failed to fetch new arrivals');
    }
  };

  public getBestSellers = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products = await this.productService.getBestSellers();
      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'Best sellers fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching best sellers: ${error}`);
      this.sendError(res, error, 'Failed to fetch best sellers');
    }
  };

  // ==========================
  // VARIANTS
  // ==========================

  public createVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const variant = await this.productService.createVariant(
        (req.params.productId as string).replace(/-/g, ' '),
        req.body
      );
      const response: ApiResponse = {
        success: true,
        data: variant,
        message: 'Variant created successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error creating variant: ${error}`);
      this.sendError(res, error, 'Failed to create variant');
    }
  };

  public updateVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const variant = await this.productService.updateVariant(
        (req.params.variantId as string).replace(/-/g, ' '),
        req.body
      );
      const response: ApiResponse = {
        success: true,
        data: variant,
        message: 'Variant updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating variant: ${error}`);
      this.sendError(res, error, 'Failed to update variant');
    }
  };

  public deleteVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteVariant(
        (req.params.variantId as string).replace(/-/g, ' ')
      );
      const response: ApiResponse = {
        success: true,
        message: 'Variant deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting variant: ${error}`);
      this.sendError(res, error, 'Failed to delete variant');
    }
  };

  // ==========================
  // IMAGES
  // ==========================

  public addImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const image = await this.productService.addImage(
        (req.params.productId as string).replace(/-/g, ' '),
        req.body
      );
      const response: ApiResponse = {
        success: true,
        data: image,
        message: 'Image added successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error adding image: ${error}`);
      this.sendError(res, error, 'Failed to add image');
    }
  };

  public deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteImage(
        (req.params.imageId as string).replace(/-/g, ' ')
      );
      const response: ApiResponse = {
        success: true,
        message: 'Image deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting image: ${error}`);
      this.sendError(res, error, 'Failed to delete image');
    }
  };

  // ==========================
  // ATTRIBUTES
  // ==========================

  public addAttribute = async (req: Request, res: Response): Promise<void> => {
    try {
      const attribute = await this.productService.addAttribute(
        String(req.params.productId),
        req.body
      );
      const response: ApiResponse = {
        success: true,
        data: attribute,
        message: 'Attribute added successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`Error adding attribute: ${error}`);
      this.sendError(res, error, 'Failed to add attribute');
    }
  };

  public deleteAttribute = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      await this.productService.deleteAttribute(
        (req.params.attributeId as string).replace(/-/g, ' ')
      );
      const response: ApiResponse = {
        success: true,
        message: 'Attribute deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error deleting attribute: ${error}`);
      this.sendError(res, error, 'Failed to delete attribute');
    }
  };

  // ==========================
  // RELATED PRODUCTS
  // ==========================

  public getRelatedProducts = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const products = await this.productService.getRelatedProducts(
        (req.params.productId as string).replace(/-/g, ' ')
      );
      const response: ApiResponse = {
        success: true,
        data: products,
        message: 'Related products fetched successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching related products: ${error}`);
      this.sendError(res, error, 'Failed to fetch related products');
    }
  };

  // ==========================
  // UTILS
  // ==========================

  private sendError(res: Response, error: unknown, message: string): void {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error',
      message,
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
}
