import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';
import { WalletRepository } from '../repositories/prisma/WalletRepository';
import { OrderRepository } from '../repositories/prisma/OrderRepository';
import { RazorpayService } from './razorpay.service';
import { StripeService } from './stripe.service';

const prisma = new PrismaClient();

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  customerId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  stripePaymentIntentId?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  message: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
}

export class PaymentService {
  private walletRepo = new WalletRepository();
  private orderRepo = new OrderRepository();
  private razorpayService = new RazorpayService();
  private stripeService = new StripeService();

  /**
   * Process payment based on the payment method
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const { orderId, amount, paymentMethod, customerId } = paymentRequest;

    // Verify the order exists and belongs to the customer
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} does not exist`);
    }

    if (customerId && order.customerId !== customerId) {
      throw new Error('Unauthorized: This order does not belong to you');
    }

    // Validate amount matches the order total
    if (Number(order.totalAmount) !== amount) {
      throw new Error('Payment amount does not match order total');
    }

    switch (paymentMethod) {
      case 'RAZORPAY':
        return this.processRazorpayPayment(paymentRequest);
      case 'STRIPE':
        return this.processStripePayment(paymentRequest);
      case 'WALLET':
        return this.processWalletPayment(paymentRequest);
      case 'COD':
        return this.processCODPayment(paymentRequest);
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }

  /**
   * Process Razorpay payment
   */
  private async processRazorpayPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const { orderId, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = paymentRequest;

    // Verify Razorpay payment details if provided
    if (!razorpayPaymentId || !razorpayOrderId) {
      throw new Error('Razorpay payment ID and order ID are required for Razorpay payment');
    }

    // Verify the payment using the Razorpay service
    const isPaymentVerified = await this.verifyRazorpayPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature || ''
    );

    if (!isPaymentVerified) {
      throw new Error('Razorpay payment verification failed');
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: amount,
        method: 'RAZORPAY',
        status: 'SUCCESS',
        gatewayName: 'RAZORPAY',
        gatewayPaymentId: razorpayPaymentId,
        gatewayOrderId: razorpayOrderId,
        gatewaySignature: razorpaySignature || null, // Convert undefined to null
        currency: 'INR',
        paidAt: new Date(),
      }
    });

    // Update order status to confirmed
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');

    return {
      success: true,
      paymentId: payment.id,
      message: 'Razorpay payment processed successfully',
      orderId,
      paymentStatus: 'SUCCESS',
    };
  }

  /**
   * Process Stripe payment
   */
  private async processStripePayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const { orderId, amount, stripePaymentIntentId } = paymentRequest;

    // Verify Stripe payment details if provided
    if (!stripePaymentIntentId) {
      throw new Error('Stripe payment intent ID is required for Stripe payment');
    }

    // Verify the payment using the Stripe service
    const isPaymentVerified = await this.verifyStripePayment(stripePaymentIntentId);

    if (!isPaymentVerified) {
      throw new Error('Stripe payment verification failed');
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: amount,
        method: 'STRIPE',
        status: 'SUCCESS',
        gatewayName: 'STRIPE',
        gatewayPaymentId: stripePaymentIntentId,
        gatewayOrderId: null, // Stripe doesn't have orders like Razorpay
        gatewaySignature: null,
        currency: 'INR',
        paidAt: new Date(),
      }
    });

    // Update order status to confirmed
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');

    return {
      success: true,
      paymentId: payment.id,
      message: 'Stripe payment processed successfully',
      orderId,
      paymentStatus: 'SUCCESS',
    };
  }

  /**
   * Process wallet payment
   */
  private async processWalletPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const { orderId, amount, customerId } = paymentRequest;

    if (!customerId) {
      throw new Error('Customer ID is required for wallet payment');
    }

    // Get all wallets for the customer
    const customerWallets = await this.walletRepo.list({ customerId });
    
    // For simplicity, we'll use the first wallet (assuming it's the main shopping wallet)
    const mainWallet = customerWallets.find((wallet: any) => wallet.type === 'SHOPPING');
    
    if (!mainWallet) {
      throw new Error('Customer does not have a wallet to process payment');
    }

    if (Number(mainWallet.balance) < amount) {
      throw new Error('Insufficient wallet balance');
    }

    // Get the wallet balance before the transaction
    const balanceBefore = Number(mainWallet.balance);
    const balanceAfter = balanceBefore - amount;

    // Update wallet balance (subtract the amount)
    await prisma.wallet.update({
      where: { id: mainWallet.id },
      data: {
        balance: {
          decrement: amount
        }
      }
    });

    // Create wallet transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: mainWallet.id,
        customerId,
        type: 'DEBIT',
        amount: amount,
        reason: 'PURCHASE', // Use correct enum value
        status: 'SUCCESS',
        balanceBefore: balanceBefore,
        balanceAfter: balanceAfter,
        metadata: {
          orderId: orderId, // Store order ID in metadata
          description: `Payment for order ${orderId}`
        },
      }
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: amount,
        method: 'WALLET',
        status: 'SUCCESS',
        gatewayName: 'WALLET',
        currency: 'INR',
        paidAt: new Date(),
      }
    });

    // Update order status to confirmed
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');

    return {
      success: true,
      paymentId: payment.id,
      message: 'Wallet payment processed successfully',
      orderId,
      paymentStatus: 'SUCCESS',
    };
  }

  /**
   * Process Cash on Delivery payment
   */
  private async processCODPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const { orderId, amount } = paymentRequest;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: amount,
        method: 'COD',
        status: 'SUCCESS', // For COD, we consider it successful immediately
        gatewayName: 'COD',
        currency: 'INR',
        paidAt: new Date(),
      }
    });

    // Update order status to confirmed
    await this.orderRepo.updateOrderStatus(orderId, 'CONFIRMED');

    return {
      success: true,
      paymentId: payment.id,
      message: 'COD payment processed successfully',
      orderId,
      paymentStatus: 'SUCCESS',
    };
  }

  /**
   * Verify Razorpay payment using the Razorpay service
   */
  private async verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<boolean> {
    return this.razorpayService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  }

  /**
   * Verify Stripe payment using the Stripe service
   */
  private async verifyStripePayment(paymentIntentId: string): Promise<boolean> {
    return this.stripeService.verifyPayment(paymentIntentId);
  }

  /**
   * Create Razorpay order for frontend
   */
  async createRazorpayOrder(orderId: string, amount: number): Promise<{ id: string; amount: number; currency: string; }> {
    return this.razorpayService.createOrder(orderId, amount);
  }

  /**
   * Create Stripe payment intent for frontend
   */
  async createStripePaymentIntent(
    orderId: string,
    amount: number,
    currency: string = 'inr',
    customerEmail?: string
  ): Promise<{ id: string; client_secret: string; amount: number; currency: string; }> {
    return this.stripeService.createPaymentIntent(amount, currency, orderId, customerEmail);
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string) {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true
      }
    });
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string) {
    return prisma.payment.findFirst({
      where: { orderId },
      include: {
        order: true
      }
    });
  }
}