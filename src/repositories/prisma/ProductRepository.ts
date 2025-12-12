import { PrismaClient, Product, ProductImage } from '@prisma/client';
import { IProductRepository } from '../interfaces/IProductRepository';

const prisma = new PrismaClient();

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    return prisma.product.findMany({ 
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true,
        variants: true
      } 
    });
  }

  async getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true,
        variants: true,
        attributes: { include: { attributeType: true } }
      },
    });
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true,
        variants: true
      },
    });
  }

  async create(data: any): Promise<Product> {
    // Extract categoryId if present (for backward compatibility)
    const { categoryId, ...productData } = data;
    
    // Build create input
    const createData: any = {
      ...productData,
    };

    // Handle category relation (many-to-many)
    if (categoryId) {
      createData.categories = {
        create: {
          categoryId,
          isPrimary: true
        }
      };
    }

    // Handle brand relation
    if (productData.brandId) {
      createData.brand = {
        connect: { id: productData.brandId }
      };
      delete createData.brandId;
    }

    // Handle vendor relation
    if (productData.vendorId) {
      createData.vendor = {
        connect: { id: productData.vendorId }
      };
      delete createData.vendorId;
    }

    return prisma.product.create({ 
      data: createData,
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true
      }
    });
  }

  async update(id: string, data: any): Promise<Product> {
    // Extract categoryId if present
    const { categoryId, ...productData } = data;
    
    const updateData: any = { ...productData };

    // Handle brand relation
    if (productData.brandId !== undefined) {
      updateData.brand = productData.brandId ? { connect: { id: productData.brandId } } : { disconnect: true };
      delete updateData.brandId;
    }

    // Handle vendor relation
    if (productData.vendorId !== undefined) {
      updateData.vendor = productData.vendorId ? { connect: { id: productData.vendorId } } : { disconnect: true };
      delete updateData.vendorId;
    }

    // Handle category update separately if needed
    if (categoryId !== undefined) {
      // First, delete existing category relations
      await prisma.productCategory.deleteMany({ where: { productId: id } });
      
      // Then create new one if categoryId is provided
      if (categoryId) {
        updateData.categories = {
          create: {
            categoryId,
            isPrimary: true
          }
        };
      }
    }

    return prisma.product.update({ 
      where: { id }, 
      data: updateData,
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true
      }
    });
  }

  async softDelete(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true
      }
    });
  }

  async restore(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: null },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true
      }
    });
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        categories: { some: { categoryId } },
        deletedAt: null
      },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true
      },
    });
  }

  async getByBrand(brandId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        brandId,
        deletedAt: null
      },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true
      },
    });
  }

  async getFeatured(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        isFeatured: true,
        deletedAt: null,
        status: 'ACTIVE'
      },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true
      },
    });
  }

  async getNewArrivals(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        isNewArrival: true,
        deletedAt: null,
        status: 'ACTIVE'
      },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async getBestSellers(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        isBestSeller: true,
        deletedAt: null,
        status: 'ACTIVE'
      },
      include: { 
        images: true,
        categories: { include: { category: true } },
        brand: true
      },
      orderBy: { salesCount: 'desc' },
      take: 20
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

  // Add the missing method
  async getAllWithFilters(filters: any): Promise<{ products: Product[]; totalCount: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      status: 'ACTIVE'
    };

    // Add search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { barcode: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Add category filter
    if (filters.category) {
      where.categories = {
        some: {
          category: {
            slug: filters.category
          }
        }
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: true,
          categories: { include: { category: true } },
          brand: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return { products, totalCount };
  }
}
