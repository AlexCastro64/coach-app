/**
 * Today Task Card Component
 * Displays a single task for today with completion action
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { PlanTask, WorkoutType } from '@/types';

interface TodayTaskCardProps {
  task: PlanTask;
  onComplete: (taskId: string) => void;
  onPress?: () => void;
}

const WORKOUT_ICONS: Record<WorkoutType, string> = {
  run: 'figure.run',
  ride: 'bicycle',
  swim: 'figure.pool.swim',
  strength: 'dumbbell.fill',
  yoga: 'figure.mind.and.body',
  pilates: 'figure.flexibility',
  hiit: 'flame.fill',
  walk: 'figure.walk',
  other: 'figure.mixed.cardio',
};

export function TodayTaskCard({ task, onComplete, onPress }: TodayTaskCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const isCompleted = task.status === 'completed';

  const handleComplete = () => {
    if (isCompleted) return;
    
    Alert.alert(
      'Complete Task',
      `Mark "${task.title}" as complete?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => onComplete(task.id) },
      ]
    );
  };

  const getIcon = () => {
    if (task.kind === 'workout' && task.target?.type) {
      return WORKOUT_ICONS[task.target.type] || 'figure.mixed.cardio';
    }
    if (task.kind === 'habit') return 'checkmark.circle';
    if (task.kind === 'rest') return 'bed.double.fill';
    return 'star.fill';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.card,
          { borderColor },
          isCompleted && styles.completedCard,
        ]}
      >
        <View style={styles.iconContainer}>
          <IconSymbol
            name={getIcon()}
            size={24}
            color={isCompleted ? '#10B981' : tintColor}
          />
        </View>

        <View style={styles.content}>
          <ThemedText
            style={[
              styles.title,
              isCompleted && styles.completedText,
            ]}
          >
            {task.title}
          </ThemedText>

          {task.description && (
            <ThemedText style={styles.description} numberOfLines={1}>
              {task.description}
            </ThemedText>
          )}

          {task.target && (
            <View style={styles.targetRow}>
              {task.target.distance_km && (
                <ThemedText style={styles.targetText}>
                  {task.target.distance_km} km
                </ThemedText>
              )}
              {task.target.duration_min && (
                <ThemedText style={styles.targetText}>
                  {task.target.duration_min} min
                </ThemedText>
              )}
              {task.target.rpe && (
                <ThemedText style={styles.targetText}>
                  RPE {task.target.rpe}
                </ThemedText>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleComplete}
          style={[
            styles.checkButton,
            isCompleted && { backgroundColor: '#10B981' },
          ]}
          disabled={isCompleted}
        >
          <IconSymbol
            name={isCompleted ? 'checkmark' : 'circle'}
            size={24}
            color={isCompleted ? '#fff' : tintColor}
          />
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  targetText: {
    fontSize: 12,
    opacity: 0.7,
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
