/**
 * React Query hooks for Meal management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MealService } from '@/services/meal.service';
import {
  Meal,
  MealStats,
  DailyNutrition,
  UpdateMealRequest,
  DateRangeParams,
} from '@/types';

// Query keys
export const mealKeys = {
  all: ['meals'] as const,
  lists: () => [...mealKeys.all, 'list'] as const,
  list: (filters?: DateRangeParams) => [...mealKeys.lists(), filters] as const,
  details: () => [...mealKeys.all, 'detail'] as const,
  detail: (id: string) => [...mealKeys.details(), id] as const,
  stats: (filters?: DateRangeParams) => [...mealKeys.all, 'stats', filters] as const,
  daily: (date: string) => [...mealKeys.all, 'daily', date] as const,
  today: () => [...mealKeys.all, 'today'] as const,
  week: () => [...mealKeys.all, 'week'] as const,
};

/**
 * Get meals with optional date range
 */
export function useMeals(params?: DateRangeParams) {
  return useQuery({
    queryKey: mealKeys.list(params),
    queryFn: () => MealService.getMeals(params),
  });
}

/**
 * Get specific meal
 */
export function useMeal(mealId: string) {
  return useQuery({
    queryKey: mealKeys.detail(mealId),
    queryFn: () => MealService.getMeal(mealId),
    enabled: !!mealId,
  });
}

/**
 * Get today's meals
 */
export function useTodayMeals() {
  return useQuery({
    queryKey: mealKeys.today(),
    queryFn: () => MealService.getTodayMeals(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get this week's meals
 */
export function useWeekMeals() {
  return useQuery({
    queryKey: mealKeys.week(),
    queryFn: () => MealService.getWeekMeals(),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Get meal statistics
 */
export function useMealStats(params?: DateRangeParams) {
  return useQuery({
    queryKey: mealKeys.stats(params),
    queryFn: () => MealService.getMealStats(params),
  });
}

/**
 * Get daily nutrition summary
 */
export function useDailyNutrition(date: string) {
  return useQuery({
    queryKey: mealKeys.daily(date),
    queryFn: () => MealService.getDailyNutrition(date),
    enabled: !!date,
  });
}

/**
 * Upload a meal photo
 */
export function useUploadMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageUri,
      mealType,
      description,
    }: {
      imageUri: string;
      mealType: Meal['meal_type'];
      description?: string;
    }) => MealService.uploadMeal(imageUri, mealType, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealKeys.all });
    },
  });
}

/**
 * Update a meal
 */
export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mealId, data }: { mealId: string; data: UpdateMealRequest }) =>
      MealService.updateMeal(mealId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.detail(variables.mealId) });
      queryClient.invalidateQueries({ queryKey: mealKeys.all });
    },
  });
}

/**
 * Delete a meal
 */
export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mealId: string) => MealService.deleteMeal(mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealKeys.all });
    },
  });
}
