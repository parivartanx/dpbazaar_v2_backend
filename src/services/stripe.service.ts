import Stripe from 'stripe';

export interface IStripeService {
  createPaymentIntent(amount: number, currency?: string, orderId?: string, customerEmail?: string): Promise<any>;
  verifyPayment(paymentIntentId: string): Promise<boolean>;
  capturePayment(paymentIntentId: string): Promise<any>;
  refundPayment(paymentIntentId: string, amount?: number): Promise<any>;
  createCheckoutSession(
    amount: number,
    currency?: string,
    orderId?: string,
    successUrl?: string,
    cancelUrl?: string,
    customerEmail?: string
  ): Promise<any>;
}

export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'inr',
    orderId: string,
    customerEmail?: string
  ): Promise<any> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents/paise
        currency: currency,
        metadata: {
          orderId: orderId,
        },
        ...(customerEmail && { receipt_email: customerEmail }),
      });

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw error;
    }
  }

  async verifyPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      // Check if the payment is successful
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      console.error('Error verifying Stripe payment:', error);
      return false;
    }
  }

  async capturePayment(paymentIntentId: string): Promise<any> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      console.error('Error capturing Stripe payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    try {
      const refundOptions: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundOptions.amount = Math.round(amount * 100); // Amount in cents/paise
      }

      return await this.stripe.refunds.create(refundOptions);
    } catch (error) {
      console.error('Error refunding Stripe payment:', error);
      throw error;
    }
  }

  async createCheckoutSession(
    amount: number,
    currency: string = 'inr',
    orderId: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string
  ): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Order ${orderId}`,
              },
              unit_amount: Math.round(amount * 100), // Amount in cents/paise
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          orderId: orderId,
        },
        ...(customerEmail && { customer_email: customerEmail }),
      });

      return {
        id: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  }
}