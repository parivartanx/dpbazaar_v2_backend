// import { IProductRepository } from '../repositories/interfaces/IProductRepository';
// import { PrismaProductRepository } from '../repositories/prisma/ProductRepository';
// import { Product, ProductStatus, StockStatus } from '../types/common';

// interface CreateProductData {
//   name: string;
//   description: string;
//   sellingPrice?: number;
//   mrp?: number;
//   costPrice?: number;
//   categoryId?: string | null;
//   stockStatus?: StockStatus;
//   status?: ProductStatus;
// }

// interface UpdateProductData extends Partial<CreateProductData> {}

// export class ProductService {
//   private productRepository: IProductRepository;

//   constructor() {
//     this.productRepository = new PrismaProductRepository();
//   }

//   public async getAllProducts(params: any) {
//     return this.productRepository.findAll();
//   }

//   public async getProductById(productId: string): Promise<Product> {
//     const product = await this.productRepository.findById(productId);
//     if (!product) throw new Error('Product not found');
//     return product;
//   }

//   public async getProductBySlug(slug: string): Promise<Product> {
//     const product = await this.productRepository.findBySlug(slug);
//     if (!product) throw new Error('Product not found');
//     return product;
//   }

//   public async createProduct(data: CreateProductData): Promise<Product> {
//     const existing = await this.productRepository.findByName(data.name);
//     if (existing) throw new Error('Product with this name already exists');

//     const product: Product = {
//       id: 'temp-id', // repo will override
//       name: data.name,
//       description: data.description,
//       sellingPrice: data.sellingPrice ?? 0,
//       mrp: data.mrp ?? 0,
//       costPrice: data.costPrice ?? 0, // FIX 1
//       status: data.status ?? ProductStatus.ACTIVE,
//       stockStatus: data.stockStatus ?? StockStatus.OUT_OF_STOCK,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     return this.productRepository.create(product);
//   }

//   public async updateProduct(
//     productId: string,
//     data: UpdateProductData
//   ): Promise<Product> {
//     const updated = await this.productRepository.update(productId, {
//       ...data,
//       updatedAt: new Date(),
//     });

//     if (!updated) throw new Error('Product not found'); // FIX 2
//     return updated;
//   }

//   public async deleteProduct(productId: string) {
//     return this.productRepository.delete(productId);
//   }

//   public async softDeleteProduct(id: string) {
//     const updated = await this.productRepository.update(id, {
//       deletedAt: new Date(),
//     });
//     if (!updated) throw new Error('Product not found');
//     return updated;
//   }

//   public async restoreProduct(id: string) {
//     const updated = await this.productRepository.update(id, {
//       deletedAt: null,
//     });
//     if (!updated) throw new Error('Product not found');
//     return updated;
//   }

//   public async getProductsByBrand(brandId: string) {
//     return this.productRepository.findByBrandId(brandId);
//   }

//   // public async getProductsByCategory(categoryId: string) {
//   //   return this.productRepository.findByCategoryId(categoryId);
//   // }

//   public async getFeaturedProducts() {
//     return this.productRepository.findFeatured();
//   }

//   public async getNewArrivals() {
//     return this.productRepository.findNewArrivals();
//   }

//   public async getBestSellers() {
//     return this.productRepository.findBestSellers();
//   }

//   public async createVariant(productId: string, data: any) {
//     return this.productRepository.createVariant(productId, data);
//   }

//   public async updateVariant(variantId: string, data: any) {
//     return this.productRepository.updateVariant(variantId, data);
//   }

//   public async deleteVariant(variantId: string) {
//     return this.productRepository.deleteVariant(variantId);
//   }

//   public async addImage(productId: string, data: any) {
//     return this.productRepository.addImage(productId, data);
//   }

//   public async deleteImage(imageId: string) {
//     return this.productRepository.deleteImage(imageId);
//   }

//   public async addAttribute(productId: string, data: any) {
//     return this.productRepository.addAttribute(productId, data);
//   }

//   public async deleteAttribute(attributeId: string) {
//     return this.productRepository.deleteAttribute(attributeId);
//   }

//   public async getRelatedProducts(productId: string) {
//     return this.productRepository.findRelated(productId);
//   }
// }

//======================
//product controller ka code
//======================

// import { Request, Response } from 'express';
// import { ProductService } from '../services/product.service';
// import { logger } from '../utils/logger';
// import { ApiResponse } from '../types/common';
// // import { string } from 'joi';

// export class ProductController {
//   private productService: ProductService;

//   constructor() {
//     this.productService = new ProductService();
//   }

//   // ==========================
//   // PRODUCTS CRUD & LISTING
//   // ==========================

//   public getAllProducts = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const {
//         page,
//         limit,
//         search,
//         sortBy,
//         sortOrder,
//         status,
//         brandId,
//         categoryId,
//       } = req.query;
//       const products = await this.productService.getAllProducts({
//         page: Number(page) || 1,
//         limit: Number(limit) || 10,
//         search: String(search || ''),
//         sortBy: String(sortBy || 'createdAt'),
//         sortOrder: String(sortOrder || 'desc'),
//         status: status ? String(status) : undefined,
//         brandId: brandId ? String(brandId) : undefined,
//         categoryId: categoryId ? String(categoryId) : undefined,
//       });

//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'Products fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching products: ${error}`);
//       this.sendError(res, error, 'Failed to fetch products');
//     }
//   };

//   public getProductById = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const product = await this.productService.getProductById(
//         req.params.id as string
//       );
//       if (!product) {
//         res.status(404).json({ success: false, message: 'Product not found' });
//         return;
//       }
//       const response: ApiResponse = {
//         success: true,
//         data: product,
//         message: 'Product fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching product: ${error}`);
//       this.sendError(res, error, 'Failed to fetch product');
//     }
//   };

//   public getProductBySlug = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const product = await this.productService.getProductBySlug(
//         (req.params.slug as string).replace(/-/g, ' ')
//       );
//       if (!product) {
//         res.status(404).json({ success: false, message: 'Product not found' });
//         return;
//       }
//       const response: ApiResponse = {
//         success: true,
//         data: product,
//         message: 'Product fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching product by slug: ${error}`);
//       this.sendError(res, error, 'Failed to fetch product');
//     }
//   };

//   public createProduct = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const createdProduct = await this.productService.createProduct(req.body);
//       const response: ApiResponse = {
//         success: true,
//         data: createdProduct,
//         message: 'Product created successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(201).json(response);
//     } catch (error) {
//       logger.error(`Error creating product: ${error}`);
//       this.sendError(res, error, 'Failed to create product');
//     }
//   };

//   public updateProduct = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const updatedProduct = await this.productService.updateProduct(
//         req.params.id as string,
//         req.body
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: updatedProduct,
//         message: 'Product updated successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error updating product: ${error}`);
//       this.sendError(res, error, 'Failed to update product');
//     }
//   };

//   public deleteProduct = async (req: Request, res: Response): Promise<void> => {
//     try {
//       await this.productService.deleteProduct(req.params.id as string);
//       const response: ApiResponse = {
//         success: true,
//         message: 'Product deleted successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error deleting product: ${error}`);
//       this.sendError(res, error, 'Failed to delete product');
//     }
//   };

//   public softDeleteProduct = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       await this.productService.softDeleteProduct(req.params.id as string);
//       const response: ApiResponse = {
//         success: true,
//         message: 'Product soft deleted successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error soft deleting product: ${error}`);
//       this.sendError(res, error, 'Failed to soft delete product');
//     }
//   };

//   public restoreProduct = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       await this.productService.restoreProduct(req.params.id as string);
//       const response: ApiResponse = {
//         success: true,
//         message: 'Product restored successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error restoring product: ${error}`);
//       this.sendError(res, error, 'Failed to restore product');
//     }
//   };

//   // ==========================
//   // SPECIAL LISTINGS
//   // ==========================

//   public getProductsByBrand = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const products = await this.productService.getProductsByBrand(
//         (req.params.brandId as string).replace(/-/g, ' ')
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'Products fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching products by brand: ${error}`);
//       this.sendError(res, error, 'Failed to fetch products by brand');
//     }
//   };

//   public getProductsByCategory = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     // try {
//     //   const products = await this.productService.getProductsByCategory(
//     //     (req.params.categoryId as string).replace(/-/g, ' ')
//     //   );
//     //   const response: ApiResponse = {
//     //     success: true,
//     //     data: products,
//     //     message: 'Products fetched successfully',
//     //     timestamp: new Date().toISOString(),
//     //   };
//     //   res.status(200).json(response);
//     // } catch (error) {
//     //   logger.error(`Error fetching products by category: ${error}`);
//     //   this.sendError(res, error, 'Failed to fetch products by category');
//     // }
//   };

//   public getFeaturedProducts = async (
//     _req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const products = await this.productService.getFeaturedProducts();
//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'Featured products fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching featured products: ${error}`);
//       this.sendError(res, error, 'Failed to fetch featured products');
//     }
//   };

//   public getNewArrivals = async (
//     _req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const products = await this.productService.getNewArrivals();
//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'New arrivals fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching new arrivals: ${error}`);
//       this.sendError(res, error, 'Failed to fetch new arrivals');
//     }
//   };

//   public getBestSellers = async (
//     _req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const products = await this.productService.getBestSellers();
//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'Best sellers fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching best sellers: ${error}`);
//       this.sendError(res, error, 'Failed to fetch best sellers');
//     }
//   };

//   // ==========================
//   // VARIANTS
//   // ==========================

//   public createVariant = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const variant = await this.productService.createVariant(
//         (req.params.productId as string).replace(/-/g, ' '),
//         req.body
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: variant,
//         message: 'Variant created successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(201).json(response);
//     } catch (error) {
//       logger.error(`Error creating variant: ${error}`);
//       this.sendError(res, error, 'Failed to create variant');
//     }
//   };

//   public updateVariant = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const variant = await this.productService.updateVariant(
//         (req.params.variantId as string).replace(/-/g, ' '),
//         req.body
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: variant,
//         message: 'Variant updated successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error updating variant: ${error}`);
//       this.sendError(res, error, 'Failed to update variant');
//     }
//   };

//   public deleteVariant = async (req: Request, res: Response): Promise<void> => {
//     try {
//       await this.productService.deleteVariant(
//         (req.params.variantId as string).replace(/-/g, ' ')
//       );
//       const response: ApiResponse = {
//         success: true,
//         message: 'Variant deleted successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error deleting variant: ${error}`);
//       this.sendError(res, error, 'Failed to delete variant');
//     }
//   };

//   // ==========================
//   // IMAGES
//   // ==========================

//   public addImage = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const image = await this.productService.addImage(
//         (req.params.productId as string).replace(/-/g, ' '),
//         req.body
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: image,
//         message: 'Image added successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(201).json(response);
//     } catch (error) {
//       logger.error(`Error adding image: ${error}`);
//       this.sendError(res, error, 'Failed to add image');
//     }
//   };

//   public deleteImage = async (req: Request, res: Response): Promise<void> => {
//     try {
//       await this.productService.deleteImage(
//         (req.params.imageId as string).replace(/-/g, ' ')
//       );
//       const response: ApiResponse = {
//         success: true,
//         message: 'Image deleted successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error deleting image: ${error}`);
//       this.sendError(res, error, 'Failed to delete image');
//     }
//   };

//   // ==========================
//   // ATTRIBUTES
//   // ==========================

//   public addAttribute = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const attribute = await this.productService.addAttribute(
//         String(req.params.productId),
//         req.body
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: attribute,
//         message: 'Attribute added successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(201).json(response);
//     } catch (error) {
//       logger.error(`Error adding attribute: ${error}`);
//       this.sendError(res, error, 'Failed to add attribute');
//     }
//   };

//   public deleteAttribute = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       await this.productService.deleteAttribute(
//         (req.params.attributeId as string).replace(/-/g, ' ')
//       );
//       const response: ApiResponse = {
//         success: true,
//         message: 'Attribute deleted successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error deleting attribute: ${error}`);
//       this.sendError(res, error, 'Failed to delete attribute');
//     }
//   };

//   // ==========================
//   // RELATED PRODUCTS
//   // ==========================

//   public getRelatedProducts = async (
//     req: Request,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const products = await this.productService.getRelatedProducts(
//         (req.params.productId as string).replace(/-/g, ' ')
//       );
//       const response: ApiResponse = {
//         success: true,
//         data: products,
//         message: 'Related products fetched successfully',
//         timestamp: new Date().toISOString(),
//       };
//       res.status(200).json(response);
//     } catch (error) {
//       logger.error(`Error fetching related products: ${error}`);
//       this.sendError(res, error, 'Failed to fetch related products');
//     }
//   };

//   // ==========================
//   // UTILS
//   // ==========================

//   private sendError(res: Response, error: unknown, message: string): void {
//     const response: ApiResponse = {
//       success: false,
//       error: error instanceof Error ? error.message : 'Internal Server Error',
//       message,
//       timestamp: new Date().toISOString(),
//     };
//     res.status(500).json(response);
//   }
// }

//==========================
// product routesss
//===========================

// import { Router } from 'express';
// import { ProductController } from '../controllers/product.controllers';
// import { isAccessAllowed } from '../middlewares/isAccessAllowed';
// import { validateJoi } from '../middlewares/validateJoi';
// import {
//   createProductSchema,
//   updateProductSchema,
// } from '../validators/product.validation';

// const router = Router();
// const productController = new ProductController();

// router.get('/', productController.getAllProducts);
// router.get('/slug/:slug', productController.getProductBySlug);
// router.get('/:id', productController.getProductById);
// router.post(
//   '/',
//   isAccessAllowed('ADMIN'),
//   validateJoi(createProductSchema),
//   productController.createProduct
// );
// router.put('/:id', isAccessAllowed('ADMIN'), productController.updateProduct);
// router.delete(
//   '/:id',
//   isAccessAllowed('ADMIN'),
//   productController.softDeleteProduct
// );
// router.patch(
//   '/:id/restore',
//   isAccessAllowed('ADMIN'),
//   validateJoi(updateProductSchema),
//   productController.restoreProduct
// );
// router.get('/category/:id', productController.getProductsByCategory);
// router.get('/brand/:id', productController.getProductsByBrand);
// router.get('/featured', productController.getFeaturedProducts);
// router.get('/new-arrivals', productController.getNewArrivals);
// router.get('/best-sellers', productController.getBestSellers);
// router.get('/:id/related', productController.getRelatedProducts);

// // Publish product
// // router.patch("/:id/publish",isAccessAllowed("ADMIN") , productController.publishProduct);

// // Unpublish product
// // router.patch("/:id/unpublish",isAccessAllowed("ADMIN") , productController.unpublishProduct);

// export { router as productRoutes };

//====================
// product repository
//====================

// import { PrismaClient, Prisma } from '@prisma/client';
// import { IProductRepository } from '../interfaces/IProductRepository';
// import { Product } from '../../types/common';

// export class PrismaProductRepository implements IProductRepository {
//   private prisma: PrismaClient;

//   constructor() {
//     this.prisma = new PrismaClient();
//   }

//   // -----------------------
//   // Create
//   // -----------------------
//   public async create(product: Product): Promise<Product> {
//     // build generic data object (use `any` to avoid strict-exact-optional issues)
//     const data: any = {
//       sku: product.sku || `SKU-${Date.now()}`,
//       name: product.name,
//       slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
//       description: product.description,
//       shortDescription: product.shortDescription ?? null,
//       mrp: product.mrp ?? 0,
//       sellingPrice: product.sellingPrice ?? 0,
//       costPrice: product.costPrice ?? null,
//       taxRate: product.taxRate ?? 0,
//       hsnCode: product.hsnCode ?? null,
//       status: product.status,
//       stockStatus: product.stockStatus ?? 'OUT_OF_STOCK',
//       weight: product.weight ?? null,
//       dimensions: product.dimensions ?? Prisma.JsonNull,
//       metaTitle: product.metaTitle ?? null,
//       metaDescription: product.metaDescription ?? null,
//       metaKeywords: product.metaKeywords ?? [],
//       isFeatured: product.isFeatured ?? false,
//       isNewArrival: product.isNewArrival ?? false,
//       isBestSeller: product.isBestSeller ?? false,
//       isReturnable: product.isReturnable ?? true,
//       returnPeriodDays: product.returnPeriodDays ?? 7,
//       viewCount: product.viewCount ?? 0,
//       salesCount: product.salesCount ?? 0,
//       avgRating: product.avgRating ?? 0,
//       totalReviews: product.totalReviews ?? 0,
//       tags: product.tags ?? [],
//       metadata: product.metadata ?? Prisma.JsonNull,
//       deletedAt: product.deletedAt ?? null,
//       publishedAt: product.publishedAt ?? null,
//       createdAt: product.createdAt ?? new Date(),
//       updatedAt: product.updatedAt ?? new Date(),
//     };

//     // attach FK scalars if present (safer generic approach)
//     if (product.brandId) data.brandId = product.brandId;
//     if (product.vendorId) data.vendorId = product.vendorId;
//     if ((product as any).categoryId)
//       data.categoryId = (product as any).categoryId;

//     const created = await this.prisma.product.create({ data: data as any });
//     return created as unknown as Product;
//   }

//   // -----------------------
//   // Read
//   // -----------------------
//   public async findById(id: string): Promise<Product | null> {
//     const p = await this.prisma.product.findUnique({ where: { id } });
//     return p as unknown as Product | null;
//   }

//   public async findByName(name: string): Promise<Product | null> {
//     const p = await this.prisma.product.findFirst({ where: { name } });
//     return p as unknown as Product | null;
//   }

//   public async findBySlug(slug: string): Promise<Product | null> {
//     const p = await this.prisma.product.findUnique({ where: { slug } });
//     return p as unknown as Product | null;
//   }

//   public async findAll(): Promise<Product[]> {
//     const rows = await this.prisma.product.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//     return rows as unknown as Product[];
//   }

//   // -----------------------
//   // Update
//   // -----------------------
//   public async update(
//     id: string,
//     productData: Partial<Product>
//   ): Promise<Product | null> {
//     const data: any = { ...productData };

//     // explicit handling for fields that might need normalization
//     if (productData.dimensions === undefined) data.dimensions = Prisma.JsonNull;
//     if (productData.metadata === undefined) data.metadata = Prisma.JsonNull;
//     if (productData.brandId !== undefined) data.brandId = productData.brandId;
//     if (productData.vendorId !== undefined)
//       data.vendorId = productData.vendorId;
//     if ((productData as any).categoryId !== undefined)
//       data.categoryId = (productData as any).categoryId;

//     data.updatedAt = new Date();

//     try {
//       const updated = await this.prisma.product.update({
//         where: { id },
//         data: data as any,
//       });
//       return updated as unknown as Product;
//     } catch (err: any) {
//       // If record not found, Prisma throws P2025 — return null to match interface
//       if (err?.code === 'P2025') return null;
//       throw err;
//     }
//   }

//   // -----------------------
//   // Delete
//   // -----------------------
//   public async delete(id: string): Promise<boolean> {
//     try {
//       await this.prisma.product.delete({ where: { id } });
//       return true;
//     } catch (err: any) {
//       if (err?.code === 'P2025') return false;
//       throw err;
//     }
//   }

//   // -----------------------
//   // Extra query helpers (basic implementations)
//   // -----------------------
//   public async findByBrandId(brandId: string): Promise<Product[]> {
//     const rows = await this.prisma.product.findMany({
//       where: { brandId },
//       orderBy: { createdAt: 'desc' },
//     });
//     return rows as unknown as Product[];
//   }

//   //   public async findByCategoryId(categoryId: string): Promise<Product[]> {
//   //     const rows = await this.prisma.product.findMany({
//   //       where: { categoryId },
//   //       orderBy: { createdAt: 'desc' },
//   //     });
//   //     return rows as unknown as Product[];
//   //   }

//   public async findFeatured(): Promise<Product[]> {
//     const rows = await this.prisma.product.findMany({
//       where: { isFeatured: true },
//       orderBy: { createdAt: 'desc' },
//     });
//     return rows as unknown as Product[];
//   }

//   public async findNewArrivals(): Promise<Product[]> {
//     const rows = await this.prisma.product.findMany({
//       where: { isNewArrival: true },
//       orderBy: { createdAt: 'desc' },
//     });
//     return rows as unknown as Product[];
//   }

//   public async findBestSellers(): Promise<Product[]> {
//     const rows = await this.prisma.product.findMany({
//       where: { isBestSeller: true },
//       orderBy: { salesCount: 'desc' },
//     });
//     return rows as unknown as Product[];
//   }

//   // -----------------------
//   // Variant / image / attribute methods
//   // -----------------------
//   // THESE are schema-specific — currently they throw a clear error.
//   // Provide your schema.prisma and I will implement them properly.

//   public async createVariant(productId: string, data: any): Promise<any> {
//     throw new Error(
//       'createVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
//     );
//   }

//   public async updateVariant(variantId: string, data: any): Promise<any> {
//     throw new Error(
//       'updateVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
//     );
//   }

//   public async deleteVariant(variantId: string): Promise<boolean> {
//     throw new Error(
//       'deleteVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
//     );
//   }

//   public async addImage(productId: string, data: any): Promise<any> {
//     throw new Error(
//       'addImage not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductImage logic.'
//     );
//   }

//   public async deleteImage(imageId: string): Promise<boolean> {
//     throw new Error(
//       'deleteImage not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductImage logic.'
//     );
//   }

//   public async addAttribute(productId: string, data: any): Promise<any> {
//     throw new Error(
//       'addAttribute not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductAttribute logic.'
//     );
//   }

//   public async deleteAttribute(attributeId: string): Promise<boolean> {
//     throw new Error(
//       'deleteAttribute not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductAttribute logic.'
//     );
//   }

//   // Related products — example heuristic: same category, exclude self, limit 10
//   public async findRelated(productId: string): Promise<Product[]> {
//     const p = await this.prisma.product.findUnique({
//       where: { id: productId },
//       //   select: { categoryId: true },
//     });

//     if (!p) return []; // || !p.categoryId

//     const rows = await this.prisma.product.findMany({
//       where: { NOT: { id: productId } }, // categoryId: p.categoryId,
//       take: 10,
//     });

//     return rows as unknown as Product[];
//   }
// }

//=====================
//iproduct repository
//=====================

// import { Product } from '../../types/common';

// export interface IProductRepository {
//   create(product: Product): Promise<Product>;
//   findById(id: string): Promise<Product | null>;
//   findByName(name: string): Promise<Product | null>;
//   findBySlug(slug: string): Promise<Product | null>;
//   findAll(): Promise<Product[]>;
//   update(id: string, productData: Partial<Product>): Promise<Product | null>;
//   delete(id: string): Promise<boolean>;

//   // Extra methods for ProductService
//   findByBrandId(brandId: string): Promise<Product[]>;
//   findFeatured(): Promise<Product[]>;
//   findNewArrivals(): Promise<Product[]>;
//   findBestSellers(): Promise<Product[]>;
//   createVariant(productId: string, data: any): Promise<any>;
//   updateVariant(variantId: string, data: any): Promise<any>;
//   deleteVariant(variantId: string): Promise<boolean>;
//   addImage(productId: string, data: any): Promise<any>;
//   deleteImage(imageId: string): Promise<boolean>;
//   addAttribute(productId: string, data: any): Promise<any>;
//   deleteAttribute(attributeId: string): Promise<boolean>;
//   findRelated(productId: string): Promise<Product[]>;
// }
