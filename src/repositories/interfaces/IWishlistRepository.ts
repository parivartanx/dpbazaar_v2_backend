

export interface IWishlistRepository {
  getCustomerWishlists(customerId: string): Promise<any[]>;
  getDefaultWishlist(customerId: string): Promise<any | null>;
  createWishlist(data: {
    customerId: string;
    name: string;
    isPublic: boolean;
    isDefault: boolean;
  }): Promise<any>;
  updateWishlist(id: string, data: {
    name?: string;
    isDefault?: boolean;
    isPublic?: boolean;
  }): Promise<any | null>;
  deleteWishlist(id: string): Promise<void>;
  addProductToWishlist(data: {
    wishlistId: string;
    productId: string;
    priority?: number;
    notes?: string;
  }): Promise<any>;
  removeProductFromWishlist(wishlistId: string, productId: string): Promise<void>;
  getWishlistItems(wishlistId: string): Promise<any[]>;
}