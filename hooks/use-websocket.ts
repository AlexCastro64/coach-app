/**
 * WebSocket Hooks
 * React hooks for real-time updates
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { WebSocketService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to setup and manage WebSocket connection
 */
export function useWebSocket() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const ws = WebSocketService.getInstance();
    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [user]);

  const send = useCallback((type: string, data: any) => {
    const ws = WebSocketService.getInstance();
    ws.send(type, data);
  }, []);

  const isConnected = useCallback(() => {
    const ws = WebSocketService.getInstance();
    return ws.isConnected();
  }, []);

  return { send, isConnected };
}

/**
 * Hook to listen for new messages
 */
export function useRealtimeMessages(onNewMessage?: (message: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.on('message.new', (data) => {
      console.log('New message received:', data);
      
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      
      // Call custom handler if provided
      if (onNewMessage) {
        onNewMessage(data);
      }
    });

    return unsubscribe;
  }, [queryClient, onNewMessage]);
}

/**
 * Hook to listen for plan updates
 */
export function useRealtimePlanUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribePlan = ws.on('plan.updated', (data) => {
      console.log('Plan updated:', data);
      queryClient.invalidateQueries({ queryKey: ['plan'] });
      queryClient.invalidateQueries({ queryKey: ['currentPlan'] });
    });

    const unsubscribeTask = ws.on('task.updated', (data) => {
      console.log('Task updated:', data);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['todayTasks'] });
      queryClient.invalidateQueries({ queryKey: ['weekTasks'] });
    });

    return () => {
      unsubscribePlan();
      unsubscribeTask();
    };
  }, [queryClient]);
}

/**
 * Hook to listen for goal updates
 */
export function useRealtimeGoalUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.on('goal.updated', (data) => {
      console.log('Goal updated:', data);
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['activeGoals'] });
      
      if (data.goalId) {
        queryClient.invalidateQueries({ queryKey: ['goal', data.goalId] });
        queryClient.invalidateQueries({ queryKey: ['goalProgress', data.goalId] });
        queryClient.invalidateQueries({ queryKey: ['goalMilestones', data.goalId] });
      }
    });

    return unsubscribe;
  }, [queryClient]);
}

/**
 * Hook to listen for workout feedback
 */
export function useRealtimeWorkoutFeedback(onFeedback?: (feedback: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.on('workout.feedback', (data) => {
      console.log('Workout feedback received:', data);
      
      // Invalidate workout queries
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      
      if (data.workoutId) {
        queryClient.invalidateQueries({ queryKey: ['workout', data.workoutId] });
      }
      
      // Call custom handler if provided
      if (onFeedback) {
        onFeedback(data);
      }
    });

    return unsubscribe;
  }, [queryClient, onFeedback]);
}

/**
 * Hook to listen for meal feedback
 */
export function useRealtimeMealFeedback(onFeedback?: (feedback: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.on('meal.feedback', (data) => {
      console.log('Meal feedback received:', data);
      
      // Invalidate meal queries
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['todayMeals'] });
      queryClient.invalidateQueries({ queryKey: ['weekMeals'] });
      
      if (data.mealId) {
        queryClient.invalidateQueries({ queryKey: ['meal', data.mealId] });
      }
      
      // Call custom handler if provided
      if (onFeedback) {
        onFeedback(data);
      }
    });

    return unsubscribe;
  }, [queryClient, onFeedback]);
}

/**
 * Hook to listen for new notifications
 */
export function useRealtimeNotifications(onNotification?: (notification: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = WebSocketService.getInstance();

    const unsubscribe = ws.on('notification.new', (data) => {
      console.log('New notification received:', data);
      
      // Invalidate notification queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      
      // Call custom handler if provided
      if (onNotification) {
        onNotification(data);
      }
    });

    return unsubscribe;
  }, [queryClient, onNotification]);
}

/**
 * Hook to setup all real-time listeners
 */
export function useRealtimeUpdates() {
  useRealtimeMessages();
  useRealtimePlanUpdates();
  useRealtimeGoalUpdates();
  useRealtimeWorkoutFeedback();
  useRealtimeMealFeedback();
  useRealtimeNotifications();
}
