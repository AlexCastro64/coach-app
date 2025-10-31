/**
 * Notification Settings Screen
 * Manage notification preferences
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { NotificationService } from '@/services/notification.service';
import { NotificationPreferences } from '@/types';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_enabled: true,
    email_enabled: true,
    task_reminders: true,
    workout_reminders: true,
    meal_reminders: true,
    goal_updates: true,
    coach_messages: true,
    weekly_summary: true,
    achievements: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await NotificationService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    try {
      await NotificationService.updatePreferences(newPreferences);
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences');
      setPreferences(preferences);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={tintColor} />
          </TouchableOpacity>
          <ThemedText type="title">Notifications</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText type="title">Notifications</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* General */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>General</ThemedText>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="bell.fill" size={20} color={tintColor} />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Push Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive notifications on your device
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.push_enabled}
              onValueChange={(value) => updatePreference('push_enabled', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="envelope.fill" size={20} color={tintColor} />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Email Notifications</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Receive updates via email
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.email_enabled}
              onValueChange={(value) => updatePreference('email_enabled', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Reminders</ThemedText>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Task Reminders</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Daily task notifications
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.task_reminders}
              onValueChange={(value) => updatePreference('task_reminders', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="figure.run" size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Workout Reminders</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Scheduled workout alerts
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.workout_reminders}
              onValueChange={(value) => updatePreference('workout_reminders', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="fork.knife" size={20} color="#10B981" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Meal Reminders</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Meal logging reminders
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.meal_reminders}
              onValueChange={(value) => updatePreference('meal_reminders', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>
        </View>

        {/* Updates */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Updates</ThemedText>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="target" size={20} color="#F59E0B" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Goal Updates</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Progress and milestone notifications
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.goal_updates}
              onValueChange={(value) => updatePreference('goal_updates', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="message.fill" size={20} color="#8B5CF6" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Coach Messages</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  New messages from your coach
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.coach_messages}
              onValueChange={(value) => updatePreference('coach_messages', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="chart.bar.fill" size={20} color="#06B6D4" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Weekly Summary</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Weekly progress reports
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.weekly_summary}
              onValueChange={(value) => updatePreference('weekly_summary', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>

          <ThemedView style={[styles.settingItem, { borderColor }]}>
            <View style={styles.settingContent}>
              <IconSymbol name="star.fill" size={20} color="#F59E0B" />
              <View style={styles.settingText}>
                <ThemedText style={styles.settingLabel}>Achievements</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Celebrate your milestones
                </ThemedText>
              </View>
            </View>
            <Switch
              value={preferences.achievements}
              onValueChange={(value) => updatePreference('achievements', value)}
              trackColor={{ false: '#E5E7EB', true: tintColor }}
              thumbColor="#fff"
            />
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
});
