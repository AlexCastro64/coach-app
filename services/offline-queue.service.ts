/**
 * Offline Queue Service
 * Manages queued actions when network is unavailable
 */

import { StorageService } from './storage.service';
import NetInfo from '@react-native-community/netinfo';

export interface QueuedAction {
  id: string;
  type: 'workout' | 'meal' | 'task' | 'goal' | 'message';
  action: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export class OfflineQueueService {
  private static instance: OfflineQueueService;
  private static readonly QUEUE_KEY = 'offline_queue';
  private static readonly MAX_RETRIES = 3;
  private isProcessing = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.setupNetworkListener();
  }

  static getInstance(): OfflineQueueService {
    if (!OfflineQueueService.instance) {
      OfflineQueueService.instance = new OfflineQueueService();
    }
    return OfflineQueueService.instance;
  }

  /**
   * Add action to queue
   */
  async enqueue(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    const queuedAction: QueuedAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    const queue = await this.getQueue();
    queue.push(queuedAction);
    await this.saveQueue(queue);
    
    console.log('Action queued:', queuedAction);
    this.notifyListeners();
  }

  /**
   * Get all queued actions
   */
  async getQueue(): Promise<QueuedAction[]> {
    try {
      const queueJson = await StorageService.getItem(OfflineQueueService.QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  }

  /**
   * Get queue count
   */
  async getQueueCount(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  /**
   * Process queue
   */
  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log('Queue already processing');
      return;
    }

    const isConnected = await this.isNetworkAvailable();
    if (!isConnected) {
      console.log('Network unavailable, skipping queue processing');
      return;
    }

    this.isProcessing = true;
    console.log('Processing offline queue...');

    try {
      const queue = await this.getQueue();
      const results = await Promise.allSettled(
        queue.map(action => this.processAction(action))
      );

      // Remove successful actions and update failed ones
      const updatedQueue: QueuedAction[] = [];
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const action = queue[index];
          if (action.retryCount < OfflineQueueService.MAX_RETRIES) {
            action.retryCount++;
            updatedQueue.push(action);
            console.log(`Action ${action.id} failed, retry ${action.retryCount}`);
          } else {
            console.log(`Action ${action.id} exceeded max retries, dropping`);
          }
        } else {
          console.log(`Action ${queue[index].id} processed successfully`);
        }
      });

      await this.saveQueue(updatedQueue);
      this.notifyListeners();
    } catch (error) {
      console.error('Error processing queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Clear queue
   */
  async clearQueue(): Promise<void> {
    await this.saveQueue([]);
    this.notifyListeners();
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check if network is available
   */
  private async isNetworkAvailable(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  /**
   * Setup network listener to auto-process queue when online
   */
  private setupNetworkListener(): void {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Network connected, processing queue');
        this.processQueue();
      }
    });
  }

  /**
   * Process a single action
   */
  private async processAction(action: QueuedAction): Promise<void> {
    // Import services dynamically to avoid circular dependencies
    const { WorkoutService } = await import('./workout.service');
    const { MealService } = await import('./meal.service');
    const { PlanService } = await import('./plan.service');
    const { GoalService } = await import('./goal.service');
    const { MessageService } = await import('./message.service');

    switch (action.type) {
      case 'workout':
        if (action.action === 'create') {
          await WorkoutService.createWorkout(action.data);
        } else if (action.action === 'update') {
          await WorkoutService.updateWorkout(action.data.id, action.data);
        }
        break;

      case 'meal':
        if (action.action === 'upload') {
          // Note: Image upload might fail if image is no longer available
          await MealService.uploadMeal(action.data.imageUri, action.data.mealType, action.data.description);
        }
        break;

      case 'task':
        if (action.action === 'complete') {
          await PlanService.completeTask(action.data.taskId);
        } else if (action.action === 'update') {
          await PlanService.updateTask(action.data.taskId, action.data);
        }
        break;

      case 'goal':
        if (action.action === 'complete') {
          await GoalService.completeGoal(action.data.goalId);
        } else if (action.action === 'update') {
          await GoalService.updateGoal(action.data.goalId, action.data);
        }
        break;

      case 'message':
        if (action.action === 'send') {
          await MessageService.sendMessage(action.data.content);
        }
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Save queue to storage
   */
  private async saveQueue(queue: QueuedAction[]): Promise<void> {
    try {
      await StorageService.setItem(OfflineQueueService.QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save queue:', error);
      throw error;
    }
  }

  /**
   * Notify listeners of queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
