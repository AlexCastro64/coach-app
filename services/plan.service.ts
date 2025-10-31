/**
 * Plan Service
 * Handles all plan-related API calls
 */

import { apiClient } from './api.client';
import {
  Plan,
  PlanTask,
  PlanSummary,
  CreatePlanRequest,
  UpdatePlanRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
} from '@/types';

export class PlanService {
  /**
   * Get the current active plan for the user
   */
  static async getCurrentPlan(): Promise<Plan> {
    const response = await apiClient.get<ApiResponse<Plan>>('/me/plan/current');
    return response.data.data;
  }

  /**
   * Get a specific plan by ID
   */
  static async getPlan(planId: string): Promise<Plan> {
    const response = await apiClient.get<ApiResponse<Plan>>(`/plans/${planId}`);
    return response.data.data;
  }

  /**
   * Get all plans for the user
   */
  static async getPlans(): Promise<Plan[]> {
    const response = await apiClient.get<ApiResponse<Plan[]>>('/me/plans');
    return response.data.data;
  }

  /**
   * Get plan summary/statistics
   */
  static async getPlanSummary(planId: string): Promise<PlanSummary> {
    const response = await apiClient.get<ApiResponse<PlanSummary>>(`/plans/${planId}/summary`);
    return response.data.data;
  }

  /**
   * Create a new plan
   */
  static async createPlan(data: CreatePlanRequest): Promise<Plan> {
    const response = await apiClient.post<ApiResponse<Plan>>('/plans', data);
    return response.data.data;
  }

  /**
   * Update an existing plan
   */
  static async updatePlan(planId: string, data: UpdatePlanRequest): Promise<Plan> {
    const response = await apiClient.put<ApiResponse<Plan>>(`/plans/${planId}`, data);
    return response.data.data;
  }

  /**
   * Delete a plan
   */
  static async deletePlan(planId: string): Promise<void> {
    await apiClient.delete(`/plans/${planId}`);
  }

  /**
   * Acknowledge that the user has seen the plan
   */
  static async acknowledgePlan(planId: string): Promise<void> {
    await apiClient.post(`/plans/${planId}/acknowledge`);
  }

  /**
   * Get a specific task
   */
  static async getTask(taskId: string): Promise<PlanTask> {
    const response = await apiClient.get<ApiResponse<PlanTask>>(`/tasks/${taskId}`);
    return response.data.data;
  }

  /**
   * Get tasks for a specific date range
   */
  static async getTasks(params?: { from?: string; to?: string }): Promise<PlanTask[]> {
    const response = await apiClient.get<ApiResponse<PlanTask[]>>('/me/tasks', { params });
    return response.data.data;
  }

  /**
   * Create a new task
   */
  static async createTask(data: CreateTaskRequest): Promise<PlanTask> {
    const response = await apiClient.post<ApiResponse<PlanTask>>('/tasks', data);
    return response.data.data;
  }

  /**
   * Update a task
   */
  static async updateTask(taskId: string, data: UpdateTaskRequest): Promise<PlanTask> {
    const response = await apiClient.put<ApiResponse<PlanTask>>(`/tasks/${taskId}`, data);
    return response.data.data;
  }

  /**
   * Complete a task
   */
  static async completeTask(taskId: string): Promise<PlanTask> {
    const response = await apiClient.post<ApiResponse<PlanTask>>(`/tasks/${taskId}/complete`);
    return response.data.data;
  }

  /**
   * Mark a task as missed
   */
  static async missTask(taskId: string): Promise<PlanTask> {
    const response = await apiClient.post<ApiResponse<PlanTask>>(`/tasks/${taskId}/miss`);
    return response.data.data;
  }

  /**
   * Skip a task
   */
  static async skipTask(taskId: string): Promise<PlanTask> {
    const response = await apiClient.post<ApiResponse<PlanTask>>(`/tasks/${taskId}/skip`);
    return response.data.data;
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}`);
  }

  /**
   * Get today's tasks
   */
  static async getTodayTasks(): Promise<PlanTask[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getTasks({ from: today, to: today });
  }

  /**
   * Get this week's tasks
   */
  static async getWeekTasks(): Promise<PlanTask[]> {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return this.getTasks({
      from: weekStart.toISOString().split('T')[0],
      to: weekEnd.toISOString().split('T')[0],
    });
  }
}
