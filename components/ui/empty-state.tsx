/**
 * Empty State Component
 * Reusable empty state display
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
  fullScreen = false,
}: EmptyStateProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <IconSymbol name={icon} size={64} color="#999" />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.message}>{message}</ThemedText>
      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: tintColor }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.actionText}>{actionLabel}</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
  },
  fullScreen: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
