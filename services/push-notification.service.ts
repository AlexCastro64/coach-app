/**
 * Push Notification Service
 * Handles Expo push notifications setup and management
 */

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationService } from './notification.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class PushNotificationService {
  /**
   * Register for push notifications and get Expo push token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo push token:', token);
      } catch (error) {
        console.error('Error getting push token:', error);
        return null;
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  /**
   * Register push token with backend
   */
  static async registerTokenWithBackend(token: string): Promise<void> {
    try {
      await NotificationService.registerPushToken(token);
      console.log('Push token registered with backend');
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
      throw error;
    }
  }

  /**
   * Unregister push token from backend
   */
  static async unregisterTokenFromBackend(token: string): Promise<void> {
    try {
      await NotificationService.unregisterPushToken(token);
      console.log('Push token unregistered from backend');
    } catch (error) {
      console.error('Failed to unregister push token:', error);
      throw error;
    }
  }

  /**
   * Add notification received listener
   */
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Schedule a local notification
   */
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: trigger || null,
    });
  }

  /**
   * Cancel a scheduled notification
   */
  static async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  static async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get badge count
   */
  static async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  static async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  static async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Dismiss a notification
   */
  static async dismissNotification(notificationId: string): Promise<void> {
    await Notifications.dismissNotificationAsync(notificationId);
  }

  /**
   * Dismiss all notifications
   */
  static async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
}
