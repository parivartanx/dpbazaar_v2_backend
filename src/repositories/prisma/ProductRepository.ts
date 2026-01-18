import { Product, ProductImage } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IProductRepository } from '../interfaces/IProductRepository';

export class ProductRepository implements IProductRepository {
  async getAll(): Promise<Product[]> {
    return prisma.product.findMany({
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
        variants: true,
      },
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
    barcode?: string;
  }): Promise<{ products: any[]; totalCount: number }> {
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
      isBestSeller,
      barcode,
    } = filters;

    const where: any = {
      deletedAt: null,
    };

    // Apply search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Apply category filter
    if (category) {
      where.categories = {
        some: {
          categoryId: category,
        },
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

    if (barcode) {
      where.barcode = filters.barcode;
    }

    // Get products (temporarily excluding inventory until inventory management is implemented)
    const [productsResult, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          inventory: true,
          categories: { include: { category: true } },
          brand: true,
          variants: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Return full product structure so controllers can transform as needed
    // This allows both extractProductCardFields and transformCommonImageFields to work correctly
    return { products: productsResult, totalCount };
  }

  async getDashboardStats(): Promise<any> {
    // Get total products count
    const totalProducts = await prisma.product.count({
      where: {
        deletedAt: null,
      },
    });

    // Get active products count
    const activeProducts = await prisma.product.count({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });

    // Get draft products count
    const draftProducts = await prisma.product.count({
      where: {
        status: 'DRAFT',
        deletedAt: null,
      },
    });

    // Get stock status counts
    const inStockCount = await prisma.product.count({
      where: {
        stockStatus: 'IN_STOCK',
        deletedAt: null,
      },
    });

    const lowStockCount = await prisma.product.count({
      where: {
        stockStatus: 'LOW_STOCK',
        deletedAt: null,
      },
    });

    const outOfStockCount = await prisma.product.count({
      where: {
        stockStatus: 'OUT_OF_STOCK',
        deletedAt: null,
      },
    });

    // Get featured products counts
    const featuredCount = await prisma.product.count({
      where: {
        isFeatured: true,
        deletedAt: null,
      },
    });

    const newArrivalsCount = await prisma.product.count({
      where: {
        isNewArrival: true,
        deletedAt: null,
      },
    });

    const bestSellersCount = await prisma.product.count({
      where: {
        isBestSeller: true,
        deletedAt: null,
      },
    });

    // Get active categories count
    const activeCategories = await prisma.category.count({
      where: {
        isActive: true,
      },
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
      activeCategories,
    };
  }

  async getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
        variants: {
          include: {
            inventory: {
              include: {
                warehouse: true,
              },
            },
          },
        },
        attributes: { include: { attributeType: true } },
        inventory: {
          include: {
            warehouse: true,
          },
        },
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
        variants: true,
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
          isPrimary: true,
        },
      };
    }

    // Handle brand relation
    if (productData.brandId) {
      createData.brand = {
        connect: { id: productData.brandId },
      };
      delete createData.brandId;
    }

    // Handle vendor relation
    if (productData.vendorId) {
      createData.vendor = {
        connect: { id: productData.vendorId },
      };
      delete createData.vendorId;
    }

    return prisma.product.create({
      data: createData,
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async update(id: string, data: any): Promise<Product> {
    // Extract categoryId if present
    const { categoryId, ...productData } = data;

    const updateData: any = { ...productData };

    // Handle brand relation
    if (productData.brandId !== undefined) {
      updateData.brand = productData.brandId
        ? { connect: { id: productData.brandId } }
        : { disconnect: true };
      delete updateData.brandId;
    }

    // Handle vendor relation
    if (productData.vendorId !== undefined) {
      updateData.vendor = productData.vendorId
        ? { connect: { id: productData.vendorId } }
        : { disconnect: true };
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
            isPrimary: true,
          },
        };
      }
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async softDelete(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async restore(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: null },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async getByCategory(categoryId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        categories: { some: { categoryId } },
        deletedAt: null,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async getByBrand(brandId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        brandId,
        deletedAt: null,
      },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async getFeatured(): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        isFeatured: true,
        deletedAt: null,
        status: 'ACTIVE',
      },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
    });
  }

  async getNewArrivals(): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        isNewArrival: true,
        deletedAt: null,
        status: 'ACTIVE',
      },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getBestSellers(): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        isBestSeller: true,
        deletedAt: null,
        status: 'ACTIVE',
      },
      include: {
        images: true,
        categories: { include: { category: true } },
        brand: true,
      },
      orderBy: { salesCount: 'desc' },
      take: 20,
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

  /**
   * Create a complete product with all related entities in a single transaction.
   * This includes: images, attributes, variants (with inventory), and base inventory.
   */
  async createComplete(data: any): Promise<any> {
    return prisma.$transaction(
      async tx => {
        // Extract nested data
        const {
          categoryId,
          brandId,
          vendorId,
          images,
          attributes,
          variants,
          inventory,
          ...productData
        } = data;

        // 1. Create the base product
        const productCreateData: any = {
          ...productData,
        };

        // Handle category relation (many-to-many)
        if (categoryId) {
          productCreateData.categories = {
            create: {
              categoryId,
              isPrimary: true,
            },
          };
        }

        // Handle brand relation
        if (brandId) {
          productCreateData.brand = {
            connect: { id: brandId },
          };
        }

        // Handle vendor relation
        if (vendorId) {
          productCreateData.vendor = {
            connect: { id: vendorId },
          };
        }

        const product = await tx.product.create({
          data: productCreateData,
        });

        // 2. Create product images
        if (images && images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img: any, index: number) => ({
              productId: product.id,
              url: img.imageKey,
              isPrimary: img.isPrimary ?? index === 0,
              alt: img.alt || null,
              caption: img.caption || null,
              displayOrder: index,
            })),
          });
        }

        // 3. Create product attributes
        if (attributes && attributes.length > 0) {
          await tx.productAttribute.createMany({
            data: attributes.map((attr: any) => ({
              productId: product.id,
              attributeTypeId: attr.attributeTypeId,
              value: attr.value,
            })),
          });
        }

        // 4. Create variants with their inventory
        if (variants && variants.length > 0) {
          for (const variantData of variants) {
            const { inventory: variantInventory, ...variantFields } =
              variantData;

            const variant = await tx.productVariant.create({
              data: {
                productId: product.id,
                variantSku: variantFields.variantSku,
                variantName: variantFields.variantName,
                attributes: variantFields.attributes,
                mrp: variantFields.mrp,
                sellingPrice: variantFields.sellingPrice,
                weight: variantFields.weight,
                dimensions: variantFields.dimensions,
                isActive: variantFields.isActive ?? true,
              },
            });

            // Create inventory for variant if provided
            if (variantInventory) {
              await tx.inventory.create({
                data: {
                  variantId: variant.id,
                  warehouseId: variantInventory.warehouseId,
                  availableQuantity: variantInventory.availableQuantity,
                  reservedQuantity: variantInventory.reservedQuantity ?? 0,
                  damagedQuantity: variantInventory.damagedQuantity ?? 0,
                  minStockLevel: variantInventory.minStockLevel ?? 10,
                  maxStockLevel: variantInventory.maxStockLevel ?? 1000,
                  reorderPoint: variantInventory.reorderPoint ?? 20,
                  reorderQuantity: variantInventory.reorderQuantity ?? 100,
                  rack: variantInventory.rack || null,
                  shelf: variantInventory.shelf || null,
                  bin: variantInventory.bin || null,
                },
              });
            }
          }
        }

        // 5. Create base product inventory (if inventory provided)
        if (inventory) {
          await tx.inventory.create({
            data: {
              productId: product.id,
              warehouseId: inventory.warehouseId,
              availableQuantity: inventory.availableQuantity,
              reservedQuantity: inventory.reservedQuantity ?? 0,
              damagedQuantity: inventory.damagedQuantity ?? 0,
              minStockLevel: inventory.minStockLevel ?? 10,
              maxStockLevel: inventory.maxStockLevel ?? 1000,
              reorderPoint: inventory.reorderPoint ?? 20,
              reorderQuantity: inventory.reorderQuantity ?? 100,
              rack: inventory.rack || null,
              shelf: inventory.shelf || null,
              bin: inventory.bin || null,
            },
          });
        }

        // 6. Return the complete product with all relations
        return tx.product.findUnique({
          where: { id: product.id },
          include: {
            images: true,
            categories: { include: { category: true } },
            brand: true,
            variants: {
              include: {
                inventory: { include: { warehouse: true } },
              },
            },
            attributes: { include: { attributeType: true } },
            inventory: { include: { warehouse: true } },
          },
        });
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      }
    );
  }

  /**
   * Update a complete product with all related entities in a single transaction.
   * This includes: images, attributes, variants (with inventory), and base inventory.
   *
   * Strategy:
   * - Images/Attributes: Delete + recreate (safe, no dependencies)
   * - Variants: Update existing by variantSku, create new ones, deactivate removed ones
   * - Inventory: Update in place (never delete to preserve stock movement history)
   */
  async updateComplete(id: string, data: any): Promise<any> {
    return prisma.$transaction(
      async tx => {
        // First check if product exists with all current related data
        const existingProduct = await tx.product.findUnique({
          where: { id },
          include: {
            variants: {
              include: {
                inventory: true,
              },
            },
            inventory: true,
          },
        });

        if (!existingProduct) {
          throw new Error('Product not found');
        }

        // Extract nested data
        const {
          categoryId,
          brandId,
          vendorId,
          images,
          attributes,
          variants,
          inventory,
          ...productData
        } = data;

        // 1. Update the base product
        const productUpdateData: any = {
          ...productData,
        };

        // Handle brand relation
        if (brandId !== undefined) {
          productUpdateData.brand = brandId
            ? { connect: { id: brandId } }
            : { disconnect: true };
        }

        // Handle vendor relation
        if (vendorId !== undefined) {
          productUpdateData.vendor = vendorId
            ? { connect: { id: vendorId } }
            : { disconnect: true };
        }

        // Handle category update
        if (categoryId !== undefined) {
          // Delete existing category relations
          await tx.productCategory.deleteMany({ where: { productId: id } });

          // Create new category relation if provided
          if (categoryId) {
            productUpdateData.categories = {
              create: {
                categoryId,
                isPrimary: true,
              },
            };
          }
        }

        await tx.product.update({
          where: { id },
          data: productUpdateData,
        });

        // 2. Update product images - UPDATE existing, CREATE new, DELETE removed
        if (images !== undefined && images.length > 0) {
          // Get existing images
          const existingImages = await tx.productImage.findMany({
            where: { productId: id },
          });

          // Separate incoming images into existing (with id) and new (without id)
          const incomingWithId = images.filter((img: any) => img.id);
          const incomingNew = images.filter((img: any) => !img.id);
          const incomingIds = new Set(incomingWithId.map((img: any) => img.id));

          // Delete images that are not in the incoming list
          const idsToDelete = existingImages
            .filter(existing => !incomingIds.has(existing.id))
            .map(img => img.id);

          if (idsToDelete.length > 0) {
            await tx.productImage.deleteMany({
              where: { id: { in: idsToDelete } },
            });
          }

          // Update existing images
          for (const img of incomingWithId) {
            const index = images.findIndex((i: any) => i.id === img.id);
            await tx.productImage.update({
              where: { id: img.id },
              data: {
                url: img.imageKey || img.url,
                isPrimary: img.isPrimary ?? index === 0,
                alt: img.alt || null,
                caption: img.caption || null,
                displayOrder: index,
              },
            });
          }

          // Create new images
          if (incomingNew.length > 0) {
            const existingCount = incomingWithId.length;
            await tx.productImage.createMany({
              data: incomingNew.map((img: any, index: number) => ({
                productId: id,
                url: img.imageKey || img.url,
                isPrimary: img.isPrimary ?? false,
                alt: img.alt || null,
                caption: img.caption || null,
                displayOrder: existingCount + index,
              })),
            });
          }
        }

        // 3. Update product attributes - UPDATE existing, CREATE new, DELETE removed
        if (attributes !== undefined && attributes.length > 0) {
          // Get existing attributes
          const existingAttributes = await tx.productAttribute.findMany({
            where: { productId: id },
          });

          // Separate incoming attributes into existing (with id) and new (without id)
          const incomingWithId = attributes.filter((attr: any) => attr.id);
          const incomingNew = attributes.filter((attr: any) => !attr.id);
          const incomingIds = new Set(
            incomingWithId.map((attr: any) => attr.id)
          );

          // Delete attributes that are not in the incoming list
          const idsToDelete = existingAttributes
            .filter(existing => !incomingIds.has(existing.id))
            .map(attr => attr.id);

          if (idsToDelete.length > 0) {
            await tx.productAttribute.deleteMany({
              where: { id: { in: idsToDelete } },
            });
          }

          // Update existing attributes
          for (const attr of incomingWithId) {
            await tx.productAttribute.update({
              where: { id: attr.id },
              data: {
                attributeTypeId: attr.attributeTypeId,
                value: attr.value,
              },
            });
          }

          // Create new attributes
          if (incomingNew.length > 0) {
            await tx.productAttribute.createMany({
              data: incomingNew.map((attr: any) => ({
                productId: id,
                attributeTypeId: attr.attributeTypeId,
                value: attr.value,
              })),
            });
          }
        }

        // 4. Update variants - UPDATE existing, CREATE new, DEACTIVATE removed
        if (variants !== undefined && variants.length > 0) {
          // Build a map of incoming variants by variantSku
          const incomingVariantSkus = new Set(
            variants.map((v: any) => v.variantSku)
          );

          // Build a map of existing variants by variantSku
          const existingVariantMap = new Map(
            existingProduct.variants.map(v => [v.variantSku, v])
          );

          for (const variantData of variants) {
            const { inventory: variantInventory, ...variantFields } =
              variantData;

            const existingVariant = existingVariantMap.get(
              variantFields.variantSku
            );

            if (existingVariant) {
              // UPDATE existing variant
              await tx.productVariant.update({
                where: { id: existingVariant.id },
                data: {
                  variantName: variantFields.variantName,
                  attributes: variantFields.attributes,
                  mrp: variantFields.mrp,
                  sellingPrice: variantFields.sellingPrice,
                  weight: variantFields.weight,
                  dimensions: variantFields.dimensions,
                  isActive: variantFields.isActive ?? true,
                },
              });

              // UPDATE variant inventory if provided
              if (variantInventory) {
                const existingVariantInventory = existingVariant.inventory?.[0];
                if (existingVariantInventory) {
                  // Update existing inventory
                  await tx.inventory.update({
                    where: { id: existingVariantInventory.id },
                    data: {
                      warehouseId: variantInventory.warehouseId,
                      availableQuantity: variantInventory.availableQuantity,
                      reservedQuantity:
                        variantInventory.reservedQuantity ??
                        existingVariantInventory.reservedQuantity,
                      damagedQuantity:
                        variantInventory.damagedQuantity ??
                        existingVariantInventory.damagedQuantity,
                      minStockLevel:
                        variantInventory.minStockLevel ??
                        existingVariantInventory.minStockLevel,
                      maxStockLevel:
                        variantInventory.maxStockLevel ??
                        existingVariantInventory.maxStockLevel,
                      reorderPoint:
                        variantInventory.reorderPoint ??
                        existingVariantInventory.reorderPoint,
                      reorderQuantity:
                        variantInventory.reorderQuantity ??
                        existingVariantInventory.reorderQuantity,
                      rack:
                        variantInventory.rack || existingVariantInventory.rack,
                      shelf:
                        variantInventory.shelf ||
                        existingVariantInventory.shelf,
                      bin: variantInventory.bin || existingVariantInventory.bin,
                    },
                  });
                } else {
                  // Create new inventory for existing variant
                  await tx.inventory.create({
                    data: {
                      variantId: existingVariant.id,
                      warehouseId: variantInventory.warehouseId,
                      availableQuantity: variantInventory.availableQuantity,
                      reservedQuantity: variantInventory.reservedQuantity ?? 0,
                      damagedQuantity: variantInventory.damagedQuantity ?? 0,
                      minStockLevel: variantInventory.minStockLevel ?? 10,
                      maxStockLevel: variantInventory.maxStockLevel ?? 1000,
                      reorderPoint: variantInventory.reorderPoint ?? 20,
                      reorderQuantity: variantInventory.reorderQuantity ?? 100,
                      rack: variantInventory.rack || null,
                      shelf: variantInventory.shelf || null,
                      bin: variantInventory.bin || null,
                    },
                  });
                }
              }
            } else {
              // CREATE new variant
              const newVariant = await tx.productVariant.create({
                data: {
                  productId: id,
                  variantSku: variantFields.variantSku,
                  variantName: variantFields.variantName,
                  attributes: variantFields.attributes,
                  mrp: variantFields.mrp,
                  sellingPrice: variantFields.sellingPrice,
                  weight: variantFields.weight,
                  dimensions: variantFields.dimensions,
                  isActive: variantFields.isActive ?? true,
                },
              });

              // Create inventory for new variant if provided
              if (variantInventory) {
                await tx.inventory.create({
                  data: {
                    variantId: newVariant.id,
                    warehouseId: variantInventory.warehouseId,
                    availableQuantity: variantInventory.availableQuantity,
                    reservedQuantity: variantInventory.reservedQuantity ?? 0,
                    damagedQuantity: variantInventory.damagedQuantity ?? 0,
                    minStockLevel: variantInventory.minStockLevel ?? 10,
                    maxStockLevel: variantInventory.maxStockLevel ?? 1000,
                    reorderPoint: variantInventory.reorderPoint ?? 20,
                    reorderQuantity: variantInventory.reorderQuantity ?? 100,
                    rack: variantInventory.rack || null,
                    shelf: variantInventory.shelf || null,
                    bin: variantInventory.bin || null,
                  },
                });
              }
            }
          }

          // DEACTIVATE variants that are no longer in the incoming list
          for (const existingVariant of existingProduct.variants) {
            if (!incomingVariantSkus.has(existingVariant.variantSku)) {
              await tx.productVariant.update({
                where: { id: existingVariant.id },
                data: { isActive: false },
              });
            }
          }
        }

        // 5. Update base product inventory (UPDATE in place, never delete)
        if (inventory !== undefined && inventory) {
          const existingInventory = existingProduct.inventory?.find(
            inv => inv.variantId === null
          );

          if (existingInventory) {
            // Update existing inventory
            await tx.inventory.update({
              where: { id: existingInventory.id },
              data: {
                warehouseId: inventory.warehouseId,
                availableQuantity: inventory.availableQuantity,
                reservedQuantity:
                  inventory.reservedQuantity ??
                  existingInventory.reservedQuantity,
                damagedQuantity:
                  inventory.damagedQuantity ??
                  existingInventory.damagedQuantity,
                minStockLevel:
                  inventory.minStockLevel ?? existingInventory.minStockLevel,
                maxStockLevel:
                  inventory.maxStockLevel ?? existingInventory.maxStockLevel,
                reorderPoint:
                  inventory.reorderPoint ?? existingInventory.reorderPoint,
                reorderQuantity:
                  inventory.reorderQuantity ??
                  existingInventory.reorderQuantity,
                rack: inventory.rack || existingInventory.rack,
                shelf: inventory.shelf || existingInventory.shelf,
                bin: inventory.bin || existingInventory.bin,
              },
            });
          } else {
            // Create new inventory if none exists
            await tx.inventory.create({
              data: {
                productId: id,
                warehouseId: inventory.warehouseId,
                availableQuantity: inventory.availableQuantity,
                reservedQuantity: inventory.reservedQuantity ?? 0,
                damagedQuantity: inventory.damagedQuantity ?? 0,
                minStockLevel: inventory.minStockLevel ?? 10,
                maxStockLevel: inventory.maxStockLevel ?? 1000,
                reorderPoint: inventory.reorderPoint ?? 20,
                reorderQuantity: inventory.reorderQuantity ?? 100,
                rack: inventory.rack || null,
                shelf: inventory.shelf || null,
                bin: inventory.bin || null,
              },
            });
          }
        }

        // 6. Return the complete updated product with all relations
        return tx.product.findUnique({
          where: { id },
          include: {
            images: true,
            categories: { include: { category: true } },
            brand: true,
            variants: {
              include: {
                inventory: { include: { warehouse: true } },
              },
            },
            attributes: { include: { attributeType: true } },
            inventory: { include: { warehouse: true } },
          },
        });
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      }
    );
  }
}
