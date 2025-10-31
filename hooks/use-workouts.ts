/**
 * React Query hooks for Workout management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkoutService } from '@/services/workout.service';
import {
  WorkoutLog,
  WorkoutStats,
  WorkoutSummary,
  CreateWorkoutLogRequest,
  UpdateWorkoutLogRequest,
  DateRangeParams,
} from '@/types';

// Query keys
export const workoutKeys = {
  all: ['workouts'] as const,
  lists: () => [...workoutKeys.all, 'list'] as const,
  list: (filters?: DateRangeParams) => [...workoutKeys.lists(), filters] as const,
  details: () => [...workoutKeys.all, 'detail'] as const,
  detail: (id: string) => [...workoutKeys.details(), id] as const,
  stats: (filters?: DateRangeParams) => [...workoutKeys.all, 'stats', filters] as const,
  summary: (date: string) => [...workoutKeys.all, 'summary', date] as const,
  today: () => [...workoutKeys.all, 'today'] as const,
  week: () => [...workoutKeys.all, 'week'] as const,
};

/**
 * Get workouts with optional date range
 */
export function useWorkouts(params?: DateRangeParams) {
  return useQuery({
    queryKey: workoutKeys.list(params),
    queryFn: () => WorkoutService.getWorkouts(params),
  });
}

/**
 * Get specific workout
 */
export function useWorkout(workoutId: string) {
  return useQuery({
    queryKey: workoutKeys.detail(workoutId),
    queryFn: () => WorkoutService.getWorkout(workoutId),
    enabled: !!workoutId,
  });
}

/**
 * Get today's workouts
 */
export function useTodayWorkouts() {
  return useQuery({
    queryKey: workoutKeys.today(),
    queryFn: () => WorkoutService.getTodayWorkouts(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get this week's workouts
 */
export function useWeekWorkouts() {
  return useQuery({
    queryKey: workoutKeys.week(),
    queryFn: () => WorkoutService.getWeekWorkouts(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get workout statistics
 */
export function useWorkoutStats(params?: DateRangeParams) {
  return useQuery({
    queryKey: workoutKeys.stats(params),
    queryFn: () => WorkoutService.getWorkoutStats(params),
  });
}

/**
 * Get workout summary for a specific date
 */
export function useWorkoutSummary(date: string) {
  return useQuery({
    queryKey: workoutKeys.summary(date),
    queryFn: () => WorkoutService.getWorkoutSummary(date),
    enabled: !!date,
  });
}

/**
 * Create a workout log
 */
export function useCreateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateWorkoutLogRequest, 'evidence_file'>) =>
      WorkoutService.createWorkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

/**
 * Create a workout log with evidence photo
 */
export function useCreateWorkoutWithEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      evidenceUri,
    }: {
      data: Omit<CreateWorkoutLogRequest, 'evidence_file'>;
      evidenceUri: string;
    }) => WorkoutService.createWorkoutWithEvidence(data, evidenceUri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

/**
 * Update a workout log
 */
export function useUpdateWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutId, data }: { workoutId: string; data: UpdateWorkoutLogRequest }) =>
      WorkoutService.updateWorkout(workoutId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.detail(variables.workoutId) });
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

/**
 * Delete a workout log
 */
export function useDeleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: string) => WorkoutService.deleteWorkout(workoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}
