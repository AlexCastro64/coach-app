/**
 * Plan Task Item Component
 * Displays a task in the plan list
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { PlanTask, WorkoutType } from '@/types';

interface PlanTaskItemProps {
  task: PlanTask;
  onPress?: () => void;
  onComplete?: (taskId: string) => void;
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

const TASK_KIND_ICONS = {
  workout: 'figure.run',
  habit: 'checkmark.circle',
  rest: 'bed.double.fill',
  assessment: 'chart.bar.fill',
};

export function PlanTaskItem({ task, onPress, onComplete }: PlanTaskItemProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  
  const isCompleted = task.status === 'completed';
  const isMissed = task.status === 'missed';
  const isSkipped = task.status === 'skipped';

  const getIcon = () => {
    if (task.kind === 'workout' && task.target?.type) {
      return WORKOUT_ICONS[task.target.type] || 'figure.mixed.cardio';
    }
    return TASK_KIND_ICONS[task.kind] || 'star.fill';
  };

  const getStatusColor = () => {
    if (isCompleted) return '#10B981';
    if (isMissed) return '#EF4444';
    if (isSkipped) return '#F59E0B';
    return tintColor;
  };

  const getStatusIcon = () => {
    if (isCompleted) return 'checkmark.circle.fill';
    if (isMissed) return 'xmark.circle.fill';
    if (isSkipped) return 'arrow.right.circle.fill';
    return 'circle';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.container,
          { borderColor },
          (isCompleted || isMissed || isSkipped) && styles.completedContainer,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor()}15` }]}>
          <IconSymbol name={getIcon()} size={20} color={getStatusColor()} />
        </View>

        <View style={styles.content}>
          <ThemedText
            style={[
              styles.title,
              (isCompleted || isSkipped) && styles.completedText,
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
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {task.target.distance_km} km
                  </ThemedText>
                </View>
              )}
              {task.target.duration_min && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {task.target.duration_min} min
                  </ThemedText>
                </View>
              )}
              {task.target.rpe && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    RPE {task.target.rpe}
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {task.kind === 'rest' && (
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>Rest Day</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.statusContainer}>
          <IconSymbol
            name={getStatusIcon()}
            size={24}
            color={getStatusColor()}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  completedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  targetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    marginLeft: 8,
  },
});
