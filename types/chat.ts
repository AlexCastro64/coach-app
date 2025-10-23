export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'coach';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  content: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  message: Message;
  sessionId: string;
}
