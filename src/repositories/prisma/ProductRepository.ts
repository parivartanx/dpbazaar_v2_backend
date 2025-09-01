import { PrismaClient, Product, ProductImage } from '@prisma/client';
import { IProductRepository } from '../interfaces/IProductRepository';

const prisma = new PrismaClient();

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    return prisma.product.findMany({ include: { images: true } });
  }

  async getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: any): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async softDelete(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { categories: { some: { categoryId } } },
      include: { images: true },
    });
  }

  async getByBrand(brandId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { brandId },
      include: { images: true },
    });
  }

  async getFeatured(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isFeatured: true },
      include: { images: true },
    });
  }

  async getNewArrivals(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isNewArrival: true },
      include: { images: true },
    });
  }

  async getBestSellers(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { isBestSeller: true },
      include: { images: true },
    });
  }

  async addProductImage(
    productId: string,
    url: string,
    isPrimary = false
  ): Promise<ProductImage> {
    return prisma.productImage.create({ data: { productId, url, isPrimary } });
  }

  async addProductImagesBulk(
    productId: string,
    urls: string[]
  ): Promise<ProductImage[]> {
    return prisma.$transaction(
      urls.map(url => prisma.productImage.create({ data: { productId, url } }))
    );
  }

  async deleteImage(id: string): Promise<void> {
    await prisma.productImage.delete({ where: { id } });
  }

  async setPrimaryImage(productId: string, imageId: string): Promise<void> {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  }
}
