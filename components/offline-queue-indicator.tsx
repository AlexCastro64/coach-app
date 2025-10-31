/**
 * Offline Queue Indicator
 * Shows pending offline actions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useOfflineQueue } from '@/hooks/use-offline-queue';

export function OfflineQueueIndicator() {
  const { queueCount, isOnline, processQueue } = useOfflineQueue();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  if (queueCount === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor }]}
      onPress={processQueue}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isOnline ? '#F59E0B' : '#EF4444' }]}>
        <IconSymbol
          name={isOnline ? 'arrow.clockwise' : 'wifi.slash'}
          size={16}
          color="#fff"
        />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          {queueCount} {queueCount === 1 ? 'action' : 'actions'} pending
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {isOnline ? 'Tap to sync now' : 'Will sync when online'}
        </ThemedText>
      </View>
      {isOnline && (
        <IconSymbol name="chevron.right" size={20} color={tintColor} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
});
