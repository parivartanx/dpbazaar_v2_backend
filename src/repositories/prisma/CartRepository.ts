import { Cart, CartItem, Prisma } from '@prisma/client';
import { prisma } from '../../config/prismaClient';
import { ICartRepository } from '../interfaces/ICartRepository';

export class CartRepository implements ICartRepository {
  async findByCustomerId(customerId: string): Promise<Cart & { items: CartItem[] } | null> {
    return prisma.cart.findUnique({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });
  }

  async create(data: Prisma.CartCreateInput): Promise<Cart> {
    return prisma.cart.create({ data });
  }

  async update(customerId: string, data: Prisma.CartUpdateInput): Promise<Cart> {
    return prisma.cart.update({
      where: { customerId },
      data
    });
  }

  async delete(customerId: string): Promise<Cart> {
    return prisma.cart.delete({
      where: { customerId }
    });
  }

  async addItem(data: Prisma.CartItemCreateInput): Promise<CartItem> {
    return prisma.cartItem.create({ data });
  }

  async updateItem(cartId: string, productId: string, variantId: string | null, data: Prisma.CartItemUpdateInput): Promise<CartItem> {
    // Find the specific cart item using a flexible where clause
    const whereClause: any = {
      cartId,
      productId
    };
    
    if (variantId === null) {
      whereClause.variantId = null;
    } else {
      whereClause.variantId = variantId;
    }

    // Find the cart item first
    const cartItem = await prisma.cartItem.findFirst({
      where: whereClause
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Update the found cart item
    return prisma.cartItem.update({
      where: { id: cartItem.id },
      data
    });
  }

  async removeItem(cartId: string, productId: string, variantId: string | null): Promise<CartItem> {
    // Find the specific cart item using a flexible where clause
    const whereClause: any = {
      cartId,
      productId
    };
    
    if (variantId === null) {
      whereClause.variantId = null;
    } else {
      whereClause.variantId = variantId;
    }

    // Find the cart item first
    const cartItem = await prisma.cartItem.findFirst({
      where: whereClause
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Delete the found cart item
    return prisma.cartItem.delete({
      where: { id: cartItem.id }
    });
  }

  async clearCart(customerId: string): Promise<void> {
    const cart = await prisma.cart.findUnique({
      where: { customerId },
      select: { id: true }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
  }
}