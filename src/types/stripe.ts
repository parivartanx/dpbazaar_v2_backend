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