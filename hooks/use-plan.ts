/**
 * React Query hooks for Plan management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlanService } from '@/services/plan.service';
import {
  Plan,
  PlanTask,
  PlanSummary,
  CreatePlanRequest,
  UpdatePlanRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '@/types';

// Query keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters: string) => [...planKeys.lists(), { filters }] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  current: () => [...planKeys.all, 'current'] as const,
  summary: (id: string) => [...planKeys.all, 'summary', id] as const,
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...planKeys.tasks.all, 'list'] as const,
    list: (filters?: any) => [...planKeys.tasks.lists(), filters] as const,
    detail: (id: string) => [...planKeys.tasks.all, 'detail', id] as const,
    today: () => [...planKeys.tasks.all, 'today'] as const,
    week: () => [...planKeys.tasks.all, 'week'] as const,
  },
};

/**
 * Get current active plan
 */
export function useCurrentPlan() {
  return useQuery({
    queryKey: planKeys.current(),
    queryFn: () => PlanService.getCurrentPlan(),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Get specific plan by ID
 */
export function usePlan(planId: string) {
  return useQuery({
    queryKey: planKeys.detail(planId),
    queryFn: () => PlanService.getPlan(planId),
    enabled: !!planId,
  });
}

/**
 * Get all plans
 */
export function usePlans() {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: () => PlanService.getPlans(),
  });
}

/**
 * Get plan summary
 */
export function usePlanSummary(planId: string) {
  return useQuery({
    queryKey: planKeys.summary(planId),
    queryFn: () => PlanService.getPlanSummary(planId),
    enabled: !!planId,
  });
}

/**
 * Get tasks with optional filters
 */
export function useTasks(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: planKeys.tasks.list(params),
    queryFn: () => PlanService.getTasks(params),
  });
}

/**
 * Get specific task
 */
export function useTask(taskId: string) {
  return useQuery({
    queryKey: planKeys.tasks.detail(taskId),
    queryFn: () => PlanService.getTask(taskId),
    enabled: !!taskId,
  });
}

/**
 * Get today's tasks
 */
export function useTodayTasks() {
  return useQuery({
    queryKey: planKeys.tasks.today(),
    queryFn: () => PlanService.getTodayTasks(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get this week's tasks
 */
export function useWeekTasks() {
  return useQuery({
    queryKey: planKeys.tasks.week(),
    queryFn: () => PlanService.getWeekTasks(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Create a new plan
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanRequest) => PlanService.createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

/**
 * Update a plan
 */
export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: UpdatePlanRequest }) =>
      PlanService.updatePlan(planId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.planId) });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Delete a plan
 */
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => PlanService.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
}

/**
 * Complete a task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => PlanService.completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Miss a task
 */
export function useMissTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => PlanService.missTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Skip a task
 */
export function useSkipTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => PlanService.skipTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Create a task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => PlanService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Update a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskRequest }) =>
      PlanService.updateTask(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}

/**
 * Delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => PlanService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}
