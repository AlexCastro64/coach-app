export interface UserSettings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  dark_mode: boolean | 'auto';
  language: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  timezone?: string;
  country?: string;
}
