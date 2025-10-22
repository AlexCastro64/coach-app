import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const colorScheme = useColorScheme();
  const isUser = message.role === 'user';

  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.coachContainer]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.coachBubble,
          isDark && (isUser ? styles.userBubbleDark : styles.coachBubbleDark),
        ]}
      >
        <ThemedText style={[styles.text, isUser && styles.userText]}>
          {message.content}
        </ThemedText>
        <ThemedText style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {formatTime(message.timestamp)}
        </ThemedText>
      </View>
    </View>
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  coachContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  userBubbleDark: {
    backgroundColor: '#0A84FF',
  },
  coachBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  coachBubbleDark: {
    backgroundColor: '#3A3A3C',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.6,
  },
  userTimestamp: {
    color: '#FFFFFF',
  },
});
