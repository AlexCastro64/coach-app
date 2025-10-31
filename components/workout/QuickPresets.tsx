/**
 * Quick Presets Component
 * Quick action buttons for common workouts
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { WORKOUT_PRESETS, WorkoutPreset } from '@/types';

interface QuickPresetsProps {
  onSelect: (preset: WorkoutPreset) => void;
}

export function QuickPresets({ onSelect }: QuickPresetsProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Quick Log</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {WORKOUT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={[styles.presetCard, { borderColor }]}
            onPress={() => onSelect(preset)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.presetName}>{preset.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  presetCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '500',
  },
});
