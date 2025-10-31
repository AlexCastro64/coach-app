/**
 * Macro Progress Card Component
 * Similar to CalCam's carbs/protein/fat cards
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Svg, { Circle } from 'react-native-svg';

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  color: string;
  icon?: string;
}

export function MacroCard({ label, current, target, color, icon }: MacroCardProps) {
  const progress = Math.min(current / target, 1);
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText style={styles.values}>
        <ThemedText style={styles.current}>{current}</ThemedText>
        <ThemedText style={styles.target}>/{target}g</ThemedText>
      </ThemedText>
      
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {/* Icon in center */}
        {icon && (
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>{icon}</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  values: {
    fontSize: 16,
  },
  current: {
    fontSize: 18,
    fontWeight: '700',
  },
  target: {
    fontSize: 14,
    opacity: 0.6,
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
});
