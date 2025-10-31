/**
 * Notification Service
 * Handles all notification and push token API calls
 */

import { apiClient } from './api.client';
import {
  Notification,
  NotificationPreferences,
  RegisterPushTokenRequest,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export class NotificationService {
  /**
   * Get all notifications for the user
   */
  static async getNotifications(params?: PaginationParams): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/me/notifications', { params });
    return response.data;
  }

  /**
   * Get unread notifications
   */
  static async getUnreadNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/me/notifications/unread');
    return response.data.data;
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/me/notifications/unread/count');
    return response.data.data.count;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    await apiClient.post(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    await apiClient.post('/me/notifications/read-all');
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  /**
   * Register push notification token
   */
  static async registerPushToken(data: RegisterPushTokenRequest): Promise<void> {
    await apiClient.post('/push/register', data);
  }

  /**
   * Unregister push notification token
   */
  static async unregisterPushToken(token: string): Promise<void> {
    await apiClient.post('/push/unregister', { token });
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<ApiResponse<NotificationPreferences>>('/me/notifications/preferences');
    return response.data.data;
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await apiClient.put<ApiResponse<NotificationPreferences>>(
      '/me/notifications/preferences',
      data
    );
    return response.data.data;
  }
}
