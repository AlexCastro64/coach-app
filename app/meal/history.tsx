/**
 * Meal History Screen
 * View all logged meals
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTodayMeals, useWeekMeals } from '@/hooks/use-meals';
import { MealCard } from '@/components/meal/MealCard';

export default function MealHistoryScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [view, setView] = useState<'today' | 'week'>('today');
  const [refreshing, setRefreshing] = useState(false);

  const { data: todayMeals, refetch: refetchToday } = useTodayMeals();
  const { data: weekMeals, refetch: refetchWeek } = useWeekMeals();

  const meals = view === 'today' ? todayMeals : weekMeals;

  const onRefresh = async () => {
    setRefreshing(true);
    if (view === 'today') {
      await refetchToday();
    } else {
      await refetchWeek();
    }
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText type="title">Meal History</ThemedText>
        <TouchableOpacity onPress={() => router.push('/meal/log')}>
          <IconSymbol name="plus.circle.fill" size={28} color={tintColor} />
        </TouchableOpacity>
      </View>

      {/* View Selector */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            { borderColor },
            view === 'today' && { backgroundColor: tintColor, borderColor: tintColor },
          ]}
          onPress={() => setView('today')}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.viewButtonText, view === 'today' && styles.viewButtonTextActive]}>
            Today
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewButton,
            { borderColor },
            view === 'week' && { backgroundColor: tintColor, borderColor: tintColor },
          ]}
          onPress={() => setView('week')}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.viewButtonText, view === 'week' && styles.viewButtonTextActive]}>
            This Week
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Meals List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        {!meals || meals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="fork.knife" size={64} color="#999" />
            <ThemedText style={styles.emptyText}>No meals logged yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Start tracking your nutrition by logging your first meal
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/meal/log')}
            >
              <ThemedText style={styles.addButtonText}>Log Meal</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mealsContainer}>
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onPress={() => {
                  // Navigate to meal detail (future enhancement)
                }}
              />
            ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mealsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
