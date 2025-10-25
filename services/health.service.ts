import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface HealthCheckResult {
  status: 'success' | 'error';
  message: string;
  details: {
    apiUrl: string;
    responseTime?: number;
    errorType?: string;
    errorDetails?: string;
    troubleshooting?: string[];
  };
}

export class HealthService {
  /**
   * Check backend health endpoint
   * Returns detailed information about connection status and troubleshooting steps
   */
  static async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Create a dedicated axios instance without auth interceptors
      // to avoid any interference with the health check
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        },
      });

      const responseTime = Date.now() - startTime;

      return {
        status: 'success',
        message: 'Successfully connected to backend',
        details: {
          apiUrl: API_BASE_URL,
          responseTime,
        },
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const axiosError = error as AxiosError;

      // Determine error type and provide troubleshooting steps
      let errorType = 'Unknown Error';
      let errorDetails = 'An unexpected error occurred';
      let troubleshooting: string[] = [];

      if (axiosError.code === 'ECONNABORTED') {
        errorType = 'Timeout Error';
        errorDetails = 'Request timed out after 10 seconds';
        troubleshooting = [
          'Check if the backend server is running',
          'Verify the API URL in your .env file',
          'Check your network connection',
          'Backend may be slow - check server logs',
        ];
      } else if (axiosError.code === 'ERR_NETWORK' || axiosError.message.includes('Network Error')) {
        errorType = 'Network Error';
        errorDetails = 'Cannot reach the backend server';
        troubleshooting = [
          `Verify backend is running at: ${API_BASE_URL}`,
          'For Android emulator, use http://10.0.2.2:PORT/api instead of localhost',
          'For physical devices, use your computer\'s IP (e.g., http://192.168.1.x:PORT/api)',
          'Check if your .env file exists and has EXPO_PUBLIC_API_URL set correctly',
          'Ensure backend server is accessible from your device/emulator',
          'Check firewall settings that might block the connection',
        ];
      } else if (axiosError.response) {
        errorType = `HTTP ${axiosError.response.status} Error`;
        errorDetails = axiosError.response.statusText || 'Server responded with an error';
        troubleshooting = [
          'Backend is reachable but returned an error',
          'Check backend logs for errors',
          'Verify the /api/health endpoint is properly configured',
          `Status: ${axiosError.response.status}`,
        ];
      } else if (axiosError.request) {
        errorType = 'No Response';
        errorDetails = 'Request was sent but no response received';
        troubleshooting = [
          'Backend server might be down',
          'Check if backend is running',
          'Verify CORS settings on backend',
          'Check network connectivity',
        ];
      }

      return {
        status: 'error',
        message: `Failed to connect: ${errorType}`,
        details: {
          apiUrl: API_BASE_URL,
          responseTime,
          errorType,
          errorDetails,
          troubleshooting,
        },
      };
    }
  }

  /**
   * Get current API base URL
   */
  static getApiUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Get environment-specific configuration tips
   */
  static getConfigurationHelp(): string[] {
    return [
      'Configuration Guide:',
      '',
      '1. Create .env file in project root (copy from .env.example)',
      '',
      '2. Set EXPO_PUBLIC_API_URL based on your environment:',
      '   - Local Laravel dev: http://localhost:8000/api',
      '   - Docker/Nginx (port 80): http://localhost/api',
      '   - Android emulator: http://10.0.2.2:8000/api',
      '   - iOS simulator: http://localhost:8000/api',
      '   - Physical device: http://YOUR_COMPUTER_IP:8000/api',
      '',
      '3. Restart the Expo development server after changing .env',
      '',
      '4. Find your computer\'s IP:',
      '   - macOS/Linux: Run "ifconfig" or "ip addr"',
      '   - Windows: Run "ipconfig"',
      '   - Look for your local network IP (usually 192.168.x.x)',
    ];
  }
}
