import { Wishlist, WishlistItem } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { IWishlistRepository } from '../interfaces/IWishlistRepository';



export class WishlistRepository implements IWishlistRepository {
  async getCustomerWishlists(customerId: string): Promise<Wishlist[]> {
    return await prisma.wishlist.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async getDefaultWishlist(customerId: string): Promise<Wishlist | null> {
    return await prisma.wishlist.findFirst({
      where: {
        customerId,
        isDefault: true
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }

  async createWishlist(data: {
    customerId: string;
    name: string;
    isPublic: boolean;
    isDefault: boolean;
  }): Promise<Wishlist> {
    // If setting as default, unset other defaults for this customer
    if (data.isDefault) {
      await prisma.wishlist.updateMany({
        where: {
          customerId: data.customerId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    return await prisma.wishlist.create({
      data: {
        customerId: data.customerId,
        name: data.name,
        isPublic: data.isPublic,
        isDefault: data.isDefault
      }
    });
  }

  async updateWishlist(id: string, data: {
    name?: string;
    isDefault?: boolean;
    isPublic?: boolean;
  }): Promise<Wishlist | null> {
    const wishlist = await prisma.wishlist.findUnique({ where: { id } });
    if (!wishlist) return null;
    
    // If updating to default, unset other defaults for this customer
    if (data.isDefault) {
      await prisma.wishlist.updateMany({
        where: {
          customerId: wishlist.customerId,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    
    return await prisma.wishlist.update({
      where: { id },
      data: updateData
    });
  }

  async deleteWishlist(id: string): Promise<void> {
    await prisma.wishlist.delete({
      where: { id }
    });
  }

  async addProductToWishlist(data: {
    wishlistId: string;
    productId: string;
    priority?: number;
    notes?: string;
  }): Promise<WishlistItem> {
    const updateData: any = { priority: data.priority || 0 };
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    const createData: any = {
      wishlistId: data.wishlistId,
      productId: data.productId,
      priority: data.priority || 0
    };
    if (data.notes !== undefined) createData.notes = data.notes;
    
    return await prisma.wishlistItem.upsert({
      where: {
        wishlistId_productId: {
          wishlistId: data.wishlistId,
          productId: data.productId
        }
      },
      update: updateData,
      create: createData
    });
  }

  async removeProductFromWishlist(wishlistId: string, productId: string): Promise<void> {
    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId,
          productId
        }
      }
    });
  }

  async getWishlistItems(wishlistId: string): Promise<WishlistItem[]> {
    return await prisma.wishlistItem.findMany({
      where: { wishlistId },
      include: {
        product: true
      }
    });
  }
}