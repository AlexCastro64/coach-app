import { apiClient } from './api.client';

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface BackendCheckoutResponse {
  message: string;
  checkout: {
    id: string;
    url: string;
  };
}

export interface CheckoutSessionParams {
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
}

export class SubscriptionService {
  /**
   * Create a Stripe checkout session
   */
  static async createCheckoutSession(params: CheckoutSessionParams): Promise<CreateCheckoutSessionResponse> {
    try {
      // Convert camelCase to snake_case for Laravel backend
      const requestBody = {
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        ...(params.priceId && { price_id: params.priceId }),
      };

      const response = await apiClient.post<BackendCheckoutResponse>(
        '/subscription/checkout/create',
        requestBody
      );

      // Transform backend response to expected format
      return {
        sessionId: response.data.checkout.id,
        url: response.data.checkout.url,
      };
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create checkout session. Please try again.');
    }
  }

  /**
   * Verify checkout session completion
   */
  static async verifyCheckoutSession(sessionId: string): Promise<{ success: boolean }> {
    try {
      console.log('🔍 Verifying session:', sessionId);
      const response = await apiClient.get<any>(
        `/subscription/checkout/verify/${sessionId}`
      );
      console.log('📊 Verify response:', response.data);
      
      // Handle different response formats
      if (response.data.success !== undefined) {
        return { success: response.data.success };
      }
      
      // If no explicit success field, assume success if we got a 200 response
      return { success: true };
    } catch (error: any) {
      console.error('❌ Verify session error:', error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to verify checkout session.');
    }
  }
}
