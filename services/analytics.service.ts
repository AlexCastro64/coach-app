/**
 * Analytics Service
 * Handles all analytics, stats, and progress tracking API calls
 */

import { apiClient } from './api.client';
import {
  DashboardStats,
  ProgressChart,
  Achievement,
  WeeklySummary,
  ApiResponse,
  DateRangeParams,
  ProgressMetric,
} from '@/types';

export class AnalyticsService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/me/stats/dashboard');
    return response.data.data;
  }

  /**
   * Get progress chart data
   */
  static async getProgressChart(
    metric: ProgressMetric,
    period: 'week' | 'month' | 'year'
  ): Promise<ProgressChart> {
    const response = await apiClient.get<ApiResponse<ProgressChart>>('/me/stats/progress', {
      params: { metric, period },
    });
    return response.data.data;
  }

  /**
   * Get user achievements
   */
  static async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get<ApiResponse<Achievement[]>>('/me/achievements');
    return response.data.data;
  }

  /**
   * Get recent achievements
   */
  static async getRecentAchievements(limit: number = 5): Promise<Achievement[]> {
    const response = await apiClient.get<ApiResponse<Achievement[]>>('/me/achievements/recent', {
      params: { limit },
    });
    return response.data.data;
  }

  /**
   * Get weekly summary
   */
  static async getWeeklySummary(weekStart?: string): Promise<WeeklySummary> {
    const response = await apiClient.get<ApiResponse<WeeklySummary>>('/me/stats/weekly', {
      params: { week_start: weekStart },
    });
    return response.data.data;
  }

  /**
   * Get current week summary
   */
  static async getCurrentWeekSummary(): Promise<WeeklySummary> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    return this.getWeeklySummary(weekStartStr);
  }

  /**
   * Get activity history
   */
  static async getActivityHistory(params?: DateRangeParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/me/stats/activity', { params });
    return response.data.data;
  }

  /**
   * Get streak information
   */
  static async getStreakInfo(): Promise<{ current_streak: number; longest_streak: number }> {
    const response = await apiClient.get<ApiResponse<{ current_streak: number; longest_streak: number }>>(
      '/me/stats/streak'
    );
    return response.data.data;
  }

  /**
   * Get completion rate over time
   */
  static async getCompletionRate(params?: DateRangeParams): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>('/me/stats/completion-rate', { params });
    return response.data.data;
  }
}
