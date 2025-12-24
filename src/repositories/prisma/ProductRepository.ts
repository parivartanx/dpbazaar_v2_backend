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

  async getAllWithFilters(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    status?: string;
    stockStatus?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
  }): Promise<{ products: any[]; totalCount: number }> {
    console.log('ProductRepository.getAllWithFilters called with filters:', filters);
    
    const {
      page = 1,
      limit = 10,
      search,
      category,
      brand,
      status,
      stockStatus,
      isFeatured,
      isNewArrival,
      isBestSeller
    } = filters;

    const where: any = {
      deletedAt: null
    };

    // Apply search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Apply category filter
    if (category) {
      where.categories = {
        some: {
          categoryId: category
        }
      };
    }

    // Apply brand filter
    if (brand) {
      where.brandId = brand;
    }

    // Apply status filter
    if (status) {
      where.status = status;
    }

    // Apply stock status filter
    if (stockStatus) {
      where.stockStatus = stockStatus;
    }

    // Apply featured filter
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Apply new arrival filter
    if (isNewArrival !== undefined) {
      where.isNewArrival = isNewArrival;
    }

    // Apply best seller filter
    if (isBestSeller !== undefined) {
      where.isBestSeller = isBestSeller;
    }

    console.log('ProductRepository.getAllWithFilters - where clause:', JSON.stringify(where, null, 2));
    
    // Get products (temporarily excluding inventory until inventory management is implemented)
    const [productsResult, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          inventory: true 
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    console.log(`ProductRepository.getAllWithFilters - found ${totalCount} products, returning ${productsResult.length} products`);
    
    // Transform products to include only required fields
    const products = productsResult.map(product => {
      // Get primary image or first image
      const primaryImage = product.images && product.images.length > 0 
        ? product.images.find(img => img.isPrimary) || product.images[0]
        : null;
      
      // Calculate total stock quantity from all inventory records
      const totalStockQuantity = product.inventory && product.inventory.length > 0 
        ? product.inventory.reduce((sum: number, inv: any) => sum + inv.availableQuantity, 0)
        : 0;
        
      return {
        id: product.id,
        name: product.name,
        image: primaryImage?.url || null,
        sku: product.sku,
        price: Number(product.sellingPrice),
        stockStatus: product.stockStatus,
        status: product.status,
        stockQuantity: totalStockQuantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    return { products, totalCount };
  }

  async getDashboardStats(): Promise<any> {
    // Get total products count
    const totalProducts = await prisma.product.count({
      where: {
        deletedAt: null
      }
    });

    // Get active products count
    const activeProducts = await prisma.product.count({
      where: {
        status: 'ACTIVE',
        deletedAt: null
      }
    });

    // Get draft products count
    const draftProducts = await prisma.product.count({
      where: {
        status: 'DRAFT',
        deletedAt: null
      }
    });

    // Get stock status counts
    const inStockCount = await prisma.product.count({
      where: {
        stockStatus: 'IN_STOCK',
        deletedAt: null
      }
    });

    const lowStockCount = await prisma.product.count({
      where: {
        stockStatus: 'LOW_STOCK',
        deletedAt: null
      }
    });

    const outOfStockCount = await prisma.product.count({
      where: {
        stockStatus: 'OUT_OF_STOCK',
        deletedAt: null
      }
    });

    // Get featured products counts
    const featuredCount = await prisma.product.count({
      where: {
        isFeatured: true,
        deletedAt: null
      }
    });

    const newArrivalsCount = await prisma.product.count({
      where: {
        isNewArrival: true,
        deletedAt: null
      }
    });

    const bestSellersCount = await prisma.product.count({
      where: {
        isBestSeller: true,
        deletedAt: null
      }
    });

    // Get active categories count
    const activeCategories = await prisma.category.count({
      where: {
        isActive: true
      }
    });

    return {
      totalProducts,
      activeProducts,
      draftProducts,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      featuredCount,
      newArrivalsCount,
      bestSellersCount,
      activeCategories
    };
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
}
