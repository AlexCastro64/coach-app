import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MessageInputProps {
  onSendMessage: (text: string, imageUri?: string) => void;
  onAttachPhoto: () => void;
  selectedImageUri?: string | null;
  onRemoveImage?: () => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, onAttachPhoto, selectedImageUri, onRemoveImage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();

  const backgroundColor = useThemeColor(
    { light: '#f5f5f5', dark: '#2a2a2a' },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#e0e0e0', dark: '#3a3a3a' },
    'background'
  );

  const handleSend = () => {
    if ((message.trim() || selectedImageUri) && !disabled) {
      onSendMessage(message.trim(), selectedImageUri || undefined);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor, borderTopColor: borderColor }]}>
        {/* Image Preview */}
        {selectedImageUri && (
          <View style={styles.imagePreviewContainer}>
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: selectedImageUri }}
                style={styles.thumbnailImage}
                contentFit="cover"
              />
              <Pressable
                onPress={onRemoveImage}
                style={styles.removeImageButton}
              >
                <IconSymbol
                  name="xmark.circle.fill"
                  size={24}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>
        )}

        {/* Input Row */}
        <View style={styles.inputRow}>
          <Pressable
            onPress={onAttachPhoto}
            disabled={disabled}
            style={[styles.attachButton, disabled && styles.disabledButton]}
          >
            <IconSymbol
              name="camera.fill"
              size={24}
              color={disabled ? '#999' : tintColor}
            />
          </Pressable>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
                color: textColor,
                borderColor: borderColor
              }
            ]}
            placeholder="Message your coach..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            editable={!disabled}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />

          <Pressable
            onPress={handleSend}
            disabled={(!message.trim() && !selectedImageUri) || disabled}
            style={[
              styles.sendButton,
              ((!message.trim() && !selectedImageUri) || disabled) && styles.disabledButton
            ]}
          >
            <IconSymbol
              name="paperplane.fill"
              size={22}
              color={(!message.trim() && !selectedImageUri) || disabled ? '#999' : tintColor}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  imagePreviewContainer: {
    paddingBottom: 8,
  },
  imagePreview: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
