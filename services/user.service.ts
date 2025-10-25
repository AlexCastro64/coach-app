import { apiClient } from './api.client';
import { User } from '../types/auth';
import { UpdateProfileData, UserSettings } from '../types/settings';
import { Subscription, SubscriptionPlan } from '../types/subscription';

export class UserService {
  /**
   * Update user profile information
   */
  static async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await apiClient.put<User>('/user/profile', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  }

  /**
   * Get user settings
   */
  static async getSettings(): Promise<UserSettings> {
    try {
      const response = await apiClient.get<UserSettings>('/user/settings');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch settings.');
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await apiClient.put<UserSettings>('/user/settings', settings);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update settings. Please try again.');
    }
  }

  /**
   * Get user subscription
   */
  static async getSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.get<Subscription>('/user/subscription');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch subscription information.');
    }
  }

  /**
   * Get available subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<SubscriptionPlan[]>('/subscription/plans');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch subscription plans.');
    }
  }

  /**
   * Update subscription
   */
  static async updateSubscription(tier: string): Promise<Subscription> {
    try {
      const response = await apiClient.post<Subscription>('/user/subscription', { tier });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update subscription. Please try again.');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(): Promise<void> {
    try {
      await apiClient.delete('/user/subscription');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to cancel subscription. Please try again.');
    }
  }

  /**
   * Mark onboarding as completed
   */
  static async completeOnboarding(): Promise<User> {
    try {
      const response = await apiClient.post<User>('/user/onboarding/complete');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to complete onboarding. Please try again.');
    }
  }
}
