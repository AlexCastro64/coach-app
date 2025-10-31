/**
 * Goal Detail Screen
 * View and manage a specific goal with milestones
 */

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useGoal, useGoalMilestones, useGoalProgress, useCompleteGoal, usePauseGoal, useResumeGoal, useCompleteMilestone } from '@/hooks/use-goals';
import { MilestoneItem } from '@/components/goals/MilestoneItem';

export default function GoalDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');
  const [refreshing, setRefreshing] = useState(false);

  const { data: goal, refetch: refetchGoal } = useGoal(id);
  const { data: milestones, refetch: refetchMilestones } = useGoalMilestones(id);
  const { data: progress } = useGoalProgress(id);
  const completeGoalMutation = useCompleteGoal();
  const pauseGoalMutation = usePauseGoal();
  const resumeGoalMutation = useResumeGoal();
  const completeMilestoneMutation = useCompleteMilestone();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchGoal(), refetchMilestones()]);
    setRefreshing(false);
  };

  const handleCompleteGoal = () => {
    Alert.alert('Complete Goal', 'Mark this goal as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: async () => {
        try {
          await completeGoalMutation.mutateAsync(id);
          Alert.alert('Success', 'Goal completed! 🎉');
        } catch (error) {
          Alert.alert('Error', 'Failed to complete goal');
        }
      }},
    ]);
  };

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      await completeMilestoneMutation.mutateAsync(milestoneId);
    } catch (error) {
      Alert.alert('Error', 'Failed to complete milestone');
    }
  };

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={tintColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const pendingMilestones = milestones?.filter(m => m.status !== 'completed') || [];
  const completedMilestones = milestones?.filter(m => m.status === 'completed') || [];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText type="title">Goal Details</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />}>
        <View style={styles.section}>
          <ThemedText style={styles.goalTitle}>{goal.summary}</ThemedText>
          {goal.description && <ThemedText style={styles.goalDescription}>{goal.description}</ThemedText>}
        </View>

        {progress && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Progress</ThemedText>
            <ThemedView style={[styles.progressCard, { borderColor }]}>
              <View style={styles.progressRow}>
                <View style={styles.progressItem}>
                  <ThemedText style={styles.progressValue}>{progress.percentage}%</ThemedText>
                  <ThemedText style={styles.progressLabel}>Complete</ThemedText>
                </View>
                <View style={styles.progressItem}>
                  <ThemedText style={styles.progressValue}>{progress.milestones_completed}/{progress.milestones_total}</ThemedText>
                  <ThemedText style={styles.progressLabel}>Milestones</ThemedText>
                </View>
              </View>
              <View style={[styles.progressBar, { backgroundColor: `${tintColor}20` }]}>
                <View style={[styles.progressFill, { width: `${progress.percentage}%`, backgroundColor: tintColor }]} />
              </View>
            </ThemedView>
          </View>
        )}

        {milestones && milestones.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Milestones</ThemedText>
            {pendingMilestones.length > 0 && (
              <>
                <ThemedText style={styles.subsectionTitle}>In Progress</ThemedText>
                {pendingMilestones.map((milestone) => (
                  <MilestoneItem key={milestone.id} milestone={milestone} onComplete={handleCompleteMilestone} />
                ))}
              </>
            )}
            {completedMilestones.length > 0 && (
              <>
                <ThemedText style={styles.subsectionTitle}>Completed</ThemedText>
                {completedMilestones.map((milestone) => (
                  <MilestoneItem key={milestone.id} milestone={milestone} />
                ))}
              </>
            )}
          </View>
        )}

        <View style={styles.section}>
          {goal.status === 'active' && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: tintColor }]} onPress={handleCompleteGoal}>
              <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Complete Goal</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 32 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  goalTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  goalDescription: { fontSize: 16, opacity: 0.7, lineHeight: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  subsectionTitle: { fontSize: 14, fontWeight: '600', opacity: 0.6, marginTop: 16, marginBottom: 12 },
  progressCard: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-around' },
  progressItem: { alignItems: 'center' },
  progressValue: { fontSize: 24, fontWeight: '700' },
  progressLabel: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginBottom: 12 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
