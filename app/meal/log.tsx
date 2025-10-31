/**
 * Meal Log Screen
 * Camera-first meal logging with AI analysis
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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUploadMeal } from '@/hooks/use-meals';
import { MealTypeSelector } from '@/components/meal/MealTypeSelector';
import { MealType } from '@/types';

export default function MealLogScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'text');

  const [mealType, setMealType] = useState<MealType>('lunch');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const uploadMealMutation = useUploadMeal();

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
      setImageUri(result.assets[0].uri);
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
      setImageUri(result.assets[0].uri);
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
    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please add a photo of your meal.');
      return;
    }

    try {
      await uploadMealMutation.mutateAsync({
        imageUri,
        mealType,
        description: description.trim() || undefined,
      });

      Alert.alert(
        'Success',
        'Meal logged! AI is analyzing your photo for nutritional insights.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    }
  };

  const isSaving = uploadMealMutation.isPending;

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={tintColor} />
        </TouchableOpacity>
        <ThemedText type="title">Log Meal</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Photo Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Meal Photo</ThemedText>
          {imageUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: imageUri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setImageUri(null)}
              >
                <IconSymbol name="xmark.circle.fill" size={32} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handlePhotoAction}
              >
                <IconSymbol name="camera.fill" size={20} color="#fff" />
                <ThemedText style={styles.retakeButtonText}>Retake</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.photoPlaceholder, { borderColor }]}
              onPress={handlePhotoAction}
              activeOpacity={0.7}
            >
              <IconSymbol name="camera.fill" size={48} color={tintColor} />
              <ThemedText style={styles.photoPlaceholderTitle}>Take a Photo</ThemedText>
              <ThemedText style={styles.photoPlaceholderText}>
                Snap a picture of your meal for AI analysis
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Meal Type */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Meal Type</ThemedText>
          <MealTypeSelector selectedType={mealType} onSelect={setMealType} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Description (Optional)</ThemedText>
          <TextInput
            style={[styles.textArea, { color: textColor, borderColor }]}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you eat? Any notes?"
            placeholderTextColor={borderColor}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* AI Info */}
        <View style={[styles.infoBox, { borderColor }]}>
          <IconSymbol name="sparkles" size={20} color="#F59E0B" />
          <ThemedText style={styles.infoText}>
            Our AI will analyze your meal photo to estimate calories, macros, and provide
            nutritional insights.
          </ThemedText>
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: tintColor }]}
            onPress={handleSave}
            disabled={isSaving || !imageUri}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveButtonText}>Log Meal</ThemedText>
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -60 }],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retakeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  photoPlaceholder: {
    height: 300,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  photoPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  photoPlaceholderText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FEF3C7',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
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
