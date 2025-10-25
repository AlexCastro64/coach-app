import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

export class TokenService {
  /**
   * Save authentication token securely
   * Uses SecureStore on native platforms, localStorage on web
   */
  static async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  /**
   * Get authentication token from secure storage
   * Uses SecureStore on native platforms, localStorage on web
   */
  static async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(TOKEN_KEY);
      } else {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Remove authentication token from secure storage
   * Uses SecureStore on native platforms, localStorage on web
   */
  static async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove authentication token');
    }
  }

  /**
   * Check if user has a token stored
   */
  static async hasToken(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }
}
