import { Product, ProductImage } from '@prisma/client';

export interface IProductRepository {
  // Products
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  create(data: any): Promise<Product>;
  update(id: string, data: any): Promise<Product>;
  softDelete(id: string): Promise<Product>;
  restore(id: string): Promise<Product>;

  // Filters
  getByCategory(categoryId: string): Promise<Product[]>;
  getByBrand(brandId: string): Promise<Product[]>;

  // Special Listings
  getFeatured(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getBestSellers(): Promise<Product[]>;

  // Images
  addProductImage(
    productId: string,
    url: string,
    isPrimary?: boolean
  ): Promise<ProductImage>;
  addProductImagesBulk(
    productId: string,
    urls: string[]
  ): Promise<ProductImage[]>;
  deleteImage(id: string): Promise<void>;
  setPrimaryImage(productId: string, imageId: string): Promise<void>;
}
