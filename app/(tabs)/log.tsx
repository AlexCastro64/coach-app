/**
 * Log Screen
 * Hub for logging workouts and meals
 */

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LogScreen() {
  const router = useRouter();
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Log Activity</ThemedText>
        <ThemedText style={styles.subtitle}>Track your progress</ThemedText>
      </View>

      <View style={styles.content}>
        {/* Workout Logging */}
        <TouchableOpacity
          style={[styles.card, { borderColor }]}
          onPress={() => router.push('/workout/log')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#3B82F615' }]}>
            <IconSymbol name="figure.run" size={32} color="#3B82F6" />
          </View>
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Log Workout</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Record your exercise session with details
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#999" />
        </TouchableOpacity>

        {/* Meal Logging */}
        <TouchableOpacity
          style={[styles.card, { borderColor }]}
          onPress={() => {
            // Navigate to meal logging (Phase 7)
            router.push('/meal/log');
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#8B5CF615' }]}>
            <IconSymbol name="fork.knife" size={32} color="#8B5CF6" />
          </View>
          <View style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Log Meal</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Take a photo and track your nutrition
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#999" />
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.statsTitle}>Today's Activity</ThemedText>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderColor }]}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Workouts</ThemedText>
            </View>
            <View style={[styles.statCard, { borderColor }]}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Meals</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsSection: {
    marginTop: 32,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
});
