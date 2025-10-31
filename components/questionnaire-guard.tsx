/**
 * Questionnaire Guard Component
 * Redirects user to questionnaire if needed after onboarding
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useNeedsQuestionnaire } from '@/hooks/use-questionnaire';
import { useAuth } from '@/contexts/AuthContext';

export function QuestionnaireGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isAuthenticated } = useAuth();
  const { data: needsQuestionnaire, isLoading } = useNeedsQuestionnaire();

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user?.onboarding_completed) {
      return;
    }

    const inQuestionnaire = segments[0] === 'questionnaire';
    const inOnboarding = segments[0] === 'onboarding';

    // If user needs questionnaire and not already there, redirect
    if (needsQuestionnaire && !inQuestionnaire && !inOnboarding) {
      router.replace('/questionnaire/plan-creation');
    }
  }, [isAuthenticated, isLoading, needsQuestionnaire, segments, user]);

  return <>{children}</>;
}
