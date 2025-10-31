/**
 * React Query hooks for Habit management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HabitService } from '@/services/habit.service';
import {
  Habit,
  HabitLog,
  HabitProgress,
  HabitStats,
  CreateHabitRequest,
  UpdateHabitRequest,
  LogHabitRequest,
  DateRangeParams,
} from '@/types';

// Query keys
export const habitKeys = {
  all: ['habits'] as const,
  lists: () => [...habitKeys.all, 'list'] as const,
  list: (filters?: any) => [...habitKeys.lists(), filters] as const,
  details: () => [...habitKeys.all, 'detail'] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
  active: () => [...habitKeys.all, 'active'] as const,
  logs: (habitId: string, filters?: DateRangeParams) => [...habitKeys.all, 'logs', habitId, filters] as const,
  progress: (habitId: string) => [...habitKeys.all, 'progress', habitId] as const,
  stats: () => [...habitKeys.all, 'stats'] as const,
  todayLogs: () => [...habitKeys.all, 'today-logs'] as const,
};

/**
 * Get all habits
 */
export function useHabits() {
  return useQuery({
    queryKey: habitKeys.lists(),
    queryFn: () => HabitService.getHabits(),
  });
}

/**
 * Get active habits
 */
export function useActiveHabits() {
  return useQuery({
    queryKey: habitKeys.active(),
    queryFn: () => HabitService.getActiveHabits(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get specific habit
 */
export function useHabit(habitId: string) {
  return useQuery({
    queryKey: habitKeys.detail(habitId),
    queryFn: () => HabitService.getHabit(habitId),
    enabled: !!habitId,
  });
}

/**
 * Get habit logs
 */
export function useHabitLogs(habitId: string, params?: DateRangeParams) {
  return useQuery({
    queryKey: habitKeys.logs(habitId, params),
    queryFn: () => HabitService.getHabitLogs(habitId, params),
    enabled: !!habitId,
  });
}

/**
 * Get habit progress
 */
export function useHabitProgress(habitId: string) {
  return useQuery({
    queryKey: habitKeys.progress(habitId),
    queryFn: () => HabitService.getHabitProgress(habitId),
    enabled: !!habitId,
  });
}

/**
 * Get habit statistics
 */
export function useHabitStats() {
  return useQuery({
    queryKey: habitKeys.stats(),
    queryFn: () => HabitService.getHabitStats(),
  });
}

/**
 * Get today's habit logs
 */
export function useTodayHabitLogs() {
  return useQuery({
    queryKey: habitKeys.todayLogs(),
    queryFn: () => HabitService.getTodayHabitLogs(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Create a habit
 */
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHabitRequest) => HabitService.createHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Update a habit
 */
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, data }: { habitId: string; data: UpdateHabitRequest }) =>
      HabitService.updateHabit(habitId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(variables.habitId) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Delete a habit
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => HabitService.deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Log habit completion
 */
export function useLogHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LogHabitRequest) => HabitService.logHabit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}

/**
 * Toggle habit completion for today
 */
export function useToggleHabitToday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, completed }: { habitId: string; completed: boolean }) =>
      HabitService.toggleHabitToday(habitId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.todayLogs() });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
}
