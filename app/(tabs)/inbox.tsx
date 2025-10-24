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

  // Mock data for development - Replace with actual API calls later
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);

    // Simulated API call - Replace with actual API endpoint
    // const response = await fetch('/api/messages', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // const data = await response.json();

    // Mock data for demonstration
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: 1,
          user_id: 1,
          sender_type: 'coach',
          content: "Hey! Welcome to your AI fitness coaching journey. I'm here to help you reach your goals with personalized guidance and accountability.",
          attachment_type: null,
          attachment_url: null,
          ai_analysis: null,
          is_read: true,
          read_at: new Date().toISOString(),
          is_ai_generated: true,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          user_id: 1,
          sender_type: 'coach',
          content: "To get started, I'd love to learn more about you. What's your primary fitness goal?",
          attachment_type: null,
          attachment_url: null,
          ai_analysis: null,
          is_read: true,
          read_at: new Date().toISOString(),
          is_ai_generated: true,
          created_at: new Date(Date.now() - 3500000).toISOString(),
        },
        {
          id: 3,
          user_id: 1,
          sender_type: 'user',
          content: "I want to lose weight and build muscle. I've been struggling with consistency.",
          attachment_type: null,
          attachment_url: null,
          ai_analysis: null,
          is_read: true,
          read_at: new Date().toISOString(),
          is_ai_generated: false,
          created_at: new Date(Date.now() - 3400000).toISOString(),
        },
        {
          id: 4,
          user_id: 1,
          sender_type: 'coach',
          content: "That's a great goal! Consistency is key, and that's exactly what I'm here to help you with. With our financial accountability system, you'll have real stakes to keep you on track. Let's build a plan that works for your lifestyle.",
          attachment_type: null,
          attachment_url: null,
          ai_analysis: null,
          is_read: true,
          read_at: new Date().toISOString(),
          is_ai_generated: true,
          created_at: new Date(Date.now() - 3300000).toISOString(),
        },
        {
          id: 5,
          user_id: 1,
          sender_type: 'system',
          content: "Daily check-in reminder: Don't forget to log your weight and progress photos this morning!",
          attachment_type: null,
          attachment_url: null,
          ai_analysis: null,
          is_read: false,
          read_at: null,
          is_ai_generated: false,
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
      ];

      setMessages(mockMessages);
      setLoading(false);

      // Scroll to bottom after messages load
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  const handleSendMessage = async (text: string) => {
    if (sending) return;

    setSending(true);

    // Create optimistic message
    const newMessage: Message = {
      id: Date.now(),
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

    // Add message to list immediately
    setMessages(prev => [...prev, newMessage]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Replace with actual API call
    // try {
    //   const response = await fetch('/api/messages', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     },
    //     body: JSON.stringify({ content: text })
    //   });
    //   const data = await response.json();
    //   // Update message with server response
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to send message');
    //   // Remove optimistic message on error
    //   setMessages(prev => prev.filter(m => m.id !== newMessage.id));
    // }

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        id: Date.now() + 1,
        user_id: 1,
        sender_type: 'coach',
        content: "Thanks for sharing! I'm analyzing your message and will respond with personalized guidance shortly.",
        attachment_type: null,
        attachment_url: null,
        ai_analysis: null,
        is_read: false,
        read_at: null,
        is_ai_generated: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, coachResponse]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);

    setSending(false);
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

    // Create message with photo
    const photoMessage: Message = {
      id: Date.now(),
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

    setMessages(prev => [...prev, photoMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // TODO: Upload photo to server
    // const formData = new FormData();
    // formData.append('photo', { uri, type: 'image/jpeg', name: 'photo.jpg' });
    // const response = await fetch('/api/messages', { method: 'POST', body: formData });

    // Simulate AI analysis for meal photos
    setTimeout(() => {
      const analysisMessage: Message = {
        id: Date.now() + 1,
        user_id: 1,
        sender_type: 'coach',
        content: 'Great! Let me analyze this for you...',
        attachment_type: null,
        attachment_url: null,
        ai_analysis: {
          food_items: ['Grilled chicken breast', 'Brown rice', 'Steamed broccoli'],
          description: 'Healthy balanced meal with lean protein and vegetables',
          estimated_calories: 450,
          estimated_protein_g: 42,
          estimated_carbs_g: 48,
          estimated_fat_g: 8,
          quality_score: 9,
          meal_type: 'lunch',
        },
        is_read: false,
        read_at: null,
        is_ai_generated: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, analysisMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);

    setSending(false);
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
