import { Platform } from 'react-native';

/**
 * Simple storage service that works on web and mobile
 * Uses localStorage for web, can be extended to use AsyncStorage for mobile
 */
export class StorageService {
  /**
   * Set an item in storage
   */
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        // For mobile, we'd use AsyncStorage here
        // For now, just use a simple in-memory store
        (global as any)[`storage_${key}`] = value;
      }
    } catch (error) {
      console.error('Failed to set storage item:', error);
      throw error;
    }
  }

  /**
   * Get an item from storage
   */
  static async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        // For mobile, we'd use AsyncStorage here
        return (global as any)[`storage_${key}`] || null;
      }
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return null;
    }
  }

  /**
   * Remove an item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        // For mobile, we'd use AsyncStorage here
        delete (global as any)[`storage_${key}`];
      }
    } catch (error) {
      console.error('Failed to remove storage item:', error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  static async clear(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.clear();
      } else {
        // For mobile, we'd use AsyncStorage here
        // Clear all storage_ prefixed items
        const keys = Object.keys(global as any).filter(k => k.startsWith('storage_'));
        keys.forEach(key => delete (global as any)[key]);
      }
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }
}
