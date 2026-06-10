import Razorpay from 'razorpay'
import crypto from 'crypto'

export interface PaymentOrderOptions {
  amount: number; // in minor units (e.g., paise/cents)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationOptions {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentService {
  createOrder(options: PaymentOrderOptions): Promise<PaymentOrder>;
  verifyPayment(options: PaymentVerificationOptions): Promise<boolean>;
}

export class RazorpayPaymentService implements PaymentService {
  private razorpay: any = null

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (keyId && keySecret && !keyId.includes('placeholder') && keyId.trim() !== '') {
      try {
        this.razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        })
      } catch (err) {
        console.error('Failed to initialize Razorpay SDK:', err)
      }
    } else {
      console.warn('Razorpay keys not configured. Falling back to Sandbox Mock Payment Service.')
    }
  }

  async createOrder(options: PaymentOrderOptions): Promise<PaymentOrder> {
    if (this.razorpay) {
      try {
        const order = await this.razorpay.orders.create({
          amount: Math.round(options.amount), // Amount in paise/cents
          currency: options.currency,
          receipt: options.receipt,
          notes: options.notes,
        })
        return {
          id: order.id,
          amount: Number(order.amount),
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        }
      } catch (error) {
        console.error('Error creating Razorpay order:', error)
        throw new Error('Payment order creation failed')
      }
    } else {
      // Mock order for sandbox test mode
      const mockOrderId = `mock_order_${Math.random().toString(36).substring(2, 15)}`
      return {
        id: mockOrderId,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created',
      }
    }
  }

  async verifyPayment(options: PaymentVerificationOptions): Promise<boolean> {
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (this.razorpay && keySecret && !keySecret.includes('placeholder') && keySecret.trim() !== '') {
      try {
        const text = `${options.orderId}|${options.paymentId}`
        const generatedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(text)
          .digest('hex')
        return generatedSignature === options.signature
      } catch (error) {
        console.error('Error verifying Razorpay payment signature:', error)
        return false
      }
    } else {
      // Mock verification for sandbox/local test mode
      console.log('Mock verifying payment:', options)
      // Accept any pay_ ID and signature 'mock_signature' or anything non-empty in local test mode
      return !!options.paymentId && !!options.signature
    }
  }
}

// Export singleton instance of PaymentService
export const paymentService: PaymentService = new RazorpayPaymentService()
