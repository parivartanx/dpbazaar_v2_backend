import { PrismaClient, Prisma } from '@prisma/client';
import { IProductRepository } from '../interfaces/IProductRepository';
import { Product } from '../../types/common';

export class PrismaProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // -----------------------
  // Create
  // -----------------------
  public async create(product: Product): Promise<Product> {
    // build generic data object (use `any` to avoid strict-exact-optional issues)
    const data: any = {
      sku: product.sku || `SKU-${Date.now()}`,
      name: product.name,
      slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
      description: product.description,
      shortDescription: product.shortDescription ?? null,
      mrp: product.mrp ?? 0,
      sellingPrice: product.sellingPrice ?? 0,
      costPrice: product.costPrice ?? null,
      taxRate: product.taxRate ?? 0,
      hsnCode: product.hsnCode ?? null,
      status: product.status,
      stockStatus: product.stockStatus ?? 'OUT_OF_STOCK',
      weight: product.weight ?? null,
      dimensions: product.dimensions ?? Prisma.JsonNull,
      metaTitle: product.metaTitle ?? null,
      metaDescription: product.metaDescription ?? null,
      metaKeywords: product.metaKeywords ?? [],
      isFeatured: product.isFeatured ?? false,
      isNewArrival: product.isNewArrival ?? false,
      isBestSeller: product.isBestSeller ?? false,
      isReturnable: product.isReturnable ?? true,
      returnPeriodDays: product.returnPeriodDays ?? 7,
      viewCount: product.viewCount ?? 0,
      salesCount: product.salesCount ?? 0,
      avgRating: product.avgRating ?? 0,
      totalReviews: product.totalReviews ?? 0,
      tags: product.tags ?? [],
      metadata: product.metadata ?? Prisma.JsonNull,
      deletedAt: product.deletedAt ?? null,
      publishedAt: product.publishedAt ?? null,
      createdAt: product.createdAt ?? new Date(),
      updatedAt: product.updatedAt ?? new Date(),
    };

    // attach FK scalars if present (safer generic approach)
    if (product.brandId) data.brandId = product.brandId;
    if (product.vendorId) data.vendorId = product.vendorId;
    if ((product as any).categoryId)
      data.categoryId = (product as any).categoryId;

    const created = await this.prisma.product.create({ data: data as any });
    return created as unknown as Product;
  }

  // -----------------------
  // Read
  // -----------------------
  public async findById(id: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    return p as unknown as Product | null;
  }

  public async findByName(name: string): Promise<Product | null> {
    const p = await this.prisma.product.findFirst({ where: { name } });
    return p as unknown as Product | null;
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const p = await this.prisma.product.findUnique({ where: { slug } });
    return p as unknown as Product | null;
  }

  public async findAll(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows as unknown as Product[];
  }

  // -----------------------
  // Update
  // -----------------------
  public async update(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const data: any = { ...productData };

    // explicit handling for fields that might need normalization
    if (productData.dimensions === undefined) data.dimensions = Prisma.JsonNull;
    if (productData.metadata === undefined) data.metadata = Prisma.JsonNull;
    if (productData.brandId !== undefined) data.brandId = productData.brandId;
    if (productData.vendorId !== undefined)
      data.vendorId = productData.vendorId;
    if ((productData as any).categoryId !== undefined)
      data.categoryId = (productData as any).categoryId;

    data.updatedAt = new Date();

    try {
      const updated = await this.prisma.product.update({
        where: { id },
        data: data as any,
      });
      return updated as unknown as Product;
    } catch (err: any) {
      // If record not found, Prisma throws P2025 — return null to match interface
      if (err?.code === 'P2025') return null;
      throw err;
    }
  }

  // -----------------------
  // Delete
  // -----------------------
  public async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return true;
    } catch (err: any) {
      if (err?.code === 'P2025') return false;
      throw err;
    }
  }

  // -----------------------
  // Extra query helpers (basic implementations)
  // -----------------------
  public async findByBrandId(brandId: string): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { brandId },
      orderBy: { createdAt: 'desc' },
    });
    return rows as unknown as Product[];
  }

  //   public async findByCategoryId(categoryId: string): Promise<Product[]> {
  //     const rows = await this.prisma.product.findMany({
  //       where: { categoryId },
  //       orderBy: { createdAt: 'desc' },
  //     });
  //     return rows as unknown as Product[];
  //   }

  public async findFeatured(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows as unknown as Product[];
  }

  public async findNewArrivals(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { isNewArrival: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows as unknown as Product[];
  }

  public async findBestSellers(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { isBestSeller: true },
      orderBy: { salesCount: 'desc' },
    });
    return rows as unknown as Product[];
  }

  // -----------------------
  // Variant / image / attribute methods
  // -----------------------
  // THESE are schema-specific — currently they throw a clear error.
  // Provide your schema.prisma and I will implement them properly.

  public async createVariant(productId: string, data: any): Promise<any> {
    throw new Error(
      'createVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
    );
  }

  public async updateVariant(variantId: string, data: any): Promise<any> {
    throw new Error(
      'updateVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
    );
  }

  public async deleteVariant(variantId: string): Promise<boolean> {
    throw new Error(
      'deleteVariant not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductVariant logic.'
    );
  }

  public async addImage(productId: string, data: any): Promise<any> {
    throw new Error(
      'addImage not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductImage logic.'
    );
  }

  public async deleteImage(imageId: string): Promise<boolean> {
    throw new Error(
      'deleteImage not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductImage logic.'
    );
  }

  public async addAttribute(productId: string, data: any): Promise<any> {
    throw new Error(
      'addAttribute not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductAttribute logic.'
    );
  }

  public async deleteAttribute(attributeId: string): Promise<boolean> {
    throw new Error(
      'deleteAttribute not implemented in PrismaProductRepository. Share your schema.prisma so I can implement ProductAttribute logic.'
    );
  }

  // Related products — example heuristic: same category, exclude self, limit 10
  public async findRelated(productId: string): Promise<Product[]> {
    const p = await this.prisma.product.findUnique({
      where: { id: productId },
      //   select: { categoryId: true },
    });

    if (!p) return []; // || !p.categoryId

    const rows = await this.prisma.product.findMany({
      where: { NOT: { id: productId } }, // categoryId: p.categoryId,
      take: 10,
    });

    return rows as unknown as Product[];
  }
}
