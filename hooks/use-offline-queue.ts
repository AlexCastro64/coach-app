/**
 * Offline Queue Hooks
 * React hooks for offline queue management
 */

import { useState, useEffect } from 'react';
import { OfflineQueueService, QueuedAction } from '@/services/offline-queue.service';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook to manage offline queue
 */
export function useOfflineQueue() {
  const [queueCount, setQueueCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const queueService = OfflineQueueService.getInstance();

    // Load initial queue count
    const loadQueueCount = async () => {
      const count = await queueService.getQueueCount();
      setQueueCount(count);
    };
    loadQueueCount();

    // Subscribe to queue changes
    const unsubscribe = queueService.subscribe(() => {
      loadQueueCount();
    });

    // Subscribe to network changes
    const unsubscribeNetwork = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
      unsubscribeNetwork();
    };
  }, []);

  const enqueue = async (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const queueService = OfflineQueueService.getInstance();
    await queueService.enqueue(action);
  };

  const processQueue = async () => {
    const queueService = OfflineQueueService.getInstance();
    await queueService.processQueue();
  };

  const clearQueue = async () => {
    const queueService = OfflineQueueService.getInstance();
    await queueService.clearQueue();
  };

  return {
    queueCount,
    isOnline,
    enqueue,
    processQueue,
    clearQueue,
  };
}

/**
 * Hook to check network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    // Check initial state
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isInternetReachable,
  };
}

/**
 * Hook to wrap mutations with offline support
 */
export function useOfflineMutation<T extends (...args: any[]) => Promise<any>>(
  mutationFn: T,
  options: {
    type: QueuedAction['type'];
    action: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }
) {
  const { isOnline, enqueue } = useOfflineQueue();

  const mutate = async (...args: Parameters<T>) => {
    try {
      if (isOnline) {
        // Try to execute immediately if online
        const result = await mutationFn(...args);
        options.onSuccess?.();
        return result;
      } else {
        // Queue for later if offline
        await enqueue({
          type: options.type,
          action: options.action,
          data: args[0], // Assuming first arg is the data
        });
        options.onSuccess?.();
        return null;
      }
    } catch (error) {
      if (!isOnline) {
        // If offline, queue the action
        await enqueue({
          type: options.type,
          action: options.action,
          data: args[0],
        });
        options.onSuccess?.();
      } else {
        options.onError?.(error);
        throw error;
      }
    }
  };

  return { mutate, isOnline };
}
