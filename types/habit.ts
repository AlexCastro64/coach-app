/**
 * Habit tracking types
 */

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  target_count: number; // per frequency period
  category?: HabitCategory;
  reminder_time?: string; // HH:MM format
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type HabitCategory = 
  | 'exercise'
  | 'nutrition'
  | 'sleep'
  | 'hydration'
  | 'mindfulness'
  | 'recovery'
  | 'custom';

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface HabitProgress {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  completion_rate: number; // percentage
  this_week_count: number;
  this_month_count: number;
  last_completed_at?: string;
}

export interface HabitStats {
  total_habits: number;
  active_habits: number;
  total_completions_today: number;
  total_completions_this_week: number;
  avg_completion_rate: number;
  habits_by_category: Record<HabitCategory, number>;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: HabitFrequency;
  target_count: number;
  category?: HabitCategory;
  reminder_time?: string;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  frequency?: HabitFrequency;
  target_count?: number;
  category?: HabitCategory;
  reminder_time?: string;
  is_active?: boolean;
}

export interface LogHabitRequest {
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}
