/**
 * React Query hooks for Goal management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GoalService } from '@/services/goal.service';
import {
  Goal,
  GoalProgress,
  Milestone,
  CreateGoalRequest,
  UpdateGoalRequest,
} from '@/types';

// Query keys
export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (filters?: any) => [...goalKeys.lists(), filters] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
  active: () => [...goalKeys.all, 'active'] as const,
  progress: (id: string) => [...goalKeys.all, 'progress', id] as const,
  milestones: (goalId: string) => [...goalKeys.all, 'milestones', goalId] as const,
};

/**
 * Get all goals
 */
export function useGoals() {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: () => GoalService.getGoals(),
  });
}

/**
 * Get active goals
 */
export function useActiveGoals() {
  return useQuery({
    queryKey: goalKeys.active(),
    queryFn: () => GoalService.getActiveGoals(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get specific goal
 */
export function useGoal(goalId: string) {
  return useQuery({
    queryKey: goalKeys.detail(goalId),
    queryFn: () => GoalService.getGoal(goalId),
    enabled: !!goalId,
  });
}

/**
 * Get goal progress
 */
export function useGoalProgress(goalId: string) {
  return useQuery({
    queryKey: goalKeys.progress(goalId),
    queryFn: () => GoalService.getGoalProgress(goalId),
    enabled: !!goalId,
  });
}

/**
 * Get goal milestones
 */
export function useGoalMilestones(goalId: string) {
  return useQuery({
    queryKey: goalKeys.milestones(goalId),
    queryFn: () => GoalService.getMilestones(goalId),
    enabled: !!goalId,
  });
}

/**
 * Create a goal
 */
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalRequest) => GoalService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Update a goal
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: UpdateGoalRequest }) =>
      GoalService.updateGoal(goalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Delete a goal
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => GoalService.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Complete a goal
 */
export function useCompleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => GoalService.completeGoal(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Pause a goal
 */
export function usePauseGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => GoalService.pauseGoal(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Resume a goal
 */
export function useResumeGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => GoalService.resumeGoal(goalId),
    onSuccess: (_, goalId) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) });
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Complete a milestone
 */
export function useCompleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (milestoneId: string) => GoalService.completeMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}

/**
 * Update a milestone
 */
export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      milestoneId,
      data,
    }: {
      milestoneId: string;
      data: { status?: Milestone['status']; target_date?: string };
    }) => GoalService.updateMilestone(milestoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
}
