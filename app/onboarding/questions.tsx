import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function OnboardingQuestions() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    attempts: '',
    longestStreak: '',
    biggestChallenge: '',
    whatsDifferent: '',
  });

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/onboarding/payment');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return answers.attempts.trim().length > 0;
      case 2:
        return answers.longestStreak.trim().length > 0;
      case 3:
        return answers.biggestChallenge.trim().length > 0;
      case 4:
        return answers.whatsDifferent.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
          </View>
          <ThemedText style={styles.progressText}>
            Question {currentStep} of 4
          </ThemedText>
        </View>

        {/* Question 1 */}
        {currentStep === 1 && (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionTitle}>
              Let's be honest...
            </ThemedText>
            <ThemedText style={styles.question}>
              How many times have you tried to reach your health and fitness goals before?
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
              placeholder="e.g., 5-6 times, too many to count, this is my first time..."
              placeholderTextColor={textColor + '50'}
              value={answers.attempts}
              onChangeText={(text) => setAnswers({ ...answers, attempts: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Question 2 */}
        {currentStep === 2 && (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionTitle}>
              What's your record?
            </ThemedText>
            <ThemedText style={styles.question}>
              What's the longest you've stuck with a health or fitness plan before giving up?
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
              placeholder="e.g., 2 weeks, 3 months, made it almost a year once..."
              placeholderTextColor={textColor + '50'}
              value={answers.longestStreak}
              onChangeText={(text) => setAnswers({ ...answers, longestStreak: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Question 3 */}
        {currentStep === 3 && (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionTitle}>
              The real issue...
            </ThemedText>
            <ThemedText style={styles.question}>
              What made you stop? What was the biggest challenge you faced?
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
              placeholder="e.g., lost motivation, got too busy, no one to keep me accountable..."
              placeholderTextColor={textColor + '50'}
              value={answers.biggestChallenge}
              onChangeText={(text) => setAnswers({ ...answers, biggestChallenge: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Question 4 */}
        {currentStep === 4 && (
          <View style={styles.questionContainer}>
            <ThemedText style={styles.questionTitle}>
              Here's the key difference...
            </ThemedText>
            <ThemedText style={styles.question}>
              What if you had someone checking in on you daily, tracking your progress, and holding you accountable? How would that change things?
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: textColor + '30' }]}
              placeholder="Share your thoughts..."
              placeholderTextColor={textColor + '50'}
              value={answers.whatsDifferent}
              onChangeText={(text) => setAnswers({ ...answers, whatsDifferent: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <ThemedView style={styles.insightCard}>
              <ThemedText style={styles.insightText}>
                That's exactly what Coach does. Daily check-ins, progress tracking, and real accountability to help you succeed where you've struggled before.
              </ThemedText>
            </ThemedView>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.continueButton,
              !canContinue() && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!canContinue()}
          >
            <ThemedText style={styles.continueButtonText}>
              {currentStep === 4 ? 'See How It Works' : 'Continue'}
            </ThemedText>
          </Pressable>

          <Pressable onPress={handleBack}>
            <ThemedText style={styles.backButton}>
              Go Back
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 40,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 36,
  },
  question: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
    opacity: 0.85,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    lineHeight: 24,
  },
  insightCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
    marginTop: 24,
  },
  insightText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#93C5FD',
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    opacity: 0.7,
  },
});
