/**
 * Plan Screen
 * Weekly plan view with calendar and task list
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCurrentPlan, useWeekTasks, useCompleteTask } from '@/hooks/use-plan';
import { WeekCalendar } from '@/components/plan/WeekCalendar';
import { WeekNavigator } from '@/components/plan/WeekNavigator';
import { PlanTaskItem } from '@/components/plan/PlanTaskItem';
import { PlanTask } from '@/types';

export default function PlanScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const { data: plan, refetch: refetchPlan } = useCurrentPlan();
  const { data: weekTasks, refetch: refetchTasks, isLoading } = useWeekTasks();
  const completeTaskMutation = useCompleteTask();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPlan(), refetchTasks()]);
    setRefreshing(false);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      Alert.alert('Success', 'Task completed!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete task');
    }
  };

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, PlanTask[]> = {};
    const stats: Record<string, { total: number; completed: number }> = {};

    weekTasks?.forEach(task => {
      const dateKey = task.date.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
        stats[dateKey] = { total: 0, completed: 0 };
      }
      grouped[dateKey].push(task);
      stats[dateKey].total++;
      if (task.status === 'completed') {
        stats[dateKey].completed++;
      }
    });

    return { grouped, stats };
  }, [weekTasks]);

  // Get tasks for selected date
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const selectedDayTasks = tasksByDate.grouped[selectedDateKey] || [];

  const pendingTasks = selectedDayTasks.filter(t => t.status === 'scheduled');
  const completedTasks = selectedDayTasks.filter(t => t.status === 'completed');
  const otherTasks = selectedDayTasks.filter(
    t => t.status !== 'scheduled' && t.status !== 'completed'
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Plan</ThemedText>
          {plan && (
            <ThemedText style={styles.subtitle}>
              Week {plan.week_number} of {plan.total_weeks}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push('/inbox')}>
          <IconSymbol name="message.fill" size={28} color={tintColor} />
        </TouchableOpacity>
      </View>

      {/* Week Navigator */}
      <WeekNavigator
        currentDate={selectedDate}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
      />

      {/* Week Calendar */}
      <WeekCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        tasksByDate={tasksByDate.stats}
      />

      {/* Tasks List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        <View style={styles.section}>
          <ThemedText style={styles.dateTitle}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>

          {isLoading ? (
            <ThemedText style={styles.emptyText}>Loading tasks...</ThemedText>
          ) : selectedDayTasks.length === 0 ? (
            <ThemedView style={[styles.emptyCard, { borderColor }]}>
              <IconSymbol name="calendar" size={48} color="#999" />
              <ThemedText style={styles.emptyText}>No tasks scheduled</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Enjoy your rest day or add a custom workout
              </ThemedText>
            </ThemedView>
          ) : (
            <>
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <>
                  <ThemedText style={styles.sectionLabel}>To Do</ThemedText>
                  {pendingTasks.map(task => (
                    <PlanTaskItem
                      key={task.id}
                      task={task}
                      onPress={() => {
                        // Navigate to task detail
                      }}
                      onComplete={handleCompleteTask}
                    />
                  ))}
                </>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <>
                  <ThemedText style={styles.sectionLabel}>Completed</ThemedText>
                  {completedTasks.map(task => (
                    <PlanTaskItem key={task.id} task={task} />
                  ))}
                </>
              )}

              {/* Other Tasks (missed/skipped) */}
              {otherTasks.length > 0 && (
                <>
                  {otherTasks.map(task => (
                    <PlanTaskItem key={task.id} task={task} />
                  ))}
                </>
              )}
            </>
          )}
        </View>

        {/* Plan Summary */}
        {plan && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>Plan Overview</ThemedText>
            <ThemedView style={[styles.summaryCard, { borderColor }]}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Goal</ThemedText>
                <ThemedText style={styles.summaryValue}>{plan.goal_summary}</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Status</ThemedText>
                <ThemedText style={[styles.summaryValue, { color: tintColor }]}>
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Progress</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  Week {plan.week_number} / {plan.total_weeks}
                </ThemedText>
              </View>
            </ThemedView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 12,
    marginTop: 16,
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
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
