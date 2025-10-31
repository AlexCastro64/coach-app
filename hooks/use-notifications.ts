/**
 * Notifications Hooks
 * React hooks for notification management
 */

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { PushNotificationService } from '@/services/push-notification.service';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to setup and manage push notifications
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (!user) return;

    // Register for push notifications
    const registerForPushNotifications = async () => {
      try {
        const token = await PushNotificationService.registerForPushNotifications();
        if (token) {
          setExpoPushToken(token);
          await PushNotificationService.registerTokenWithBackend(token);
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };

    registerForPushNotifications();

    // Setup notification listeners
    notificationListener.current = PushNotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
      }
    );

    responseListener.current = PushNotificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification response:', response);
        handleNotificationResponse(response);
      }
    );

    // Cleanup
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      if (expoPushToken) {
        PushNotificationService.unregisterTokenFromBackend(expoPushToken).catch(console.error);
      }
    };
  }, [user]);

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;

    // Navigate based on notification type
    if (data?.type === 'message') {
      router.push('/inbox');
    } else if (data?.type === 'task') {
      router.push('/(tabs)/plan');
    } else if (data?.type === 'goal') {
      if (data.goalId) {
        router.push(`/goals/${data.goalId}`);
      } else {
        router.push('/goals');
      }
    } else if (data?.type === 'workout') {
      router.push('/workout/log');
    } else if (data?.type === 'meal') {
      router.push('/meal/log');
    } else {
      router.push('/(tabs)/today');
    }
  };

  return {
    expoPushToken,
    notification,
  };
}

/**
 * Hook to manage badge count
 */
export function useBadgeCount() {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    const loadBadgeCount = async () => {
      const count = await PushNotificationService.getBadgeCount();
      setBadgeCount(count);
    };
    loadBadgeCount();
  }, []);

  const updateBadgeCount = async (count: number) => {
    await PushNotificationService.setBadgeCount(count);
    setBadgeCount(count);
  };

  const clearBadge = async () => {
    await PushNotificationService.clearBadge();
    setBadgeCount(0);
  };

  return {
    badgeCount,
    updateBadgeCount,
    clearBadge,
  };
}

/**
 * Hook to schedule local notifications
 */
export function useLocalNotifications() {
  const scheduleNotification = async (
    title: string,
    body: string,
    data?: Record<string, any>,
    trigger?: Notifications.NotificationTriggerInput
  ) => {
    return await PushNotificationService.scheduleLocalNotification(title, body, data, trigger);
  };

  const cancelNotification = async (notificationId: string) => {
    await PushNotificationService.cancelScheduledNotification(notificationId);
  };

  const cancelAllNotifications = async () => {
    await PushNotificationService.cancelAllScheduledNotifications();
  };

  return {
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
  };
}
