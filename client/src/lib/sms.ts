// SMS notification utilities for RuralCart
// This would integrate with Twilio or similar SMS service

export interface SMSConfig {
  accountSid?: string;
  authToken?: string;
  fromNumber?: string;
}

export interface SMSMessage {
  to: string;
  body: string;
}

class SMSService {
  private config: SMSConfig;

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || import.meta.env.VITE_TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN || import.meta.env.VITE_TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_PHONE_NUMBER || import.meta.env.VITE_TWILIO_PHONE_NUMBER,
    };
  }

  async sendSMS(message: SMSMessage): Promise<boolean> {
    try {
      // In production, this would use Twilio SDK
      // For now, we'll log the SMS and return success
      console.log(`SMS to ${message.to}: ${message.body}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  generateOrderConfirmationMessage(orderId: string, total: number): string {
    return `RuralCart: Order #${orderId} confirmed! Total: ₹${(total / 100).toFixed(2)}. Estimated delivery: 30-45 mins. Track your order in the app.`;
  }

  generateOrderStatusMessage(orderId: string, status: string): string {
    const statusMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      preparing: 'Your order is being prepared by our team.',
      out_for_delivery: 'Your order is out for delivery! Delivery person will contact you shortly.',
      delivered: 'Your order has been delivered successfully. Thank you for choosing RuralCart!',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact support.'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Your order status has been updated.';
    return `RuralCart: Order #${orderId} - ${message}`;
  }

  generateDeliveryReminderMessage(orderId: string, estimatedTime: string): string {
    return `RuralCart: Your order #${orderId} will be delivered in approximately ${estimatedTime}. Please be available to receive your order.`;
  }
}

export const smsService = new SMSService();
