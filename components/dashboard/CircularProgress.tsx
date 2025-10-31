/**
 * Circular Progress Ring Component
 * Similar to CalCam's main calorie ring
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-1
  color?: string;
  backgroundColor?: string;
  centerContent?: React.ReactNode;
  label?: string;
  value?: string | number;
}

export function CircularProgress({
  size = 200,
  strokeWidth = 16,
  progress,
  color = '#000',
  backgroundColor = '#E5E7EB',
  centerContent,
  label,
  value,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
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
      
      {/* Center content */}
      <View style={styles.centerContent}>
        {centerContent || (
          <>
            {value !== undefined && (
              <ThemedText style={styles.value}>{value}</ThemedText>
            )}
            {label && (
              <ThemedText style={styles.label}>{label}</ThemedText>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
});
