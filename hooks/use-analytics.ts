/**
 * React Query hooks for Analytics and Stats
 */

import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';
import { DashboardStats, ProgressChart, Achievement, WeeklySummary, DateRangeParams, ProgressMetric } from '@/types';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  progress: (metric: ProgressMetric, period: string) => [...analyticsKeys.all, 'progress', metric, period] as const,
  achievements: () => [...analyticsKeys.all, 'achievements'] as const,
  recentAchievements: (limit: number) => [...analyticsKeys.all, 'achievements', 'recent', limit] as const,
  weeklySummary: (weekStart?: string) => [...analyticsKeys.all, 'weekly', weekStart] as const,
  activity: (filters?: DateRangeParams) => [...analyticsKeys.all, 'activity', filters] as const,
  streak: () => [...analyticsKeys.all, 'streak'] as const,
  completionRate: (filters?: DateRangeParams) => [...analyticsKeys.all, 'completion-rate', filters] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => AnalyticsService.getDashboardStats(),
    staleTime: 30_000,
  });
}

export function useProgressChart(metric: ProgressMetric, period: 'week' | 'month' | 'year') {
  return useQuery({
    queryKey: analyticsKeys.progress(metric, period),
    queryFn: () => AnalyticsService.getProgressChart(metric, period),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: analyticsKeys.achievements(),
    queryFn: () => AnalyticsService.getAchievements(),
  });
}

export function useRecentAchievements(limit: number = 5) {
  return useQuery({
    queryKey: analyticsKeys.recentAchievements(limit),
    queryFn: () => AnalyticsService.getRecentAchievements(limit),
  });
}

export function useWeeklySummary(weekStart?: string) {
  return useQuery({
    queryKey: analyticsKeys.weeklySummary(weekStart),
    queryFn: () => AnalyticsService.getWeeklySummary(weekStart),
  });
}

export function useCurrentWeekSummary() {
  return useQuery({
    queryKey: analyticsKeys.weeklySummary(),
    queryFn: () => AnalyticsService.getCurrentWeekSummary(),
    staleTime: 60_000,
  });
}

export function useStreakInfo() {
  return useQuery({
    queryKey: analyticsKeys.streak(),
    queryFn: () => AnalyticsService.getStreakInfo(),
  });
}
