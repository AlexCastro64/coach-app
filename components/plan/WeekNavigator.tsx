/**
 * Week Navigator Component
 * Navigation controls for switching between weeks
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WeekNavigatorProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export function WeekNavigator({
  currentDate,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekNavigatorProps) {
  const tintColor = useThemeColor({}, 'tint');

  const getWeekRange = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}`;
    }
    return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}`;
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return today >= startOfWeek && today <= endOfWeek;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPreviousWeek}
        style={styles.navButton}
        activeOpacity={0.7}
      >
        <IconSymbol name="chevron.left" size={24} color={tintColor} />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <ThemedText style={styles.weekRange}>{getWeekRange()}</ThemedText>
        {!isCurrentWeek() && (
          <TouchableOpacity onPress={onToday} activeOpacity={0.7}>
            <ThemedText style={[styles.todayButton, { color: tintColor }]}>
              Today
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onNextWeek}
        style={styles.navButton}
        activeOpacity={0.7}
      >
        <IconSymbol name="chevron.right" size={24} color={tintColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  weekRange: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayButton: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
});
