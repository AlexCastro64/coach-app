/**
 * Notification types
 */

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export type NotificationType =
  | 'message'
  | 'plan_updated'
  | 'task_reminder'
  | 'workout_feedback'
  | 'meal_feedback'
  | 'goal_milestone'
  | 'streak_achievement'
  | 'coach_assigned'
  | 'system';

export interface NotificationData {
  route?: string; // Deep link route
  message_id?: string;
  plan_id?: string;
  task_id?: string;
  workout_id?: string;
  meal_id?: string;
  goal_id?: string;
  [key: string]: any;
}

export interface PushToken {
  id: string;
  user_id: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface RegisterPushTokenRequest {
  token: string;
  platform?: 'ios' | 'android' | 'web';
}

export interface NotificationPreferences {
  user_id: string;
  push_enabled: boolean;
  email_enabled: boolean;
  message_notifications: boolean;
  plan_notifications: boolean;
  reminder_notifications: boolean;
  achievement_notifications: boolean;
  quiet_hours_start?: string; // HH:MM
  quiet_hours_end?: string; // HH:MM
}
