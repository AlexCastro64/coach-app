/**
 * User-related types
 */

export type Role = 'client' | 'coach' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  timezone?: string;
  country?: string;
  created_at: string;
  updated_at?: string;
  onboarding_completed?: boolean;
}

export interface UserProfile {
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  fitness_level?: 'beginner' | 'intermediate' | 'advanced';
  goals: GoalData[];
  current_metrics?: CurrentMetrics;
  injuries?: string[];
  medical_conditions?: string[];
  created_at: string;
  updated_at?: string;
}

export interface GoalData {
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_fitness' | 'custom';
  description: string;
  target_value?: number;
  target_unit?: string;
  target_date?: string;
}

export interface CurrentMetrics {
  weight_kg?: number;
  body_fat_percentage?: number;
  muscle_mass_kg?: number;
  resting_heart_rate?: number;
  vo2_max?: number;
  measured_at?: string;
}
