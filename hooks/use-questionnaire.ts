/**
 * Questionnaire Hooks
 * React Query hooks for questionnaire management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionnaireService } from '@/services/questionnaire.service';
import { QuestionnaireResponse } from '@/types/questionnaire';

/**
 * Get plan questionnaire template
 */
export function usePlanQuestionnaireTemplate() {
  return useQuery({
    queryKey: ['questionnaireTemplate', 'plan'],
    queryFn: QuestionnaireService.getPlanQuestionnaireTemplate,
  });
}

/**
 * Get current questionnaire
 */
export function useCurrentQuestionnaire() {
  return useQuery({
    queryKey: ['questionnaire', 'current'],
    queryFn: QuestionnaireService.getCurrentQuestionnaire,
  });
}

/**
 * Check if user needs to complete questionnaire
 */
export function useNeedsQuestionnaire() {
  return useQuery({
    queryKey: ['questionnaire', 'needs'],
    queryFn: QuestionnaireService.needsQuestionnaire,
  });
}

/**
 * Start questionnaire
 */
export function useStartQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: QuestionnaireService.startQuestionnaire,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaire'] });
    },
  });
}

/**
 * Submit questionnaire responses
 */
export function useSubmitResponses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionnaireId,
      responses,
    }: {
      questionnaireId: string;
      responses: QuestionnaireResponse[];
    }) => QuestionnaireService.submitResponses(questionnaireId, responses),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaire'] });
    },
  });
}

/**
 * Complete questionnaire
 */
export function useCompleteQuestionnaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionnaireId: string) =>
      QuestionnaireService.completeQuestionnaire(questionnaireId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaire'] });
      queryClient.invalidateQueries({ queryKey: ['plan'] });
    },
  });
}
