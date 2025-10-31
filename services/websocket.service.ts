/**
 * WebSocket Service
 * Handles real-time communication with the backend
 */

import { StorageService } from './storage.service';

type WebSocketEventType = 
  | 'message.new'
  | 'message.read'
  | 'plan.updated'
  | 'task.updated'
  | 'goal.updated'
  | 'workout.feedback'
  | 'meal.feedback'
  | 'notification.new';

type WebSocketEventHandler = (data: any) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<WebSocketEventType, Set<WebSocketEventHandler>> = new Map();
  private isConnecting = false;
  private shouldReconnect = true;
  private pingInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.shouldReconnect = true;

    try {
      const token = await StorageService.getItem('auth_token');
      if (!token) {
        console.log('No auth token, skipping WebSocket connection');
        this.isConnecting = false;
        return;
      }

      const wsUrl = this.getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);

      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.stopPing();
        
        if (this.shouldReconnect) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.stopPing();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message through WebSocket
   */
  send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Subscribe to WebSocket events
   */
  on(event: WebSocketEventType, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Unsubscribe from WebSocket events
   */
  off(event: WebSocketEventType, handler: WebSocketEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      const { type, data: payload } = message;

      // Handle ping/pong
      if (type === 'ping') {
        this.send('pong', {});
        return;
      }

      // Emit event to handlers
      const handlers = this.eventHandlers.get(type as WebSocketEventType);
      if (handlers) {
        handlers.forEach(handler => handler(payload));
      }
    } catch (error) {
      console.error('Failed to handle WebSocket message:', error);
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPing(): void {
    this.stopPing();
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', {});
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Get WebSocket URL from environment
   */
  private getWebSocketUrl(): string {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
    // Convert http(s) to ws(s)
    return apiUrl.replace(/^http/, 'ws') + '/ws';
  }
}
