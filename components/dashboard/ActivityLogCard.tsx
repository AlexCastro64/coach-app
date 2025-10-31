/**
 * Activity Log Card Component
 * Similar to CalCam's recently logged items
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ActivityLogCardProps {
  title: string;
  type: 'workout' | 'meal' | 'habit';
  time?: string;
  calories?: number;
  details?: {
    label: string;
    value: string | number;
    icon?: string;
  }[];
  onPress?: () => void;
}

export function ActivityLogCard({
  title,
  type,
  time,
  calories,
  details,
  onPress,
}: ActivityLogCardProps) {
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const iconColor = useThemeColor({}, 'tint');

  const getIcon = () => {
    switch (type) {
      case 'workout':
        return 'figure.run';
      case 'meal':
        return 'fork.knife';
      case 'habit':
        return 'checkmark.circle.fill';
      default:
        return 'circle.fill';
    }
  };

  const getIconBackgroundColor = () => {
    switch (type) {
      case 'workout':
        return '#3B82F6';
      case 'meal':
        return '#8B5CF6';
      case 'habit':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <ThemedView style={[styles.container, { borderColor }]}>
        <View style={styles.leftSection}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
            <IconSymbol name={getIcon()} size={28} color="#FFFFFF" />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {time && <ThemedText style={styles.time}>{time}</ThemedText>}
            <ThemedText style={styles.title}>{title}</ThemedText>
            
            {/* Details */}
            {details && details.length > 0 && (
              <View style={styles.detailsRow}>
                {details.map((detail, index) => (
                  <View key={index} style={styles.detailItem}>
                    {detail.icon && (
                      <ThemedText style={styles.detailIcon}>{detail.icon}</ThemedText>
                    )}
                    <ThemedText style={styles.detailText}>
                      {detail.value}
                      {detail.label && <ThemedText style={styles.detailLabel}>{detail.label}</ThemedText>}
                    </ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Calories */}
        {calories !== undefined && (
          <View style={styles.caloriesContainer}>
            <ThemedText style={styles.calories}>{calories}</ThemedText>
            <ThemedText style={styles.caloriesLabel}>kcal</ThemedText>
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  time: {
    fontSize: 12,
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailIcon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.6,
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 18,
    fontWeight: '700',
  },
  caloriesLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
