/**
 * Meal tracking and nutrition types
 */

export interface Meal {
  id: string;
  user_id: string;
  meal_type: MealType;
  image_url: string;
  description?: string;
  logged_at: string;
  ai_feedback?: MealAIFeedback;
  coach_feedback?: string;
  coach_feedback_at?: string;
  created_at: string;
  updated_at?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';

export interface MealAIFeedback {
  macro_estimate?: MacroEstimate;
  suggestion?: string;
  confidence?: number; // 0-1
  detected_foods?: string[];
  portion_size?: 'small' | 'medium' | 'large';
  healthiness_score?: number; // 0-10
}

export interface MacroEstimate {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  calories: number;
  fiber_g?: number;
  sugar_g?: number;
}

export interface MealStats {
  total_meals: number;
  meals_this_week: number;
  avg_calories_per_day?: number;
  avg_protein_per_day?: number;
  last_meal_date?: string;
  meals_by_type: Record<MealType, number>;
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
  total_macros?: MacroEstimate;
  meal_count: number;
}

export interface CreateMealRequest {
  meal_type: MealType;
  image_key: string; // S3 key after upload
  description?: string;
  logged_at?: string;
}

export interface UpdateMealRequest {
  meal_type?: MealType;
  description?: string;
}

export interface PresignedUploadResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
}
