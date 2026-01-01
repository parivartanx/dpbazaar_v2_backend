import axios from 'axios';
import { logger } from '../utils/logger';

export interface SendSmsOptions {
  message: string;
  numbers: string[]; // Array of phone numbers
  senderId?: string;
  route?: string;
  country?: string;
}

export class SmsService {
  private apiKey: string;
  private baseUrl = 'https://www.fast2sms.com/dev';

  constructor() {
    this.apiKey = process.env.FAST2SMS_API_KEY || '';
    if (!this.apiKey) {
      logger.error('Fast2SMS API key is not configured');
    }
  }

  /**
   * Send SMS using Fast2SMS API
   * @param options SMS options including message and recipient numbers
   * @returns Response from Fast2SMS API
   */
  async sendSms(options: SendSmsOptions): Promise<any> {
    try {
      if (!this.apiKey) {
        throw new Error('Fast2SMS API key is not configured');
      }

      // Prepare the request payload
      const payload = {
        message: options.message,
        language: 'english',
        route: options.route || 'p',
        numbers: options.numbers,
        sender_id: options.senderId || 'TXTIND',
        country: options.country || '91', // Default to India (91)
      };

      const response = await axios.post(
        `${this.baseUrl}/bulkV2`,
        payload,
        {
          headers: {
            'authorization': this.apiKey,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );

      logger.info(`SMS sent successfully to ${options.numbers.length} numbers`);
      return response.data;
    } catch (error: any) {
      logger.error(`Error sending SMS: ${error.message}`);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Send OTP via SMS
   * @param phoneNumber Phone number to send OTP to
   * @param otp OTP code
   * @returns Response from Fast2SMS API
   */
  async sendOtp(phoneNumber: string, otp: string): Promise<any> {
    const message = `Your OTP for verification is ${otp}. Valid for 5 minutes.`;
    return this.sendSms({
      message,
      numbers: [phoneNumber],
    });
  }
}

// Export a singleton instance
export const smsService = new SmsService();