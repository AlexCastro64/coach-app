/**
 * Today/Dashboard Screen
 * CalCam-inspired layout showing daily overview, progress, and activities
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
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { MacroCard } from '@/components/dashboard/MacroCard';
import { DateSelector } from '@/components/dashboard/DateSelector';
import { ActivityLogCard } from '@/components/dashboard/ActivityLogCard';

export default function TodayScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // State
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [refreshing, setRefreshing] = React.useState(false);
  const [filterType, setFilterType] = React.useState<'all' | 'workout' | 'meal'>('all');

  // Fetch data
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useTodayTasks();
  const { data: workouts, refetch: refetchWorkouts } = useTodayWorkouts();
  const { data: meals, refetch: refetchMeals } = useTodayMeals();
  const { data: stats, refetch: refetchStats } = useDashboardStats();
  const { data: goals } = useActiveGoals();

  const completeTaskMutation = useCompleteTask();

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

  // Calculate stats
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const totalTasks = tasks?.length || 0;
  const tasksCompleted = completedTasks.length;
  
  // Mock data for demo - replace with real data from backend
  const caloriesTarget = 2000;
  const caloriesConsumed = 1320;
  const caloriesBurned = 294;
  const caloriesRemaining = caloriesTarget - caloriesConsumed + caloriesBurned;
  
  const macros = {
    carbs: { current: 115, target: 247, color: '#3B82F6' },
    protein: { current: 118, target: 110, color: '#EF4444' },
    fat: { current: 41, target: 85, color: '#F59E0B' },
  };

  // Combine activities for the log
  const activities = React.useMemo(() => {
    const combined: any[] = [];
    
    // Add workouts
    workouts?.forEach(workout => {
      combined.push({
        type: 'workout',
        time: new Date(workout.created_at).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        title: workout.title || `${workout.type} workout`,
        calories: workout.actual.calories,
        details: [
          workout.actual.duration_min && { 
            label: 'min', 
            value: workout.actual.duration_min,
            icon: '⏱️'
          },
          workout.actual.distance_km && { 
            label: 'km', 
            value: workout.actual.distance_km,
            icon: '📍'
          },
        ].filter(Boolean),
      });
    });

    // Add meals
    meals?.forEach(meal => {
      const macros = meal.ai_feedback?.macro_estimate;
      combined.push({
        type: 'meal',
        time: new Date(meal.logged_at).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        title: meal.description || `${meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}`,
        calories: macros?.calories,
        details: macros ? [
          { label: 'g', value: Math.round(macros.protein_g), icon: '🥩' },
          { label: 'g', value: Math.round(macros.carbs_g), icon: '🌾' },
          { label: 'g', value: Math.round(macros.fat_g), icon: '🥑' },
        ] : [],
      });
    });

    // Sort by time (most recent first)
    return combined.sort((a, b) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  }, [workouts, meals]);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (filterType === 'all') return true;
    return activity.type === filterType;
  });

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
            <ThemedText type="title" style={styles.appTitle}>CoachApp</ThemedText>
            <ThemedText style={styles.subtitle}>
              {goals && goals.length > 0 ? goals[0].summary : 'Your fitness journey'}
            </ThemedText>
          </View>
          <View style={styles.streakBadge}>
            <ThemedText style={styles.streakIcon}>🔥</ThemedText>
            <ThemedText style={styles.streakNumber}>
              {stats?.overall.current_streak_days || 0}
            </ThemedText>
          </View>
        </View>

        {/* Date Selector */}
        <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />

        {/* Today's Plan Section */}
        {goals && goals.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Today's Plan</ThemedText>
            <ThemedView style={[styles.planCard, { borderColor }]}>
              <ThemedText style={styles.planText}>{goals[0].summary}</ThemedText>
              {totalTasks > 0 && (
                <ThemedText style={styles.planSubtext}>
                  {tasksCompleted} of {totalTasks} tasks completed
                </ThemedText>
              )}
            </ThemedView>
          </View>
        )}

        {/* Main Progress Ring */}
        <View style={styles.progressSection}>
          <View style={styles.progressRingContainer}>
            {/* Left stat - Consumed */}
            <View style={styles.sideStatLeft}>
              <ThemedText style={styles.sideStatValue}>{caloriesConsumed}</ThemedText>
              <ThemedText style={styles.sideStatLabel}>Eaten</ThemedText>
            </View>

            {/* Center ring */}
            <CircularProgress
              size={220}
              strokeWidth={20}
              progress={Math.min(caloriesConsumed / caloriesTarget, 1)}
              color="#000000"
              backgroundColor="#E5E7EB"
              centerContent={
                <View style={styles.ringCenter}>
                  <ThemedText style={styles.ringValue}>{caloriesRemaining}</ThemedText>
                  <ThemedText style={styles.ringLabel}>kcal Remaining</ThemedText>
                </View>
              }
            />

            {/* Right stat - Burned */}
            <View style={styles.sideStatRight}>
              <ThemedText style={styles.sideStatValue}>{caloriesBurned}</ThemedText>
              <ThemedText style={styles.sideStatLabel}>Burned</ThemedText>
            </View>
          </View>
        </View>

        {/* Macros Section */}
        <View style={styles.macrosSection}>
          <MacroCard
            label="Carbs"
            current={macros.carbs.current}
            target={macros.carbs.target}
            color={macros.carbs.color}
            icon="🌾"
          />
          <MacroCard
            label="Protein"
            current={macros.protein.current}
            target={macros.protein.target}
            color={macros.protein.color}
            icon="🥩"
          />
          <MacroCard
            label="Fat"
            current={macros.fat.current}
            target={macros.fat.target}
            color={macros.fat.color}
            icon="🥑"
          />
        </View>

        {/* Recently Logged Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recently Logged</ThemedText>
          
          {/* Filter buttons */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'all' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setFilterType('all')}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  filterType === 'all' && styles.filterTextActive,
                ]}
              >
                All
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'workout' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setFilterType('workout')}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  filterType === 'workout' && styles.filterTextActive,
                ]}
              >
                Workouts
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'meal' && { backgroundColor: '#FF6B35' },
              ]}
              onPress={() => setFilterType('meal')}
            >
              <ThemedText
                style={[
                  styles.filterText,
                  filterType === 'meal' && styles.filterTextActive,
                ]}
              >
                Meals
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Activity list */}
          {filteredActivities.length === 0 ? (
            <ThemedView style={[styles.emptyCard, { borderColor }]}>
              <IconSymbol name="tray" size={48} color="#999" />
              <ThemedText style={styles.emptyText}>No activities logged yet</ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Tap the + button below to log your first activity
              </ThemedText>
            </ThemedView>
          ) : (
            filteredActivities.map((activity, index) => (
              <ActivityLogCard
                key={index}
                title={activity.title}
                type={activity.type}
                time={activity.time}
                calories={activity.calories}
                details={activity.details}
                onPress={() => {
                  // Navigate to activity detail
                }}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#FF6B35' }]}
        onPress={() => router.push('/(tabs)/log')}
      >
        <IconSymbol name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakIcon: {
    fontSize: 18,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  planCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  planText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  planSubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  progressRingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  sideStatLeft: {
    alignItems: 'center',
  },
  sideStatRight: {
    alignItems: 'center',
  },
  sideStatValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  sideStatLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  ringCenter: {
    alignItems: 'center',
  },
  ringValue: {
    fontSize: 56,
    fontWeight: '700',
  },
  ringLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  macrosSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  filterTextActive: {
    color: '#FFFFFF',
    opacity: 1,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 16,
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
  fab: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
