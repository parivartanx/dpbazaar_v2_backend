import { Product } from '../../types/common';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(id: string, productData: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;

  // Extra methods for ProductService
  findByBrandId(brandId: string): Promise<Product[]>;
  findFeatured(): Promise<Product[]>;
  findNewArrivals(): Promise<Product[]>;
  findBestSellers(): Promise<Product[]>;
  createVariant(productId: string, data: any): Promise<any>;
  updateVariant(variantId: string, data: any): Promise<any>;
  deleteVariant(variantId: string): Promise<boolean>;
  addImage(productId: string, data: any): Promise<any>;
  deleteImage(imageId: string): Promise<boolean>;
  addAttribute(productId: string, data: any): Promise<any>;
  deleteAttribute(attributeId: string): Promise<boolean>;
  findRelated(productId: string): Promise<Product[]>;
}
