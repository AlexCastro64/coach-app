/**
 * Meal Card Component
 * Displays a logged meal with AI feedback
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Meal } from '@/types';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
}

const MEAL_TYPE_ICONS: Record<Meal['meal_type'], string> = {
  breakfast: 'sunrise.fill',
  lunch: 'sun.max.fill',
  dinner: 'moon.stars.fill',
  snack: 'leaf.fill',
  other: 'fork.knife',
};

export function MealCard({ meal, onPress }: MealCardProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getMealTypeLabel = (type: Meal['meal_type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={[styles.card, { borderColor }]}>
        {/* Meal Image */}
        <Image source={{ uri: meal.image_url }} style={styles.image} />

        {/* Meal Info */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.typeContainer}>
              <IconSymbol
                name={MEAL_TYPE_ICONS[meal.meal_type]}
                size={16}
                color={tintColor}
              />
              <ThemedText style={styles.type}>
                {getMealTypeLabel(meal.meal_type)}
              </ThemedText>
            </View>
            <ThemedText style={styles.time}>{formatTime(meal.logged_at)}</ThemedText>
          </View>

          {meal.description && (
            <ThemedText style={styles.description} numberOfLines={2}>
              {meal.description}
            </ThemedText>
          )}

          {/* AI Feedback */}
          {meal.ai_feedback && (
            <View style={styles.aiFeedback}>
              {meal.ai_feedback.macro_estimate && (
                <View style={styles.macros}>
                  <View style={styles.macroItem}>
                    <ThemedText style={styles.macroValue}>
                      {meal.ai_feedback.macro_estimate.calories}
                    </ThemedText>
                    <ThemedText style={styles.macroLabel}>cal</ThemedText>
                  </View>
                  <View style={styles.macroItem}>
                    <ThemedText style={styles.macroValue}>
                      {meal.ai_feedback.macro_estimate.protein_g}g
                    </ThemedText>
                    <ThemedText style={styles.macroLabel}>protein</ThemedText>
                  </View>
                  <View style={styles.macroItem}>
                    <ThemedText style={styles.macroValue}>
                      {meal.ai_feedback.macro_estimate.carbs_g}g
                    </ThemedText>
                    <ThemedText style={styles.macroLabel}>carbs</ThemedText>
                  </View>
                  <View style={styles.macroItem}>
                    <ThemedText style={styles.macroValue}>
                      {meal.ai_feedback.macro_estimate.fat_g}g
                    </ThemedText>
                    <ThemedText style={styles.macroLabel}>fat</ThemedText>
                  </View>
                </View>
              )}

              {meal.ai_feedback.suggestion && (
                <View style={styles.suggestionContainer}>
                  <IconSymbol name="lightbulb.fill" size={14} color="#F59E0B" />
                  <ThemedText style={styles.suggestion} numberOfLines={2}>
                    {meal.ai_feedback.suggestion}
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {/* Coach Feedback */}
          {meal.coach_feedback && (
            <View style={[styles.coachFeedback, { borderColor }]}>
              <IconSymbol name="person.fill" size={14} color={tintColor} />
              <ThemedText style={styles.coachFeedbackText} numberOfLines={2}>
                {meal.coach_feedback}
              </ThemedText>
            </View>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    opacity: 0.6,
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  aiFeedback: {
    gap: 12,
  },
  macros: {
    flexDirection: 'row',
    gap: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  macroLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
  },
  suggestion: {
    fontSize: 13,
    color: '#92400E',
    flex: 1,
  },
  coachFeedback: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  coachFeedbackText: {
    fontSize: 13,
    flex: 1,
  },
});
