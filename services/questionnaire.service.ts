/**
 * Questionnaire Service
 * Handles questionnaire data and submissions
 */

import { apiClient } from './api.client';
import { Questionnaire, QuestionnaireTemplate, QuestionnaireResponse } from '@/types/questionnaire';

export class QuestionnaireService {
  /**
   * Get questionnaire template for plan creation
   */
  static async getPlanQuestionnaireTemplate(): Promise<QuestionnaireTemplate> {
    const response = await apiClient.get('/api/questionnaires/plan-creation');
    return response.data;
  }

  /**
   * Get user's current questionnaire
   */
  static async getCurrentQuestionnaire(): Promise<Questionnaire | null> {
    const response = await apiClient.get('/api/questionnaires/current');
    return response.data;
  }

  /**
   * Start a new questionnaire
   */
  static async startQuestionnaire(): Promise<Questionnaire> {
    const response = await apiClient.post('/api/questionnaires/start');
    return response.data;
  }

  /**
   * Submit questionnaire responses
   */
  static async submitResponses(
    questionnaireId: string,
    responses: QuestionnaireResponse[]
  ): Promise<Questionnaire> {
    const response = await apiClient.post(`/api/questionnaires/${questionnaireId}/responses`, {
      responses,
    });
    return response.data;
  }

  /**
   * Complete questionnaire
   */
  static async completeQuestionnaire(questionnaireId: string): Promise<Questionnaire> {
    const response = await apiClient.post(`/api/questionnaires/${questionnaireId}/complete`);
    return response.data;
  }

  /**
   * Check if user needs to complete questionnaire
   */
  static async needsQuestionnaire(): Promise<boolean> {
    const response = await apiClient.get('/api/questionnaires/needs-completion');
    return response.data.needs_completion;
  }
}
