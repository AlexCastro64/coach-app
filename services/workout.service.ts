/**
 * Workout Service
 * Handles all workout logging and tracking API calls
 */

import { apiClient } from './api.client';
import {
  WorkoutLog,
  WorkoutStats,
  WorkoutSummary,
  CreateWorkoutLogRequest,
  UpdateWorkoutLogRequest,
  ApiResponse,
  DateRangeParams,
} from '@/types';

export class WorkoutService {
  /**
   * Get all workout logs for the user
   */
  static async getWorkouts(params?: DateRangeParams): Promise<WorkoutLog[]> {
    const response = await apiClient.get<ApiResponse<WorkoutLog[]>>('/me/workouts', { params });
    return response.data.data;
  }

  /**
   * Get a specific workout log
   */
  static async getWorkout(workoutId: string): Promise<WorkoutLog> {
    const response = await apiClient.get<ApiResponse<WorkoutLog>>(`/workouts/${workoutId}`);
    return response.data.data;
  }

  /**
   * Create a new workout log
   */
  static async createWorkout(data: Omit<CreateWorkoutLogRequest, 'evidence_file'>): Promise<WorkoutLog> {
    const response = await apiClient.post<ApiResponse<WorkoutLog>>('/me/workouts', data);
    return response.data.data;
  }

  /**
   * Create a workout log with evidence photo
   */
  static async createWorkoutWithEvidence(
    data: Omit<CreateWorkoutLogRequest, 'evidence_file'>,
    evidenceUri: string
  ): Promise<WorkoutLog> {
    // First, get presigned URL for upload
    const uploadData = await this.getPresignedUrl('workout-evidence');
    
    // Upload the image to S3
    const blob = await (await fetch(evidenceUri)).blob();
    await this.uploadToS3(uploadData.url, uploadData.fields, blob);

    // Create workout log with evidence URL
    const response = await apiClient.post<ApiResponse<WorkoutLog>>('/me/workouts', {
      ...data,
      evidence_key: uploadData.fields.key,
    });
    return response.data.data;
  }

  /**
   * Update a workout log
   */
  static async updateWorkout(workoutId: string, data: UpdateWorkoutLogRequest): Promise<WorkoutLog> {
    const response = await apiClient.put<ApiResponse<WorkoutLog>>(`/workouts/${workoutId}`, data);
    return response.data.data;
  }

  /**
   * Delete a workout log
   */
  static async deleteWorkout(workoutId: string): Promise<void> {
    await apiClient.delete(`/workouts/${workoutId}`);
  }

  /**
   * Get workout statistics
   */
  static async getWorkoutStats(params?: DateRangeParams): Promise<WorkoutStats> {
    const response = await apiClient.get<ApiResponse<WorkoutStats>>('/me/workouts/stats', { params });
    return response.data.data;
  }

  /**
   * Get workout summary by date
   */
  static async getWorkoutSummary(date: string): Promise<WorkoutSummary> {
    const response = await apiClient.get<ApiResponse<WorkoutSummary>>(`/me/workouts/summary/${date}`);
    return response.data.data;
  }

  /**
   * Get today's workouts
   */
  static async getTodayWorkouts(): Promise<WorkoutLog[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getWorkouts({ from: today, to: today });
  }

  /**
   * Get this week's workouts
   */
  static async getWeekWorkouts(): Promise<WorkoutLog[]> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return this.getWorkouts({
      from: weekStart.toISOString().split('T')[0],
      to: weekEnd.toISOString().split('T')[0],
    });
  }

  /**
   * Get presigned URL for file upload
   */
  private static async getPresignedUrl(keyHint: string): Promise<{ url: string; fields: Record<string, string> }> {
    const response = await apiClient.post<ApiResponse<{ url: string; fields: Record<string, string> }>>(
      '/uploads/presign',
      { keyHint }
    );
    return response.data.data;
  }

  /**
   * Upload file to S3 using presigned URL
   */
  private static async uploadToS3(url: string, fields: Record<string, string>, file: Blob): Promise<void> {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file to S3');
    }
  }
}
