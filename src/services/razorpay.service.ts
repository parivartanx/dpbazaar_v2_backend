import * as crypto from 'crypto';
import { IRazorpayService } from '../types/razorpay';

export class RazorpayService implements IRazorpayService {
  private razorpay: any;

  constructor() {
    // Initialize Razorpay client with credentials from environment
    const Razorpay = require('razorpay');
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async createOrder(orderId: string, amount: number, currency: string = 'INR'): Promise<any> {
    try {
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paise
        currency: currency,
        receipt: orderId,
        payment_capture: 1, // Auto-capture payment
      };

      const order = await this.razorpay.orders.create(options);
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean> {
    try {
      // Create the payload for signature verification
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      // Compare the generated signature with the received signature
      const isSignatureValid = generatedSignature === razorpaySignature;

      if (!isSignatureValid) {
        console.error('Razorpay signature verification failed');
        return false;
      }

      // Fetch the payment from Razorpay to verify its status
      const payment = await this.razorpay.payments.fetch(razorpayPaymentId);

      // Verify the payment status is 'captured' (not just authorized)
      if (payment.status !== 'captured') {
        console.error(`Razorpay payment status is ${payment.status}, expected 'captured'`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return false;
    }
  }

  async fetchPayment(paymentId: string): Promise<any> {
    try {
      return await this.razorpay.payments.fetch(paymentId);
    } catch (error) {
      console.error('Error fetching Razorpay payment:', error);
      throw error;
    }
  }

  async capturePayment(paymentId: string, amount: number): Promise<any> {
    try {
      const options = {
        amount: Math.round(amount * 100), // Amount in paise
      };

      return await this.razorpay.payments.capture(paymentId, options);
    } catch (error) {
      console.error('Error capturing Razorpay payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const options: any = {};
      if (amount) {
        options.amount = Math.round(amount * 100); // Amount in paise
      }

      return await this.razorpay.payments.refund(paymentId, options);
    } catch (error) {
      console.error('Error refunding Razorpay payment:', error);
      throw error;
    }
  }
}