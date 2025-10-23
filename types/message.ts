export interface MealAnalysis {
  food_items: string[];
  description: string;
  estimated_calories: number;
  estimated_protein_g: number;
  estimated_carbs_g: number;
  estimated_fat_g: number;
  quality_score: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutAnalysis {
  type: 'cardio' | 'strength' | 'flexibility' | 'rest' | 'sport';
  duration_minutes: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface Message {
  id: number;
  user_id: number;
  sender_type: 'user' | 'coach' | 'system';
  content: string;
  attachment_type: 'photo' | null;
  attachment_url: string | null;
  ai_analysis: MealAnalysis | WorkoutAnalysis | null;
  is_read: boolean;
  read_at: string | null;
  is_ai_generated: boolean;
  created_at: string;
}
