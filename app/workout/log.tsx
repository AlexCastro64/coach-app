/**
 * Workout Log Screen
 * Main screen for logging workouts
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCreateWorkout, useCreateWorkoutWithEvidence } from '@/hooks/use-workouts';
import { WorkoutTypeSelector } from '@/components/workout/WorkoutTypeSelector';
import { MetricsInput } from '@/components/workout/MetricsInput';
import { QuickPresets } from '@/components/workout/QuickPresets';
import { WorkoutType, WorkoutActual, WorkoutPreset } from '@/types';

export default function WorkoutLogScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [workoutType, setWorkoutType] = useState<WorkoutType>('run');
  const [metrics, setMetrics] = useState<Partial<WorkoutActual>>({});
  const [evidenceUri, setEvidenceUri] = useState<string | null>(null);

  const createWorkoutMutation = useCreateWorkout();
  const createWorkoutWithEvidenceMutation = useCreateWorkoutWithEvidence();

  const handlePresetSelect = (preset: WorkoutPreset) => {
    setWorkoutType(preset.type);
    setMetrics(preset.default_values);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEvidenceUri(result.assets[0].uri);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEvidenceUri(result.assets[0].uri);
    }
  };

  const handlePhotoAction = () => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Library', onPress: handlePickPhoto },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!metrics.duration_min && !metrics.distance_km) {
      Alert.alert('Missing Information', 'Please enter at least duration or distance.');
      return;
    }

    try {
      const workoutData = {
        date: new Date().toISOString(),
        type: workoutType,
        actual: metrics as WorkoutActual,
      };

      if (evidenceUri) {
        await createWorkoutWithEvidenceMutation.mutateAsync({
          data: workoutData,
          evidenceUri,
        });
      } else {
        await createWorkoutMutation.mutateAsync(workoutData);
      }

      Alert.alert('Success', 'Workout logged successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to log workout. Please try again.');
    }
  };

  const isSaving =
    createWorkoutMutation.isPending || createWorkoutWithEvidenceMutation.isPending;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText type="title">Log Workout</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Presets */}
        <QuickPresets onSelect={handlePresetSelect} />

        {/* Workout Type Selector */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Workout Type</ThemedText>
          <WorkoutTypeSelector selectedType={workoutType} onSelect={setWorkoutType} />
        </View>

        {/* Metrics Input */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Details</ThemedText>
          <MetricsInput
            workoutType={workoutType}
            metrics={metrics}
            onChange={setMetrics}
          />
        </View>

        {/* Photo Evidence */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Photo Evidence (Optional)</ThemedText>
          {evidenceUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: evidenceUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setEvidenceUri(null)}
              >
                <IconSymbol name="xmark.circle.fill" size={28} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.photoPlaceholder, { borderColor }]}
              onPress={handlePhotoAction}
              activeOpacity={0.7}
            >
              <IconSymbol name="camera.fill" size={32} color={tintColor} />
              <ThemedText style={styles.photoPlaceholderText}>Add Photo</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: tintColor }]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Save Workout</ThemedText>
            )}
          </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 14,
  },
  photoPlaceholder: {
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
