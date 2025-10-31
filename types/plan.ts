/**
 * Training plan and task types
 */

export interface Plan {
  id: string;
  user_id: string;
  coach_id: string;
  goal_id?: string;
  goal_summary: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  week_number: number;
  total_weeks: number;
  weeks: PlanWeek[];
  created_at: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface PlanWeek {
  week_index: number;
  start_date: string;
  end_date: string;
  focus?: string;
  notes?: string;
  tasks: PlanTask[];
}

export type TaskKind = 'workout' | 'habit' | 'rest' | 'assessment';
export type WorkoutType = 'run' | 'ride' | 'swim' | 'strength' | 'yoga' | 'pilates' | 'hiit' | 'walk' | 'other';
export type TaskStatus = 'scheduled' | 'completed' | 'missed' | 'skipped';

export interface PlanTask {
  id: string;
  plan_id: string;
  date: string;
  kind: TaskKind;
  title: string;
  description?: string;
  target?: WorkoutTarget;
  status: TaskStatus;
  completed_at?: string;
  workout_log_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface WorkoutTarget {
  type?: WorkoutType;
  distance_km?: number;
  duration_min?: number;
  pace_min_per_km?: number;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  heart_rate_zone?: number; // 1-5
  calories?: number;
  notes?: string;
}

export interface PlanSummary {
  plan_id: string;
  total_tasks: number;
  completed_tasks: number;
  missed_tasks: number;
  completion_rate: number;
  current_week: number;
  total_weeks: number;
  streak_days: number;
  last_activity_date?: string;
}

export interface CreatePlanRequest {
  goal_summary: string;
  goal_id?: string;
  total_weeks: number;
  weeks: Omit<PlanWeek, 'tasks'>[];
}

export interface UpdatePlanRequest {
  status?: Plan['status'];
  goal_summary?: string;
}

export interface CreateTaskRequest {
  plan_id: string;
  date: string;
  kind: TaskKind;
  title: string;
  description?: string;
  target?: WorkoutTarget;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  date?: string;
  target?: WorkoutTarget;
  status?: TaskStatus;
}
