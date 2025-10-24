import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

export class TokenService {
  /**
   * Save authentication token securely
   */
  static async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Failed to save authentication token');
    }
  }

  /**
   * Get authentication token from secure storage
   */
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Remove authentication token from secure storage
   */
  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
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
