/**
 * Analytics and progress tracking types
 */

export interface DashboardStats {
  today: TodayStats;
  week: WeekStats;
  overall: OverallStats;
}

export interface TodayStats {
  date: string;
  tasks_scheduled: number;
  tasks_completed: number;
  workouts_completed: number;
  meals_logged: number;
  habits_completed: number;
  total_duration_min: number;
  total_distance_km: number;
  total_calories: number;
}

export interface WeekStats {
  week_start: string;
  week_end: string;
  week_number: number;
  tasks_scheduled: number;
  tasks_completed: number;
  completion_rate: number;
  workouts_completed: number;
  total_duration_min: number;
  total_distance_km: number;
  total_calories: number;
  meals_logged: number;
  habits_completion_rate: number;
  active_days: number;
}

export interface OverallStats {
  total_workouts: number;
  total_duration_min: number;
  total_distance_km: number;
  total_calories: number;
  total_meals_logged: number;
  current_streak_days: number;
  longest_streak_days: number;
  member_since: string;
  total_days_active: number;
  avg_workouts_per_week: number;
  goals_completed: number;
  goals_active: number;
}

export interface ProgressChart {
  period: 'week' | 'month' | 'year';
  data_points: ProgressDataPoint[];
  metric: ProgressMetric;
}

export type ProgressMetric =
  | 'workouts'
  | 'duration'
  | 'distance'
  | 'calories'
  | 'weight'
  | 'completion_rate'
  | 'streak';

export interface ProgressDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon?: string;
  earned_at: string;
  metadata?: Record<string, any>;
}

export type AchievementType =
  | 'first_workout'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'workouts_10'
  | 'workouts_50'
  | 'workouts_100'
  | 'distance_100km'
  | 'distance_500km'
  | 'distance_1000km'
  | 'goal_completed'
  | 'perfect_week'
  | 'early_bird'
  | 'consistency_champion';

export interface WeeklySummary {
  week_start: string;
  week_end: string;
  stats: WeekStats;
  highlights: string[];
  areas_for_improvement: string[];
  coach_notes?: string;
  next_week_focus?: string;
}
