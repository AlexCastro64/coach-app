/**
 * Questionnaire types for plan creation
 */

export interface QuestionnaireResponse {
  question_id: string;
  question_text: string;
  answer: string | string[] | number;
  answered_at: string;
}

export interface Questionnaire {
  id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  responses: QuestionnaireResponse[];
  completed_at?: string;
  created_at: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'single_choice' | 'multiple_choice' | 'scale';
  required: boolean;
  options?: string[];
  min_value?: number;
  max_value?: number;
  placeholder?: string;
  help_text?: string;
  order: number;
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface QuestionnaireTemplate {
  id: string;
  title: string;
  description: string;
  sections: QuestionnaireSection[];
}
