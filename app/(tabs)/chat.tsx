import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  SafeAreaView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { ChatMessage } from '@/components/chat/chat-message';
import { MessageInput } from '@/components/chat/message-input';
import { Message } from '@/types/chat';
import { coachAPI } from '@/services/coach-api';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Add a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      content: "Hello! I'm your coach. How can I help you today?",
      role: 'coach',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is connected
      // For now, using the mock function
      const coachResponse = await coachAPI.sendMessageMock(content);

      // Uncomment this when backend is ready:
      // const response = await coachAPI.sendMessage({
      //   content,
      //   sessionId: sessionId || undefined,
      // });
      // setSessionId(response.sessionId);
      // setMessages((prev) => [...prev, response.message]);

      // Add coach response to the chat (mock)
      setMessages((prev) => [...prev, coachResponse]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'coach',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatMessage message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                No messages yet. Start chatting with your coach!
              </Text>
            </View>
          }
        />

        {error && (
          <View style={[styles.errorContainer, isDark && styles.errorContainerDark]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  messageList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  emptyTextDark: {
    color: '#8E8E93',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFCDD2',
  },
  errorContainerDark: {
    backgroundColor: '#3A0000',
    borderTopColor: '#5A0000',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
});
