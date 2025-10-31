/**
 * Goals List Screen
 * View all goals with filtering
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
import { useGoals, useActiveGoals } from '@/hooks/use-goals';
import { GoalCard } from '@/components/goals/GoalCard';

export default function GoalsScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [refreshing, setRefreshing] = useState(false);

  const { data: allGoals, refetch: refetchAll } = useGoals();
  const { data: activeGoals, refetch: refetchActive } = useActiveGoals();

  const goals = filter === 'active' ? activeGoals : allGoals;

  const onRefresh = async () => {
    setRefreshing(true);
    if (filter === 'active') {
      await refetchActive();
    } else {
      await refetchAll();
    }
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText type="title">Goals</ThemedText>
          <ThemedText style={styles.subtitle}>Track your progress</ThemedText>
        </View>
        <TouchableOpacity onPress={() => router.push('/goals/create')}>
          <IconSymbol name="plus.circle.fill" size={32} color={tintColor} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            { borderColor },
            filter === 'active' && { backgroundColor: tintColor, borderColor: tintColor },
          ]}
          onPress={() => setFilter('active')}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[styles.filterText, filter === 'active' && styles.filterTextActive]}
          >
            Active
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            { borderColor },
            filter === 'all' && { backgroundColor: tintColor, borderColor: tintColor },
          ]}
          onPress={() => setFilter('all')}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
        }
      >
        {!goals || goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol name="target" size={64} color="#999" />
            <ThemedText style={styles.emptyText}>No goals yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Set your first goal to start tracking your progress
            </ThemedText>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor }]}
              onPress={() => router.push('/goals/create')}
            >
              <ThemedText style={styles.addButtonText}>Create Goal</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.goalsContainer}>
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => router.push(`/goals/${goal.id}`)}
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
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  goalsContainer: {
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
