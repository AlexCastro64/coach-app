import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenService } from './token.service';

// Base API URL - configured via EXPO_PUBLIC_API_URL in .env file
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost/api';

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await TokenService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        if (error.response) {
          console.error(`API Error: ${error.response.status} ${error.config?.url}`, error.response.data);
        } else if (error.request) {
          console.error('API Network Error: No response received', error.message);
        } else {
          console.error('API Error:', error.message);
        }
        
        if (error.response?.status === 401) {
          // Token expired or invalid - clear token
          await TokenService.removeToken();
          // You might want to trigger a logout event here
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance.client;
  }
}

export const apiClient = ApiClient.getInstance();
