/**
 * Today/Dashboard Screen
 * Main screen showing daily overview, tasks, and quick actions
 */

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodayTasks, useCompleteTask } from '@/hooks/use-plan';
import { useTodayWorkouts } from '@/hooks/use-workouts';
import { useTodayMeals } from '@/hooks/use-meals';
import { useDashboardStats } from '@/hooks/use-analytics';
import { useActiveGoals } from '@/hooks/use-goals';
import { TodayTaskCard } from '@/components/dashboard/TodayTaskCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { StatCard } from '@/components/dashboard/StatCard';

export default function TodayScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  // Fetch data
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useTodayTasks();
  const { data: workouts, refetch: refetchWorkouts } = useTodayWorkouts();
  const { data: meals, refetch: refetchMeals } = useTodayMeals();
  const { data: stats, refetch: refetchStats } = useDashboardStats();
  const { data: goals } = useActiveGoals();

  const completeTaskMutation = useCompleteTask();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchTasks(),
      refetchWorkouts(),
      refetchMeals(),
      refetchStats(),
    ]);
    setRefreshing(false);
  }, [refetchTasks, refetchWorkouts, refetchMeals, refetchStats]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      Alert.alert('Success', 'Task completed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const pendingTasks = tasks?.filter(t => t.status === 'scheduled') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const completionRate = tasks?.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="title">Today</ThemedText>
            <ThemedText style={styles.date}>{todayDate}</ThemedText>
          </View>
          <TouchableOpacity onPress={() => router.push('/inbox')}>
            <IconSymbol name="message.fill" size={28} color={tintColor} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsRow}>
            <StatCard
              icon="checkmark.circle.fill"
              label="Completed"
              value={`${completedTasks.length}/${tasks?.length || 0}`}
              color="#10B981"
            />
            <StatCard
              icon="flame.fill"
              label="Streak"
              value={stats?.overall.current_streak_days || 0}
              color="#F59E0B"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="figure.run"
              label="Workouts"
              value={workouts?.length || 0}
              color="#3B82F6"
            />
            <StatCard
              icon="fork.knife"
              label="Meals"
              value={meals?.length || 0}
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Active Goal */}
        {goals && goals.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Active Goal</ThemedText>
            <ThemedView style={[styles.goalCard, { borderColor }]}>
              <View style={styles.goalHeader}>
                <IconSymbol name="target" size={24} color={tintColor} />
                <ThemedText style={styles.goalTitle}>{goals[0].summary}</ThemedText>
              </View>
              {goals[0].target_date && (
                <ThemedText style={styles.goalDate}>
                  Target: {new Date(goals[0].target_date).toLocaleDateString()}
                </ThemedText>
              )}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${goals[0].progress_percentage}%`, backgroundColor: tintColor },
                  ]}
                />
              </View>
              <ThemedText style={styles.progressText}>
                {goals[0].progress_percentage}% complete
              </ThemedText>
            </ThemedView>
          </View>
        )}

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Today's Tasks</ThemedText>
            {tasks && tasks.length > 0 && (
              <ThemedText style={styles.completionBadge}>
                {completionRate}%
              </ThemedText>
            )}
          </View>

          {tasksLoading ? (
            <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
          ) : pendingTasks.length === 0 && completedTasks.length === 0 ? (
            <ThemedView style={[styles.emptyCard, { borderColor }]}>
              <IconSymbol name="calendar" size={48} color="#999" />
              <ThemedText style={styles.emptyText}>No tasks scheduled for today</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Check your weekly plan or chat with your coach
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              {pendingTasks.map(task => (
                <TodayTaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onPress={() => {
                    // Navigate to task detail (Phase 5)
                  }}
                />
              ))}
              {completedTasks.map(task => (
                <TodayTaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                />
              ))}
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="Log Workout"
              icon="figure.run"
              color="#3B82F6"
              onPress={() => router.push('/log')}
            />
            <QuickActionCard
              title="Log Meal"
              icon="fork.knife"
              color="#8B5CF6"
              onPress={() => router.push('/log')}
            />
          </View>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              title="View Plan"
              icon="calendar"
              color="#10B981"
              onPress={() => router.push('/plan')}
            />
            <QuickActionCard
              title="Message Coach"
              icon="message.fill"
              color="#F59E0B"
              onPress={() => router.push('/inbox')}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  completionBadge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  goalCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalDate: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
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
    textAlign: 'right',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
