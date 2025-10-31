/**
 * Error Message Component
 * Reusable error display with retry
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  fullScreen = false,
}: ErrorMessageProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ThemedView style={[styles.card, { borderColor }]}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#EF4444" />
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.message}>{message}</ThemedText>
        {onRetry && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: tintColor }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <IconSymbol name="arrow.clockwise" size={16} color="#fff" />
            <ThemedText style={styles.retryText}>Try Again</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
