import { Message, SendMessageRequest, SendMessageResponse } from '@/types/chat';

// TODO: Replace with your actual backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class CoachAPIService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a message to the coach and get a response
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        message: {
          ...data.message,
          timestamp: new Date(data.message.timestamp),
        },
        sessionId: data.sessionId,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Mock function for testing without backend
   * Remove this when backend is connected
   */
  async sendMessageMock(content: string): Promise<Message> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: Date.now().toString(),
      content: `Thanks for your message: "${content}". I'm your coach and I'm here to help you! (This is a mock response - connect to your backend to get real responses)`,
      role: 'coach',
      timestamp: new Date(),
    };
  }
}

export const coachAPI = new CoachAPIService();
