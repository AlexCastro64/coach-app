/**
 * Milestone Item Component
 * Displays a single milestone with status
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Milestone } from '@/types';

interface MilestoneItemProps {
  milestone: Milestone;
  onPress?: () => void;
  onComplete?: (milestoneId: string) => void;
}

const STATUS_COLORS = {
  pending: '#6B7280',
  in_progress: '#3B82F6',
  completed: '#10B981',
  missed: '#EF4444',
};

export function MilestoneItem({ milestone, onPress, onComplete }: MilestoneItemProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const statusColor = STATUS_COLORS[milestone.status];
  const isCompleted = milestone.status === 'completed';

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = () => {
    switch (milestone.status) {
      case 'completed':
        return 'checkmark.circle.fill';
      case 'in_progress':
        return 'circle.lefthalf.filled';
      case 'missed':
        return 'xmark.circle.fill';
      default:
        return 'circle';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.container,
          { borderColor },
          isCompleted && styles.completedContainer,
        ]}
      >
        <TouchableOpacity
          onPress={() => onComplete?.(milestone.id)}
          disabled={isCompleted}
          style={styles.iconButton}
        >
          <IconSymbol name={getStatusIcon()} size={24} color={statusColor} />
        </TouchableOpacity>

        <View style={styles.content}>
          <ThemedText
            style={[styles.title, isCompleted && styles.completedText]}
            numberOfLines={2}
          >
            {milestone.title}
          </ThemedText>

          {milestone.description && (
            <ThemedText style={styles.description} numberOfLines={1}>
              {milestone.description}
            </ThemedText>
          )}

          <View style={styles.footer}>
            {milestone.target_date && (
              <View style={styles.dateContainer}>
                <IconSymbol name="calendar" size={12} color="#999" />
                <ThemedText style={styles.date}>
                  {formatDate(milestone.target_date)}
                </ThemedText>
              </View>
            )}

            {milestone.target_value && milestone.target_unit && (
              <View style={styles.targetContainer}>
                <IconSymbol name="target" size={12} color="#999" />
                <ThemedText style={styles.target}>
                  {milestone.target_value} {milestone.target_unit}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.orderBadge, { backgroundColor: `${statusColor}15` }]}>
          <ThemedText style={[styles.orderText, { color: statusColor }]}>
            {milestone.order}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  completedContainer: {
    opacity: 0.6,
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 13,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 11,
    opacity: 0.6,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  target: {
    fontSize: 11,
    opacity: 0.6,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
