export interface IRazorpayService {
  createOrder(orderId: string, amount: number, currency?: string): Promise<any>;
  verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean>;
  fetchPayment(paymentId: string): Promise<any>;
  capturePayment(paymentId: string, amount: number): Promise<any>;
  refundPayment(paymentId: string, amount?: number): Promise<any>;
}