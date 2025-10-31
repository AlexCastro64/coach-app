/**
 * Workout logging types
 */

import { WorkoutType } from './plan';

export interface WorkoutLog {
  id: string;
  user_id: string;
  plan_task_id?: string;
  date: string;
  type: WorkoutType;
  title?: string;
  actual: WorkoutActual;
  notes?: string;
  evidence_url?: string;
  coach_feedback?: string;
  coach_feedback_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkoutActual {
  duration_min?: number;
  distance_km?: number;
  pace_min_per_km?: number;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  avg_heart_rate?: number;
  max_heart_rate?: number;
  calories?: number;
  elevation_gain_m?: number;
  notes?: string;
}

export interface WorkoutStats {
  total_workouts: number;
  total_duration_min: number;
  total_distance_km: number;
  total_calories: number;
  avg_rpe?: number;
  workouts_by_type: Record<WorkoutType, number>;
  current_week_count: number;
  last_workout_date?: string;
}

export interface WorkoutSummary {
  date: string;
  workouts: WorkoutLog[];
  total_duration_min: number;
  total_distance_km: number;
  total_calories: number;
}

export interface CreateWorkoutLogRequest {
  plan_task_id?: string;
  date: string;
  type: WorkoutType;
  title?: string;
  actual: WorkoutActual;
  notes?: string;
  evidence_file?: File | Blob;
}

export interface UpdateWorkoutLogRequest {
  type?: WorkoutType;
  title?: string;
  actual?: Partial<WorkoutActual>;
  notes?: string;
}

export interface WorkoutPreset {
  id: string;
  name: string;
  type: WorkoutType;
  default_values: Partial<WorkoutActual>;
  is_custom: boolean;
}

// Common workout presets
export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: 'easy_run_2k',
    name: '2 km Easy Run',
    type: 'run',
    default_values: { distance_km: 2, rpe: 3 },
    is_custom: false,
  },
  {
    id: 'easy_run_5k',
    name: '5 km Easy Run',
    type: 'run',
    default_values: { distance_km: 5, rpe: 4 },
    is_custom: false,
  },
  {
    id: 'walk_30min',
    name: '30 min Walk',
    type: 'walk',
    default_values: { duration_min: 30, rpe: 2 },
    is_custom: false,
  },
  {
    id: 'strength_45min',
    name: '45 min Strength',
    type: 'strength',
    default_values: { duration_min: 45, rpe: 6 },
    is_custom: false,
  },
  {
    id: 'yoga_60min',
    name: '60 min Yoga',
    type: 'yoga',
    default_values: { duration_min: 60, rpe: 3 },
    is_custom: false,
  },
];
