/**
 * Goal Card Component
 * Displays a goal with progress and milestones
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Goal } from '@/types';

interface GoalCardProps {
  goal: Goal;
  onPress?: () => void;
}

const GOAL_TYPE_ICONS = {
  performance: 'figure.run',
  habit: 'checkmark.circle',
  body_composition: 'figure.stand',
  skill: 'star.fill',
  custom: 'target',
};

const STATUS_COLORS = {
  active: '#3B82F6',
  completed: '#10B981',
  paused: '#F59E0B',
  cancelled: '#6B7280',
};

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const statusColor = STATUS_COLORS[goal.status];

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const completedMilestones = goal.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = goal.milestones.length;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={[styles.card, { borderColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
            <IconSymbol
              name={GOAL_TYPE_ICONS[goal.goal_type]}
              size={24}
              color={statusColor}
            />
          </View>
          <View style={styles.headerContent}>
            <ThemedText style={styles.title} numberOfLines={2}>
              {goal.summary}
            </ThemedText>
            {goal.target_date && (
              <View style={styles.dateContainer}>
                <IconSymbol name="calendar" size={14} color="#999" />
                <ThemedText style={styles.date}>
                  Target: {formatDate(goal.target_date)}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <ThemedText style={styles.statusText}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </ThemedText>
          </View>
        </View>

        {/* Description */}
        {goal.description && (
          <ThemedText style={styles.description} numberOfLines={2}>
            {goal.description}
          </ThemedText>
        )}

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.progressLabel}>Progress</ThemedText>
            <ThemedText style={styles.progressValue}>
              {goal.progress_percentage}%
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: `${statusColor}20` }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${goal.progress_percentage}%`, backgroundColor: statusColor },
              ]}
            />
          </View>
        </View>

        {/* Milestones */}
        {totalMilestones > 0 && (
          <View style={styles.milestonesSection}>
            <IconSymbol name="flag.fill" size={14} color="#999" />
            <ThemedText style={styles.milestonesText}>
              {completedMilestones} of {totalMilestones} milestones completed
            </ThemedText>
          </View>
        )}

        {/* Priority Badge */}
        {goal.priority === 'high' && (
          <View style={styles.priorityBadge}>
            <IconSymbol name="exclamationmark.circle.fill" size={14} color="#EF4444" />
            <ThemedText style={styles.priorityText}>High Priority</ThemedText>
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  milestonesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  milestonesText: {
    fontSize: 12,
    opacity: 0.6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});
