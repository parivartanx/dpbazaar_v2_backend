import { Request, Response } from 'express';
import { CartRepository } from '../repositories/prisma/CartRepository';
import { logger } from '../utils/logger';
import { ApiResponse } from '@/types/common';
import { PaymentMethod } from '@prisma/client';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
import { PaymentService } from '../services/payment.service';
import { prisma } from '../config/prismaClient';
import { getCustomerIdFromUserId } from '../utils/customerHelper';

const cartRepo = new CartRepository();
const orderRepo = new OrderRepository();
const paymentService = new PaymentService();

// ✅ Extend Request type to include `user`
interface AuthRequest extends Request {
  user?: { userId: string };
}

export class CartController {
  /** ----------------- CUSTOMER END ----------------- */

  getCustomerCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);
      const cart = await cartRepo.findByCustomerId(customerId);
      if (!cart) {
        // Create an empty cart if it doesn't exist
        const newCart = await prisma.cart.create({
          data: {
            customerId,
            itemCount: 0,
            totalMrp: 0,
            totalDiscount: 0,
            totalAmount: 0,
          },
          include: {
            items: {
              include: {
                product: true,
                variant: true
              }
            }
          }
        });
        
        const response: ApiResponse = {
          success: true,
          message: 'Cart created successfully',
          data: { cart: newCart },
          timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Customer cart fetched successfully',
        data: { cart },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error fetching customer cart: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to fetch customer cart',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);

      // First, check if cart exists, create if not
      let cart = await prisma.cart.findUnique({
        where: { customerId },
        include: {
          items: true
        }
      });
      
      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            customerId,
            itemCount: 0,
            totalMrp: 0,
            totalDiscount: 0,
            totalAmount: 0,
          },
          include: {
            items: true
          }
        });
      }

      const { productId, variantId, productSku, quantity = 1, mrp, sellingPrice, discount } = req.body;

      if (!productId) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Resolve variantId from productSku if provided
      let resolvedVariantId: string | null = variantId || null;
      
      if (productSku && !variantId) {
        // Check if productSku matches a variant's variantSku
        const variant = await prisma.productVariant.findUnique({
          where: { variantSku: productSku },
          select: { id: true, productId: true }
        });
        
        if (variant) {
          // Verify the variant belongs to the provided product
          if (variant.productId !== productId) {
            const response: ApiResponse = {
              success: false,
              message: 'Product SKU does not match the provided product ID',
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
          resolvedVariantId = variant.id;
        } else {
          // Check if productSku matches the product's SKU (no variant)
          const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { sku: true }
          });
          
          if (!product) {
            const response: ApiResponse = {
              success: false,
              message: 'Product not found',
              timestamp: new Date().toISOString(),
            };
            res.status(404).json(response);
            return;
          }
          
          if (product.sku !== productSku) {
            const response: ApiResponse = {
              success: false,
              message: 'Product SKU does not match',
              timestamp: new Date().toISOString(),
            };
            res.status(400).json(response);
            return;
          }
          
          // Product has no variant, so variantId should be null
          resolvedVariantId = null;
        }
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: resolvedVariantId
        }
      });

      if (existingItem) {
        // Update quantity if item exists
        await prisma.cartItem.update({
          where: {
            id: existingItem.id
          },
          data: {
            quantity: existingItem.quantity + quantity
          }
        });

        // Update cart totals
        const updatedCart = await this.updateCartTotals(cart.customerId);
        
        const response: ApiResponse = {
          success: true,
          message: 'Cart item updated successfully',
          data: { cart: updatedCart },
          timestamp: new Date().toISOString(),
        };
        res.status(200).json(response);
        return;
      }

      // Add new item to cart
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: resolvedVariantId,
          quantity,
          mrp: mrp || 0,
          sellingPrice: sellingPrice || 0,
          discount: discount || 0
        }
      });

      // Update cart totals
      const updatedCart = await this.updateCartTotals(customerId);
      
      const response: ApiResponse = {
        success: true,
        message: 'Item added to cart successfully',
        data: { cart: updatedCart },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error adding to cart: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to add item to cart',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  updateCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);

      const cart = await prisma.cart.findUnique({
        where: { customerId },
        include: {
          items: true
        }
      });
      
      if (!cart) {
        const response: ApiResponse = {
          success: false,
          message: 'Cart not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const { productId, variantId, quantity } = req.body;

      if (!productId || quantity === undefined) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID and quantity are required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Create where clause to handle nullable variantId
      const whereClause: any = {
        cartId: cart.id,
        productId
      };
      
      if (variantId) {
        whereClause.variantId = variantId;
      } else {
        whereClause.variantId = null;
      }

      // Update item quantity
      await prisma.cartItem.update({
        where: whereClause,
        data: {
          quantity
        }
      });

      // Update cart totals
      const updatedCart = await this.updateCartTotals(customerId);
      
      const response: ApiResponse = {
        success: true,
        message: 'Cart updated successfully',
        data: { cart: updatedCart },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error updating cart: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to update cart',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);

      const cart = await prisma.cart.findUnique({
        where: { customerId },
        include: {
          items: true
        }
      });
      
      if (!cart) {
        const response: ApiResponse = {
          success: false,
          message: 'Cart not found',
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(response);
        return;
      }

      const { productId, variantId } = req.params;

      if (!productId) {
        const response: ApiResponse = {
          success: false,
          message: 'Product ID is required',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Create where clause to handle nullable variantId
      const whereClause: any = {
        cartId: cart.id,
        productId
      };
      
      if (variantId) {
        whereClause.variantId = variantId;
      } else {
        whereClause.variantId = null;
      }

      // Remove item from cart
      await prisma.cartItem.delete({
        where: whereClause
      });

      // Update cart totals
      const updatedCart = await this.updateCartTotals(customerId);
      
      const response: ApiResponse = {
        success: true,
        message: 'Item removed from cart successfully',
        data: { cart: updatedCart },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error removing from cart: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to remove item from cart',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);

      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            customerId
          }
        }
      });

      // Update cart totals to zero
      await prisma.cart.update({
        where: {
          customerId
        },
        data: {
          itemCount: 0,
          totalMrp: 0,
          totalDiscount: 0,
          totalAmount: 0
        }
      });

      const response: ApiResponse = {
        success: true,
        message: 'Cart cleared successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (error) {
      logger.error(`Error clearing cart: ${error}`);
      const response: ApiResponse = {
        success: false,
        message: 'Failed to clear cart',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Customer-specific method to buy products from cart
  buyProductsFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: 'Customer not authenticated',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      const customerId = await getCustomerIdFromUserId(userId);

      // Get the customer's cart
      const cart = await prisma.cart.findUnique({
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
      
      if (!cart || cart.items.length === 0) {
        const response: ApiResponse = {
          success: false,
          message: 'Cart is empty',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      // Prepare order items from cart items (only required fields)
      const orderItems = cart.items.map(item => {
        const orderItem: any = {
          productId: item.productId,
          quantity: item.quantity,
        };
        
        // Only include variantId if it's not null/undefined
        if (item.variantId) {
          orderItem.variantId = item.variantId;
        }
        
        return orderItem;
      });

      // Prepare order data
      const orderData = {
        customerId,
        items: orderItems,
        shippingAddressId: req.body.shippingAddressId, // Optional shipping address from request
        billingAddressId: req.body.billingAddressId, // Optional billing address from request
        customerNotes: req.body.customerNotes,
        discountCode: req.body.discountCode,
        source: 'WEBSITE' as const,
        deviceInfo: {
          platform: 'website',
          userAgent: req.get('User-Agent') || 'unknown',
        },
        // Add payment method from request body
        paymentMethod: req.body.paymentMethod,
        paymentDetails: req.body.paymentDetails,
      };

      // Create the order
      const order = await orderRepo.createOrder(orderData);
      
      // Process payment if payment information is provided
      const { paymentMethod, paymentDetails } = req.body;
      if (paymentMethod) {
        await this.createPayment(order.id, order.totalAmount, paymentMethod as PaymentMethod, {
          ...paymentDetails,
          customerId
        });
      }
      
      // Clear the cart after successful order creation
      await prisma.cartItem.deleteMany({
        where: {
          cart: {
            customerId
          }
        }
      });

      // Update cart totals to zero
      await prisma.cart.update({
        where: {
          customerId
        },
        data: {
          itemCount: 0,
          totalMrp: 0,
          totalDiscount: 0,
          totalAmount: 0
        }
      });
      
      const response: ApiResponse = {
        success: true,
        data: { order },
        message: 'Order created successfully from cart',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error) {
      logger.error(`error: ${error}`);
      const response: ApiResponse = {
        success: false,
        error: (error as Error).message,
        message: 'Problem in creating order from cart',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  };

  // Helper method to create payment record
  private async createPayment(orderId: string, amount: any, method: PaymentMethod, details?: any): Promise<void> {
    // Use the PaymentService to process the payment
    const paymentRequest = {
      orderId,
      amount: Number(amount),
      paymentMethod: method,
      customerId: details?.customerId,
      razorpayPaymentId: details?.razorpayPaymentId,
      razorpayOrderId: details?.razorpayOrderId,
      razorpaySignature: details?.razorpaySignature,
    };
    
    await paymentService.processPayment(paymentRequest);
  }

  // Helper method to update cart totals
  private async updateCartTotals(customerId: string) {
    const cart = await prisma.cart.findUnique({
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

    if (!cart) return null;

    // Calculate new totals
    let itemCount = 0;
    let totalMrp = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    for (const item of cart.items) {
      itemCount += item.quantity;
      totalMrp += Number(item.mrp) * item.quantity;
      totalDiscount += Number(item.discount) * item.quantity;
      totalAmount += Number(item.sellingPrice) * item.quantity;
    }

    // Update cart with new totals
    const updatedCart = await prisma.cart.update({
      where: { customerId },
      data: {
        itemCount,
        totalMrp,
        totalDiscount,
        totalAmount
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true
          }
        }
      }
    });

    return updatedCart;
  }
}