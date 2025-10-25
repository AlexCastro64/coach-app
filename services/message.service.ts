import { apiClient } from './api.client';
import { Message } from '../types/message';

export interface MessageResponse {
  data: Message[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export class MessageService {
  /**
   * Get all messages
   */
  static async getMessages(page: number = 1): Promise<MessageResponse> {
    try {
      const response = await apiClient.get<MessageResponse>('/messages', {
        params: { page }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch messages. Please try again.');
    }
  }

  /**
   * Send a text message
   */
  static async sendMessage(content: string): Promise<Message> {
    try {
      const response = await apiClient.post<{ data: Message }>('/messages', {
        content,
        sender_type: 'user'
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to send message. Please try again.');
    }
  }

  /**
   * Send a message with a photo attachment
   */
  static async sendPhotoMessage(photoUri: string, caption?: string): Promise<Message> {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Append the photo
      const filename = photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri: photoUri,
        name: filename,
        type
      } as any);

      if (caption) {
        formData.append('content', caption);
      }

      formData.append('sender_type', 'user');
      formData.append('attachment_type', 'photo');

      const response = await apiClient.post<{ data: Message }>('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload photo. Please try again.');
    }
  }

  /**
   * Mark a message as read
   */
  static async markAsRead(messageId: number): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/read`);
    } catch (error: any) {
      // Silent fail - marking as read is not critical
      console.error('Failed to mark message as read:', error);
    }
  }

  /**
   * Mark all messages as read
   */
  static async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/messages/read-all');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to mark all messages as read.');
    }
  }

  /**
   * Get unread message count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<UnreadCountResponse>('/messages/unread-count');
      return response.data.unread_count;
    } catch (error: any) {
      // Silent fail - unread count is not critical
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  }
}
