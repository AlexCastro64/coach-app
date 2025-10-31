/**
 * Week Calendar Component
 * Displays a week view with day selection
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface WeekCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasksByDate?: Record<string, { total: number; completed: number }>;
}

export function WeekCalendar({ selectedDate, onDateSelect, tasksByDate = {} }: WeekCalendarProps) {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  const isSelected = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {weekDays.map((day, index) => {
        const dateKey = formatDate(day);
        const dayTasks = tasksByDate[dateKey];
        const hasCompletedAll = dayTasks && dayTasks.completed === dayTasks.total && dayTasks.total > 0;
        const selected = isSelected(day);
        const isCurrentDay = isToday(day);

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCard,
              { borderColor },
              selected && { backgroundColor: tintColor, borderColor: tintColor },
            ]}
            onPress={() => onDateSelect(day)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.dayName,
                selected && styles.selectedText,
                isCurrentDay && !selected && { color: tintColor },
              ]}
            >
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </ThemedText>
            <ThemedText
              style={[
                styles.dayNumber,
                selected && styles.selectedText,
                isCurrentDay && !selected && { color: tintColor, fontWeight: '700' },
              ]}
            >
              {day.getDate()}
            </ThemedText>
            {dayTasks && dayTasks.total > 0 && (
              <View style={styles.indicator}>
                <View
                  style={[
                    styles.dot,
                    hasCompletedAll
                      ? { backgroundColor: selected ? '#fff' : '#10B981' }
                      : { backgroundColor: selected ? '#fff' : tintColor },
                  ]}
                />
              </View>
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
    gap: 8,
  },
  dayCard: {
    width: 60,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayName: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectedText: {
    color: '#fff',
  },
  indicator: {
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
