/**
 * Workout Type Selector Component
 * Grid of workout type options
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { WorkoutType } from '@/types';

interface WorkoutTypeSelectorProps {
  selectedType?: WorkoutType;
  onSelect: (type: WorkoutType) => void;
}

const WORKOUT_TYPES: Array<{ type: WorkoutType; label: string; icon: string; color: string }> = [
  { type: 'run', label: 'Run', icon: 'figure.run', color: '#3B82F6' },
  { type: 'ride', label: 'Ride', icon: 'bicycle', color: '#8B5CF6' },
  { type: 'swim', label: 'Swim', icon: 'figure.pool.swim', color: '#06B6D4' },
  { type: 'strength', label: 'Strength', icon: 'dumbbell.fill', color: '#EF4444' },
  { type: 'yoga', label: 'Yoga', icon: 'figure.mind.and.body', color: '#10B981' },
  { type: 'pilates', label: 'Pilates', icon: 'figure.flexibility', color: '#F59E0B' },
  { type: 'hiit', label: 'HIIT', icon: 'flame.fill', color: '#DC2626' },
  { type: 'walk', label: 'Walk', icon: 'figure.walk', color: '#14B8A6' },
  { type: 'other', label: 'Other', icon: 'figure.mixed.cardio', color: '#6B7280' },
];

export function WorkoutTypeSelector({ selectedType, onSelect }: WorkoutTypeSelectorProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {WORKOUT_TYPES.map(({ type, label, icon, color }) => {
        const isSelected = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeCard,
              { borderColor },
              isSelected && { backgroundColor: color, borderColor: color },
            ]}
            onPress={() => onSelect(type)}
            activeOpacity={0.7}
          >
            <IconSymbol name={icon} size={28} color={isSelected ? '#fff' : color} />
            <ThemedText style={[styles.label, isSelected && styles.selectedLabel]}>
              {label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  typeCard: {
    width: 90,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#fff',
  },
});
