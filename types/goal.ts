/**
 * Goal and milestone tracking types
 */

export interface Goal {
  id: string;
  user_id: string;
  coach_id?: string;
  summary: string;
  description?: string;
  goal_type: 'performance' | 'habit' | 'body_composition' | 'skill' | 'custom';
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  milestones: Milestone[];
  progress_percentage: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  target_date?: string;
  target_value?: number;
  target_unit?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  order: number;
  completed_at?: string;
  created_at: string;
}

export interface GoalProgress {
  goal_id: string;
  current_value?: number;
  target_value?: number;
  unit?: string;
  percentage: number;
  milestones_completed: number;
  milestones_total: number;
  last_updated: string;
}

export interface CreateGoalRequest {
  summary: string;
  description?: string;
  goal_type: Goal['goal_type'];
  target_date?: string;
  priority?: Goal['priority'];
  milestones?: Omit<Milestone, 'id' | 'goal_id' | 'created_at' | 'completed_at'>[];
}

export interface UpdateGoalRequest {
  summary?: string;
  description?: string;
  target_date?: string;
  status?: Goal['status'];
  priority?: Goal['priority'];
}
