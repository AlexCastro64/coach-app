/**
 * Meal Type Selector Component
 * Selection for meal type (breakfast, lunch, dinner, snack)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MealType } from '@/types';

interface MealTypeSelectorProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
}

const MEAL_TYPES: Array<{ type: MealType; label: string; icon: string; color: string }> = [
  { type: 'breakfast', label: 'Breakfast', icon: 'sunrise.fill', color: '#F59E0B' },
  { type: 'lunch', label: 'Lunch', icon: 'sun.max.fill', color: '#EF4444' },
  { type: 'dinner', label: 'Dinner', icon: 'moon.stars.fill', color: '#8B5CF6' },
  { type: 'snack', label: 'Snack', icon: 'leaf.fill', color: '#10B981' },
  { type: 'other', label: 'Other', icon: 'fork.knife', color: '#6B7280' },
];

export function MealTypeSelector({ selectedType, onSelect }: MealTypeSelectorProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <View style={styles.container}>
      {MEAL_TYPES.map(({ type, label, icon, color }) => {
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
            <IconSymbol name={icon} size={24} color={isSelected ? '#fff' : color} />
            <ThemedText style={[styles.label, isSelected && styles.selectedLabel]}>
              {label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#fff',
  },
});
