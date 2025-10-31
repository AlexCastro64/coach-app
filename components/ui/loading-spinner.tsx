/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', message, fullScreen = false }: LoadingSpinnerProps) {
  const tintColor = useThemeColor({}, 'tint');

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={tintColor} />
      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
});
