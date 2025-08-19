import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { PrismaProductRepository } from '../repositories/prisma/ProductRepository';
import { Product, ProductStatus, StockStatus } from '../types/common';

interface CreateProductData {
  name: string;
  description: string;
  sellingPrice?: number;
  mrp?: number;
  costPrice?: number;
  categoryId?: string | null;
  stockStatus?: StockStatus;
  status?: ProductStatus;
}

interface UpdateProductData extends Partial<CreateProductData> {}

export class ProductService {
  private productRepository: IProductRepository;

  constructor() {
    this.productRepository = new PrismaProductRepository();
  }

  public async getAllProducts(params: any) {
    return this.productRepository.findAll();
  }

  public async getProductById(productId: string): Promise<Product> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new Error('Product not found');
    return product;
  }

  public async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);
    if (!product) throw new Error('Product not found');
    return product;
  }

  public async createProduct(data: CreateProductData): Promise<Product> {
    const existing = await this.productRepository.findByName(data.name);
    if (existing) throw new Error('Product with this name already exists');

    const product: Product = {
      id: 'temp-id', // repo will override
      name: data.name,
      description: data.description,
      sellingPrice: data.sellingPrice ?? 0,
      mrp: data.mrp ?? 0,
      costPrice: data.costPrice ?? 0, // FIX 1
      status: data.status ?? ProductStatus.ACTIVE,
      stockStatus: data.stockStatus ?? StockStatus.OUT_OF_STOCK,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.productRepository.create(product);
  }

  public async updateProduct(
    productId: string,
    data: UpdateProductData
  ): Promise<Product> {
    const updated = await this.productRepository.update(productId, {
      ...data,
      updatedAt: new Date(),
    });

    if (!updated) throw new Error('Product not found'); // FIX 2
    return updated;
  }

  public async deleteProduct(productId: string) {
    return this.productRepository.delete(productId);
  }

  public async softDeleteProduct(id: string) {
    const updated = await this.productRepository.update(id, {
      deletedAt: new Date(),
    });
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  public async restoreProduct(id: string) {
    const updated = await this.productRepository.update(id, {
      deletedAt: null,
    });
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  public async getProductsByBrand(brandId: string) {
    return this.productRepository.findByBrandId(brandId);
  }

  // public async getProductsByCategory(categoryId: string) {
  //   return this.productRepository.findByCategoryId(categoryId);
  // }

  public async getFeaturedProducts() {
    return this.productRepository.findFeatured();
  }

  public async getNewArrivals() {
    return this.productRepository.findNewArrivals();
  }

  public async getBestSellers() {
    return this.productRepository.findBestSellers();
  }

  public async createVariant(productId: string, data: any) {
    return this.productRepository.createVariant(productId, data);
  }

  public async updateVariant(variantId: string, data: any) {
    return this.productRepository.updateVariant(variantId, data);
  }

  public async deleteVariant(variantId: string) {
    return this.productRepository.deleteVariant(variantId);
  }

  public async addImage(productId: string, data: any) {
    return this.productRepository.addImage(productId, data);
  }

  public async deleteImage(imageId: string) {
    return this.productRepository.deleteImage(imageId);
  }

  public async addAttribute(productId: string, data: any) {
    return this.productRepository.addAttribute(productId, data);
  }

  public async deleteAttribute(attributeId: string) {
    return this.productRepository.deleteAttribute(attributeId);
  }

  public async getRelatedProducts(productId: string) {
    return this.productRepository.findRelated(productId);
  }
}
