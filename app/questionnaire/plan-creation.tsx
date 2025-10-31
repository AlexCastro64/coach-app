/**
 * Plan Creation Questionnaire Screen
 * Post-onboarding questions to help coach create personalized plan
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  usePlanQuestionnaireTemplate,
  useStartQuestionnaire,
  useSubmitResponses,
  useCompleteQuestionnaire,
} from '@/hooks/use-questionnaire';
import { Question, QuestionnaireResponse } from '@/types/questionnaire';

export default function PlanCreationQuestionnaire() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questionnaireId, setQuestionnaireId] = useState<string | null>(null);

  const { data: template, isLoading, error, refetch } = usePlanQuestionnaireTemplate();
  const startMutation = useStartQuestionnaire();
  const submitMutation = useSubmitResponses();
  const completeMutation = useCompleteQuestionnaire();

  useEffect(() => {
    // Start questionnaire when component mounts
    if (!questionnaireId) {
      startMutation.mutate(undefined, {
        onSuccess: (data) => {
          setQuestionnaireId(data.id);
        },
      });
    }
  }, []);

  if (isLoading || startMutation.isPending) {
    return <LoadingSpinner message="Loading questions..." fullScreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load questionnaire"
        onRetry={refetch}
        fullScreen
      />
    );
  }

  if (!template || !questionnaireId) {
    return null;
  }

  const currentSection = template.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const totalQuestions = template.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswer = (questionId: string, answer: any) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  const handleNext = async () => {
    if (!responses[currentQuestion.id] && currentQuestion.required) {
      Alert.alert('Required', 'Please answer this question to continue');
      return;
    }

    // Save current response
    if (responses[currentQuestion.id]) {
      const response: QuestionnaireResponse = {
        question_id: currentQuestion.id,
        question_text: currentQuestion.text,
        answer: responses[currentQuestion.id],
        answered_at: new Date().toISOString(),
      };

      await submitMutation.mutateAsync({
        questionnaireId,
        responses: [response],
      });
    }

    // Move to next question
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < template.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Completed all questions
      await completeMutation.mutateAsync(questionnaireId);
      Alert.alert(
        'Complete!',
        'Thank you! Your coach will create your personalized plan based on your answers.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)/today'),
          },
        ]
      );
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      const prevSection = template.sections[currentSectionIndex - 1];
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const canGoBack = currentSectionIndex > 0 || currentQuestionIndex > 0;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {canGoBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={tintColor} />
          </TouchableOpacity>
        )}
        <View style={styles.headerContent}>
          <ThemedText type="title">Build Your Plan</ThemedText>
          <ThemedText style={styles.subtitle}>
            Section {currentSectionIndex + 1} of {template.sections.length}
          </ThemedText>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { borderColor }]}>
          <View
            style={[styles.progressFill, { width: `${progress}%`, backgroundColor: tintColor }]}
          />
        </View>
        <ThemedText style={styles.progressText}>
          {answeredQuestions} of {totalQuestions} questions answered
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>{currentSection.title}</ThemedText>
          {currentSection.description && (
            <ThemedText style={styles.sectionDescription}>
              {currentSection.description}
            </ThemedText>
          )}
        </View>

        {/* Question */}
        <QuestionInput
          question={currentQuestion}
          value={responses[currentQuestion.id]}
          onChange={(value) => handleAnswer(currentQuestion.id, value)}
          borderColor={borderColor}
          tintColor={tintColor}
        />

        {/* Help Text */}
        {currentQuestion.help_text && (
          <ThemedView style={[styles.helpCard, { borderColor }]}>
            <IconSymbol name="info.circle" size={16} color={tintColor} />
            <ThemedText style={styles.helpText}>{currentQuestion.help_text}</ThemedText>
          </ThemedView>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: tintColor }]}
          onPress={handleNext}
          disabled={submitMutation.isPending || completeMutation.isPending}
        >
          {submitMutation.isPending || completeMutation.isPending ? (
            <LoadingSpinner size="small" />
          ) : (
            <ThemedText style={styles.nextButtonText}>
              {currentSectionIndex === template.sections.length - 1 &&
              currentQuestionIndex === currentSection.questions.length - 1
                ? 'Complete'
                : 'Next'}
            </ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  borderColor: string;
  tintColor: string;
}

function QuestionInput({ question, value, onChange, borderColor, tintColor }: QuestionInputProps) {
  const textColor = useThemeColor({}, 'text');

  switch (question.type) {
    case 'text':
      return (
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>{question.text}</ThemedText>
          {question.required && <ThemedText style={styles.required}>*</ThemedText>}
          <TextInput
            style={[styles.textInput, { color: textColor, borderColor }]}
            placeholder={question.placeholder || 'Type your answer...'}
            placeholderTextColor={textColor + '50'}
            value={value || ''}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      );

    case 'number':
      return (
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>{question.text}</ThemedText>
          {question.required && <ThemedText style={styles.required}>*</ThemedText>}
          <TextInput
            style={[styles.textInput, { color: textColor, borderColor }]}
            placeholder={question.placeholder || 'Enter a number...'}
            placeholderTextColor={textColor + '50'}
            value={value?.toString() || ''}
            onChangeText={(text) => onChange(text ? parseFloat(text) : null)}
            keyboardType="numeric"
          />
        </View>
      );

    case 'single_choice':
      return (
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>{question.text}</ThemedText>
          {question.required && <ThemedText style={styles.required}>*</ThemedText>}
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  { borderColor },
                  value === option && { backgroundColor: tintColor + '20', borderColor: tintColor },
                ]}
                onPress={() => onChange(option)}
              >
                <ThemedText
                  style={[styles.optionText, value === option && { fontWeight: '600' }]}
                >
                  {option}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );

    case 'multiple_choice':
      const selectedOptions = value || [];
      return (
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>{question.text}</ThemedText>
          {question.required && <ThemedText style={styles.required}>*</ThemedText>}
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    { borderColor },
                    isSelected && { backgroundColor: tintColor + '20', borderColor: tintColor },
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      onChange(selectedOptions.filter((o: string) => o !== option));
                    } else {
                      onChange([...selectedOptions, option]);
                    }
                  }}
                >
                  <ThemedText style={[styles.optionText, isSelected && { fontWeight: '600' }]}>
                    {option}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      );

    case 'scale':
      return (
        <View style={styles.questionContainer}>
          <ThemedText style={styles.questionText}>{question.text}</ThemedText>
          {question.required && <ThemedText style={styles.required}>*</ThemedText>}
          <View style={styles.scaleContainer}>
            {Array.from(
              { length: (question.max_value || 10) - (question.min_value || 1) + 1 },
              (_, i) => (question.min_value || 1) + i
            ).map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.scaleButton,
                  { borderColor },
                  value === num && { backgroundColor: tintColor, borderColor: tintColor },
                ]}
                onPress={() => onChange(num)}
              >
                <ThemedText
                  style={[styles.scaleText, value === num && { color: '#fff', fontWeight: '700' }]}
                >
                  {num}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <ThemedText style={styles.scaleLabel}>Low</ThemedText>
            <ThemedText style={styles.scaleLabel}>High</ThemedText>
          </View>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 26,
  },
  required: {
    color: '#EF4444',
    fontSize: 18,
    marginLeft: 4,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scaleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  helpCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  nextButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
