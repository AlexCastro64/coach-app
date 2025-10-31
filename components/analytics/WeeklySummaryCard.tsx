/**
 * Weekly Summary Card Component
 * Displays weekly progress summary
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { WeeklySummary } from '@/types';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Weekly Summary</ThemedText>
        <ThemedText style={styles.dateRange}>
          {formatDate(summary.week_start)} - {formatDate(summary.week_end)}
        </ThemedText>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{summary.stats.tasks_completed}</ThemedText>
          <ThemedText style={styles.statLabel}>Tasks Done</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{summary.stats.workouts_completed}</ThemedText>
          <ThemedText style={styles.statLabel}>Workouts</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{summary.stats.completion_rate}%</ThemedText>
          <ThemedText style={styles.statLabel}>Completion</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{summary.stats.active_days}</ThemedText>
          <ThemedText style={styles.statLabel}>Active Days</ThemedText>
        </View>
      </View>

      {/* Highlights */}
      {summary.highlights && summary.highlights.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="star.fill" size={16} color="#F59E0B" />
            <ThemedText style={styles.sectionTitle}>Highlights</ThemedText>
          </View>
          {summary.highlights.map((highlight, index) => (
            <View key={index} style={styles.listItem}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.listText}>{highlight}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Areas for Improvement */}
      {summary.areas_for_improvement && summary.areas_for_improvement.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="arrow.up.circle.fill" size={16} color={tintColor} />
            <ThemedText style={styles.sectionTitle}>Areas to Improve</ThemedText>
          </View>
          {summary.areas_for_improvement.map((area, index) => (
            <View key={index} style={styles.listItem}>
              <ThemedText style={styles.bullet}>•</ThemedText>
              <ThemedText style={styles.listText}>{area}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Coach Notes */}
      {summary.coach_notes && (
        <View style={[styles.coachNotes, { borderColor }]}>
          <View style={styles.coachHeader}>
            <IconSymbol name="person.fill" size={16} color={tintColor} />
            <ThemedText style={styles.coachTitle}>Coach's Note</ThemedText>
          </View>
          <ThemedText style={styles.coachText}>{summary.coach_notes}</ThemedText>
        </View>
      )}

      {/* Next Week Focus */}
      {summary.next_week_focus && (
        <View style={[styles.nextWeek, { backgroundColor: `${tintColor}10` }]}>
          <ThemedText style={styles.nextWeekLabel}>Next Week Focus</ThemedText>
          <ThemedText style={styles.nextWeekText}>{summary.next_week_focus}</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 20,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  dateRange: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    opacity: 0.6,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  coachNotes: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coachTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  coachText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  nextWeek: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextWeekLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  nextWeekText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
});
