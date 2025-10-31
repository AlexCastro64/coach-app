/**
 * Streak Card Component
 * Displays current and longest streak
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={styles.header}>
        <IconSymbol name="flame.fill" size={24} color="#F59E0B" />
        <ThemedText style={styles.title}>Streak</ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.streakItem}>
          <ThemedText style={styles.streakValue}>{currentStreak}</ThemedText>
          <ThemedText style={styles.streakLabel}>Current</ThemedText>
          <ThemedText style={styles.streakSubtext}>days</ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.streakItem}>
          <ThemedText style={styles.streakValue}>{longestStreak}</ThemedText>
          <ThemedText style={styles.streakLabel}>Best</ThemedText>
          <ThemedText style={styles.streakSubtext}>days</ThemedText>
        </View>
      </View>

      {currentStreak > 0 && (
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            {currentStreak === longestStreak
              ? '🎉 New personal record!'
              : `${longestStreak - currentStreak} days to beat your record`}
          </ThemedText>
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F59E0B',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  streakSubtext: {
    fontSize: 12,
    opacity: 0.6,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
