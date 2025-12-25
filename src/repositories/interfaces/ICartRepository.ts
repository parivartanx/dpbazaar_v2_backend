import { Cart, CartItem, Prisma } from '@prisma/client';

export interface ICartRepository {
  findByCustomerId(customerId: string): Promise<Cart & { items: CartItem[] } | null>;
  create(data: Prisma.CartCreateInput): Promise<Cart>;
  update(customerId: string, data: Prisma.CartUpdateInput): Promise<Cart>;
  delete(customerId: string): Promise<Cart>;
  addItem(data: Prisma.CartItemCreateInput): Promise<CartItem>;
  updateItem(cartId: string, productId: string, variantId: string | null, data: Prisma.CartItemUpdateInput): Promise<CartItem>;
  removeItem(cartId: string, productId: string, variantId: string | null): Promise<CartItem>;
  clearCart(customerId: string): Promise<void>;
}