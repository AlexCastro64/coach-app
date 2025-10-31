/**
 * Date Selector Component
 * Similar to CalCam's week view with date circles
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  // Generate dates for the week (3 days before, today, 3 days after)
  const dates = React.useMemo(() => {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  const formatDate = (date: Date) => {
    return date.getDate();
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((date, index) => {
        const selected = isSelected(date);
        const today = isToday(date);
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelect(date)}
            style={styles.dateItem}
          >
            <ThemedText style={[styles.dayLabel, selected && { opacity: 1 }]}>
              {formatDay(date)}
            </ThemedText>
            <View
              style={[
                styles.dateCircle,
                selected && { backgroundColor: tintColor },
                today && !selected && { borderColor: tintColor, borderWidth: 2 },
              ]}
            >
              <ThemedText
                style={[
                  styles.dateText,
                  selected && { color: '#FFFFFF' },
                ]}
              >
                {formatDate(date)}
              </ThemedText>
            </View>
            {today && (
              <ThemedText style={[styles.todayLabel, { color: tintColor }]}>
                Today
              </ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  dateItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 50,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  dateCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
