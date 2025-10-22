import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, disabled = false, placeholder = 'Message your coach...' }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
          <TextInput
            style={[styles.input, isDark && styles.inputDark]}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor={isDark ? '#8E8E93' : '#999999'}
            multiline
            maxLength={1000}
            editable={!disabled}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || disabled) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || disabled}
          >
            {disabled ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={message.trim() ? '#FFFFFF' : '#999999'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  containerDark: {
    backgroundColor: '#000000',
    borderTopColor: '#3A3A3C',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
  },
  inputContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    color: '#000000',
    paddingTop: Platform.OS === 'ios' ? 8 : 4,
  },
  inputDark: {
    color: '#FFFFFF',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
});
