import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MessageBubble } from '@/components/inbox/MessageBubble';
import { MessageInput } from '@/components/inbox/MessageInput';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Message } from '@/types/message';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { MessageService } from '@/services/message.service';

export default function InboxScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  // Flatten styles to prevent nested arrays
  const headerStyle = StyleSheet.flatten([styles.header, { backgroundColor }]);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);

    try {
      const response = await MessageService.getMessages();
      setMessages(response.data);

      // Scroll to bottom after messages load
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to load messages:', error);
      Alert.alert(
        'Error',
        'Failed to load messages. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (sending) return;

    setSending(true);

    // Create optimistic message with temporary ID
    const tempId = Date.now();
    const optimisticMessage: Message = {
      id: tempId,
      user_id: 1,
      sender_type: 'user',
      content: text,
      attachment_type: null,
      attachment_url: null,
      ai_analysis: null,
      is_read: false,
      read_at: null,
      is_ai_generated: false,
      created_at: new Date().toISOString(),
    };

    // Add message to list immediately for optimistic UI
    setMessages(prev => [...prev, optimisticMessage]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Send message to server
      const sentMessage = await MessageService.sendMessage(text);

      // Replace optimistic message with server response
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? sentMessage : msg))
      );

      // Scroll to bottom again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');

      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleAttachPhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to attach images.'
      );
      return;
    }

    // Show options: Camera or Gallery
    Alert.alert(
      'Attach Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (!cameraPermission.granted) {
              Alert.alert('Permission Required', 'Please allow camera access.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              handlePhotoSelected(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              handlePhotoSelected(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handlePhotoSelected = async (uri: string) => {
    setSending(true);

    // Create optimistic message with photo
    const tempId = Date.now();
    const optimisticMessage: Message = {
      id: tempId,
      user_id: 1,
      sender_type: 'user',
      content: '',
      attachment_type: 'photo',
      attachment_url: uri,
      ai_analysis: null,
      is_read: false,
      read_at: null,
      is_ai_generated: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Upload photo to server
      const sentMessage = await MessageService.sendPhotoMessage(uri);

      // Replace optimistic message with server response (which may include AI analysis)
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? sentMessage : msg))
      );

      // Scroll to bottom again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');

      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleImagePress = (url: string) => {
    setSelectedImage(url);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} onImagePress={handleImagePress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="message.fill" size={64} color="#999" />
      <ThemedText style={styles.emptyText}>No messages yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Start a conversation with your coach
      </ThemedText>
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading messages...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={headerStyle}>
        <ThemedText type="title" style={styles.headerTitle}>
          Coach
        </ThemedText>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <ThemedText style={styles.statusText}>Online</ThemedText>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Loading indicator when sending */}
      {sending && (
        <View style={styles.sendingIndicator}>
          <ActivityIndicator size="small" color={tintColor} style={{ marginRight: 8 }} />
          <ThemedText style={styles.sendingText}>Sending...</ThemedText>
        </View>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onAttachPhoto={handleAttachPhoto}
        disabled={sending}
      />

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => setSelectedImage(null)}
        >
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                contentFit="contain"
              />
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <IconSymbol name="xmark.circle.fill" size={36} color="#fff" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
  },
  messagesList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  sendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  sendingText: {
    fontSize: 14,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});
