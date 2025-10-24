import { apiClient } from './api.client';
import { TokenService } from './token.service';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User
} from '../types/auth';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/register', credentials);

      // Save token to secure storage
      if (response.data.token) {
        await TokenService.saveToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/login', credentials);

      // Save token to secure storage
      if (response.data.token) {
        await TokenService.saveToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint (if available)
      await apiClient.post('/logout');
    } catch (error) {
      // Even if the API call fails, we should clear the local token
      console.error('Logout API call failed:', error);
    } finally {
      // Always remove token from storage
      await TokenService.removeToken();
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      }
      throw new Error('Failed to fetch user profile.');
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const hasToken = await TokenService.hasToken();
    if (!hasToken) {
      return false;
    }

    try {
      // Verify token is still valid by fetching user
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Token is invalid or expired
      await TokenService.removeToken();
      return false;
    }
  }
}
