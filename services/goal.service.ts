/**
 * Goal Service
 * Handles all goal and milestone API calls
 */

import { apiClient } from './api.client';
import {
  Goal,
  GoalProgress,
  Milestone,
  CreateGoalRequest,
  UpdateGoalRequest,
  ApiResponse,
} from '@/types';

export class GoalService {
  /**
   * Get all goals for the user
   */
  static async getGoals(): Promise<Goal[]> {
    const response = await apiClient.get<ApiResponse<Goal[]>>('/me/goals');
    return response.data.data;
  }

  /**
   * Get a specific goal
   */
  static async getGoal(goalId: string): Promise<Goal> {
    const response = await apiClient.get<ApiResponse<Goal>>(`/goals/${goalId}`);
    return response.data.data;
  }

  /**
   * Get active goals
   */
  static async getActiveGoals(): Promise<Goal[]> {
    const response = await apiClient.get<ApiResponse<Goal[]>>('/me/goals', {
      params: { status: 'active' },
    });
    return response.data.data;
  }

  /**
   * Create a new goal
   */
  static async createGoal(data: CreateGoalRequest): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>('/me/goals', data);
    return response.data.data;
  }

  /**
   * Update a goal
   */
  static async updateGoal(goalId: string, data: UpdateGoalRequest): Promise<Goal> {
    const response = await apiClient.put<ApiResponse<Goal>>(`/goals/${goalId}`, data);
    return response.data.data;
  }

  /**
   * Delete a goal
   */
  static async deleteGoal(goalId: string): Promise<void> {
    await apiClient.delete(`/goals/${goalId}`);
  }

  /**
   * Complete a goal
   */
  static async completeGoal(goalId: string): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>(`/goals/${goalId}/complete`);
    return response.data.data;
  }

  /**
   * Pause a goal
   */
  static async pauseGoal(goalId: string): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>(`/goals/${goalId}/pause`);
    return response.data.data;
  }

  /**
   * Resume a paused goal
   */
  static async resumeGoal(goalId: string): Promise<Goal> {
    const response = await apiClient.post<ApiResponse<Goal>>(`/goals/${goalId}/resume`);
    return response.data.data;
  }

  /**
   * Get goal progress
   */
  static async getGoalProgress(goalId: string): Promise<GoalProgress> {
    const response = await apiClient.get<ApiResponse<GoalProgress>>(`/goals/${goalId}/progress`);
    return response.data.data;
  }

  /**
   * Get milestones for a goal
   */
  static async getMilestones(goalId: string): Promise<Milestone[]> {
    const response = await apiClient.get<ApiResponse<Milestone[]>>(`/goals/${goalId}/milestones`);
    return response.data.data;
  }

  /**
   * Complete a milestone
   */
  static async completeMilestone(milestoneId: string): Promise<Milestone> {
    const response = await apiClient.post<ApiResponse<Milestone>>(`/milestones/${milestoneId}/complete`);
    return response.data.data;
  }

  /**
   * Update milestone status
   */
  static async updateMilestone(
    milestoneId: string,
    data: { status?: Milestone['status']; target_date?: string }
  ): Promise<Milestone> {
    const response = await apiClient.put<ApiResponse<Milestone>>(`/milestones/${milestoneId}`, data);
    return response.data.data;
  }
}
