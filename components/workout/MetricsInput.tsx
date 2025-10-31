/**
 * Metrics Input Component
 * Input fields for workout metrics
 */

import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { WorkoutActual, WorkoutType } from '@/types';

interface MetricsInputProps {
  workoutType: WorkoutType;
  metrics: Partial<WorkoutActual>;
  onChange: (metrics: Partial<WorkoutActual>) => void;
}

export function MetricsInput({ workoutType, metrics, onChange }: MetricsInputProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const showDistance = ['run', 'ride', 'swim', 'walk'].includes(workoutType);
  const showSets = ['strength', 'hiit'].includes(workoutType);

  return (
    <ThemedView style={styles.container}>
      {/* Duration */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Duration (minutes)</ThemedText>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={metrics.duration_min?.toString() || ''}
          onChangeText={(text) =>
            onChange({ ...metrics, duration_min: text ? parseInt(text) : undefined })
          }
          keyboardType="numeric"
          placeholder="30"
          placeholderTextColor={borderColor}
        />
      </View>

      {/* Distance */}
      {showDistance && (
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Distance (km)</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor }]}
            value={metrics.distance_km?.toString() || ''}
            onChangeText={(text) =>
              onChange({ ...metrics, distance_km: text ? parseFloat(text) : undefined })
            }
            keyboardType="decimal-pad"
            placeholder="5.0"
            placeholderTextColor={borderColor}
          />
        </View>
      )}

      {/* Sets & Reps */}
      {showSets && (
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <ThemedText style={styles.label}>Sets</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={metrics.sets?.toString() || ''}
              onChangeText={(text) =>
                onChange({ ...metrics, sets: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              placeholder="3"
              placeholderTextColor={borderColor}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <ThemedText style={styles.label}>Reps</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={metrics.reps?.toString() || ''}
              onChangeText={(text) =>
                onChange({ ...metrics, reps: text ? parseInt(text) : undefined })
              }
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor={borderColor}
            />
          </View>
        </View>
      )}

      {/* RPE (Rate of Perceived Exertion) */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>RPE (1-10)</ThemedText>
        <ThemedText style={styles.description}>
          Rate of Perceived Exertion: 1 = Very Easy, 10 = Maximum Effort
        </ThemedText>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={metrics.rpe?.toString() || ''}
          onChangeText={(text) => {
            const value = text ? parseInt(text) : undefined;
            if (value === undefined || (value >= 1 && value <= 10)) {
              onChange({ ...metrics, rpe: value });
            }
          }}
          keyboardType="numeric"
          placeholder="5"
          placeholderTextColor={borderColor}
          maxLength={2}
        />
      </View>

      {/* Calories */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Calories (optional)</ThemedText>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={metrics.calories?.toString() || ''}
          onChangeText={(text) =>
            onChange({ ...metrics, calories: text ? parseInt(text) : undefined })
          }
          keyboardType="numeric"
          placeholder="300"
          placeholderTextColor={borderColor}
        />
      </View>

      {/* Notes */}
      <View style={styles.inputGroup}>
        <ThemedText style={styles.label}>Notes (optional)</ThemedText>
        <TextInput
          style={[styles.textArea, { color: textColor, borderColor }]}
          value={metrics.notes || ''}
          onChangeText={(text) => onChange({ ...metrics, notes: text })}
          placeholder="How did it feel?"
          placeholderTextColor={borderColor}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    opacity: 0.6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
});
