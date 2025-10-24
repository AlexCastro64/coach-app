import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onAttachPhoto: () => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, onAttachPhoto, disabled }: MessageInputProps) {
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
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  // Flatten styles to prevent nested arrays
  const containerStyle = StyleSheet.flatten([styles.container, { backgroundColor, borderTopColor: borderColor }]);
  const attachButtonStyle = StyleSheet.flatten([styles.attachButton, disabled && styles.disabledButton]);
  const inputStyle = StyleSheet.flatten([
    styles.input,
    {
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff',
      color: textColor,
      borderColor: borderColor
    }
  ]);
  const sendButtonStyle = StyleSheet.flatten([
    styles.sendButton,
    (!message.trim() || disabled) && styles.disabledButton
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={containerStyle}>
        <Pressable
          onPress={onAttachPhoto}
          disabled={disabled}
          style={attachButtonStyle}
        >
          <IconSymbol
            name="camera.fill"
            size={24}
            color={disabled ? '#999' : tintColor}
          />
        </Pressable>

        <TextInput
          style={inputStyle}
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
          disabled={!message.trim() || disabled}
          style={sendButtonStyle}
        >
          <IconSymbol
            name="paperplane.fill"
            size={22}
            color={!message.trim() || disabled ? '#999' : tintColor}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  attachButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
    marginRight: 8,
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
