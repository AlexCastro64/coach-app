/**
 * Meal Service
 * Handles all meal tracking and nutrition API calls
 */

import { apiClient } from './api.client';
import {
  Meal,
  MealStats,
  DailyNutrition,
  CreateMealRequest,
  UpdateMealRequest,
  PresignedUploadResponse,
  ApiResponse,
  DateRangeParams,
} from '@/types';

export class MealService {
  /**
   * Get all meals for the user
   */
  static async getMeals(params?: DateRangeParams): Promise<Meal[]> {
    const response = await apiClient.get<ApiResponse<Meal[]>>('/me/meals', { params });
    return response.data.data;
  }

  /**
   * Get a specific meal
   */
  static async getMeal(mealId: string): Promise<Meal> {
    const response = await apiClient.get<ApiResponse<Meal>>(`/meals/${mealId}`);
    return response.data.data;
  }

  /**
   * Upload a meal photo and create meal log
   */
  static async uploadMeal(imageUri: string, mealType: Meal['meal_type'], description?: string): Promise<Meal> {
    // Step 1: Get presigned URL
    const keyHint = `meals/${Date.now()}`;
    const uploadData = await this.getPresignedUrl(keyHint);

    // Step 2: Upload image to S3
    const blob = await (await fetch(imageUri)).blob();
    await this.uploadToS3(uploadData.url, uploadData.fields, blob);

    // Step 3: Create meal record with image key
    const mealData: CreateMealRequest = {
      meal_type: mealType,
      image_key: uploadData.key,
      description,
      logged_at: new Date().toISOString(),
    };

    const response = await apiClient.post<ApiResponse<Meal>>('/me/meals', mealData);
    return response.data.data;
  }

  /**
   * Update a meal
   */
  static async updateMeal(mealId: string, data: UpdateMealRequest): Promise<Meal> {
    const response = await apiClient.put<ApiResponse<Meal>>(`/meals/${mealId}`, data);
    return response.data.data;
  }

  /**
   * Delete a meal
   */
  static async deleteMeal(mealId: string): Promise<void> {
    await apiClient.delete(`/meals/${mealId}`);
  }

  /**
   * Get meal statistics
   */
  static async getMealStats(params?: DateRangeParams): Promise<MealStats> {
    const response = await apiClient.get<ApiResponse<MealStats>>('/me/meals/stats', { params });
    return response.data.data;
  }

  /**
   * Get daily nutrition summary
   */
  static async getDailyNutrition(date: string): Promise<DailyNutrition> {
    const response = await apiClient.get<ApiResponse<DailyNutrition>>(`/me/meals/daily/${date}`);
    return response.data.data;
  }

  /**
   * Get today's meals
   */
  static async getTodayMeals(): Promise<Meal[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getMeals({ from: today, to: today });
  }

  /**
   * Get this week's meals
   */
  static async getWeekMeals(): Promise<Meal[]> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return this.getMeals({
      from: weekStart.toISOString().split('T')[0],
      to: weekEnd.toISOString().split('T')[0],
    });
  }

  /**
   * Get presigned URL for meal image upload
   */
  private static async getPresignedUrl(keyHint: string): Promise<PresignedUploadResponse> {
    const response = await apiClient.post<ApiResponse<PresignedUploadResponse>>(
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
      throw new Error('Failed to upload meal image to S3');
    }
  }
}
