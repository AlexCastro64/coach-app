/**
 * Progress Screen
 * Analytics and progress tracking
 */

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useDashboardStats, useStreakInfo, useCurrentWeekSummary } from '@/hooks/use-analytics';
import { StreakCard } from '@/components/analytics/StreakCard';
import { StatsGrid } from '@/components/analytics/StatsGrid';
import { WeeklySummaryCard } from '@/components/analytics/WeeklySummaryCard';

export default function ProgressScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const [refreshing, setRefreshing] = useState(false);

  const { data: dashboardStats, refetch: refetchDashboard } = useDashboardStats();
  const { data: streakInfo, refetch: refetchStreak } = useStreakInfo();
  const { data: weeklySummary, refetch: refetchWeekly } = useCurrentWeekSummary();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDashboard(), refetchStreak(), refetchWeekly()]);
    setRefreshing(false);
  };

  const overallStats = dashboardStats?.overall;

  const statsData = overallStats
    ? [
        {
          icon: 'figure.run',
          label: 'Total Workouts',
          value: overallStats.total_workouts,
          color: '#3B82F6',
        },
        {
          icon: 'clock.fill',
          label: 'Total Minutes',
          value: overallStats.total_duration_min,
          color: '#8B5CF6',
        },
        {
          icon: 'flame.fill',
          label: 'Total Calories',
          value: overallStats.total_calories.toLocaleString(),
          color: '#EF4444',
        },
        {
          icon: 'fork.knife',
          label: 'Meals Logged',
          value: overallStats.total_meals_logged,
          color: '#10B981',
        },
        {
          icon: 'target',
          label: 'Goals Completed',
          value: overallStats.goals_completed,
          color: '#F59E0B',
        },
        {
          icon: 'calendar',
          label: 'Active Days',
          value: overallStats.total_days_active,
          color: '#06B6D4',
        },
      ]
    : [];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Progress</ThemedText>
          <ThemedText style={styles.subtitle}>Your fitness journey</ThemedText>
        </View>
        <TouchableOpacity onPress={() => router.push('/inbox')}>
          <IconSymbol name="message.fill" size={28} color={tintColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        {/* Streak */}
        {streakInfo && (
          <View style={styles.section}>
            <StreakCard
              currentStreak={streakInfo.current_streak}
              longestStreak={streakInfo.longest_streak}
            />
          </View>
        )}

        {/* Overall Stats */}
        {overallStats && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Overall Stats</ThemedText>
            <StatsGrid stats={statsData} />
          </View>
        )}

        {/* Weekly Summary */}
        {weeklySummary && (
          <View style={styles.section}>
            <WeeklySummaryCard summary={weeklySummary} />
          </View>
        )}

        {/* Member Since */}
        {overallStats && (
          <View style={styles.section}>
            <View style={styles.memberCard}>
              <IconSymbol name="person.fill" size={24} color={tintColor} />
              <View style={styles.memberContent}>
                <ThemedText style={styles.memberLabel}>Member Since</ThemedText>
                <ThemedText style={styles.memberValue}>
                  {new Date(overallStats.member_since).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  memberContent: {
    flex: 1,
  },
  memberLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  memberValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
