/**
 * Stat Card Component
 * Displays a single statistic with icon
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const iconColor = color || tintColor;

  return (
    <ThemedView style={[styles.card, { borderColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <IconSymbol name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        <ThemedText style={styles.label}>{label}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
  },
});
