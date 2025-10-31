/**
 * Habit Service
 * Handles all habit tracking API calls
 */

import { apiClient } from './api.client';
import {
  Habit,
  HabitLog,
  HabitProgress,
  HabitStats,
  CreateHabitRequest,
  UpdateHabitRequest,
  LogHabitRequest,
  ApiResponse,
  DateRangeParams,
} from '@/types';

export class HabitService {
  /**
   * Get all habits for the user
   */
  static async getHabits(): Promise<Habit[]> {
    const response = await apiClient.get<ApiResponse<Habit[]>>('/me/habits');
    return response.data.data;
  }

  /**
   * Get active habits
   */
  static async getActiveHabits(): Promise<Habit[]> {
    const response = await apiClient.get<ApiResponse<Habit[]>>('/me/habits', {
      params: { is_active: true },
    });
    return response.data.data;
  }

  /**
   * Get a specific habit
   */
  static async getHabit(habitId: string): Promise<Habit> {
    const response = await apiClient.get<ApiResponse<Habit>>(`/habits/${habitId}`);
    return response.data.data;
  }

  /**
   * Create a new habit
   */
  static async createHabit(data: CreateHabitRequest): Promise<Habit> {
    const response = await apiClient.post<ApiResponse<Habit>>('/me/habits', data);
    return response.data.data;
  }

  /**
   * Update a habit
   */
  static async updateHabit(habitId: string, data: UpdateHabitRequest): Promise<Habit> {
    const response = await apiClient.put<ApiResponse<Habit>>(`/habits/${habitId}`, data);
    return response.data.data;
  }

  /**
   * Delete a habit
   */
  static async deleteHabit(habitId: string): Promise<void> {
    await apiClient.delete(`/habits/${habitId}`);
  }

  /**
   * Log habit completion
   */
  static async logHabit(data: LogHabitRequest): Promise<HabitLog> {
    const response = await apiClient.post<ApiResponse<HabitLog>>('/me/habits/log', data);
    return response.data.data;
  }

  /**
   * Get habit logs
   */
  static async getHabitLogs(habitId: string, params?: DateRangeParams): Promise<HabitLog[]> {
    const response = await apiClient.get<ApiResponse<HabitLog[]>>(`/habits/${habitId}/logs`, { params });
    return response.data.data;
  }

  /**
   * Get habit progress
   */
  static async getHabitProgress(habitId: string): Promise<HabitProgress> {
    const response = await apiClient.get<ApiResponse<HabitProgress>>(`/habits/${habitId}/progress`);
    return response.data.data;
  }

  /**
   * Get habit statistics
   */
  static async getHabitStats(): Promise<HabitStats> {
    const response = await apiClient.get<ApiResponse<HabitStats>>('/me/habits/stats');
    return response.data.data;
  }

  /**
   * Get today's habit logs
   */
  static async getTodayHabitLogs(): Promise<HabitLog[]> {
    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get<ApiResponse<HabitLog[]>>('/me/habits/logs', {
      params: { date: today },
    });
    return response.data.data;
  }

  /**
   * Toggle habit completion for today
   */
  static async toggleHabitToday(habitId: string, completed: boolean): Promise<HabitLog> {
    const today = new Date().toISOString().split('T')[0];
    return this.logHabit({
      habit_id: habitId,
      date: today,
      completed,
    });
  }
}
