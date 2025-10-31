/**
 * Stats Grid Component
 * Grid of key statistics
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <ThemedView style={[styles.statCard, { borderColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </ThemedView>
  );
}

interface StatsGridProps {
  stats: Array<{
    icon: string;
    label: string;
    value: string | number;
    color: string;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <StatItem key={index} {...stat} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});
