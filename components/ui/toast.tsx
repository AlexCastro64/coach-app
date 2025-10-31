/**
 * Toast Component
 * Temporary notification messages
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const TOAST_COLORS = {
  success: '#10B981',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
};

const TOAST_ICONS = {
  success: 'checkmark.circle.fill',
  error: 'xmark.circle.fill',
  info: 'info.circle.fill',
  warning: 'exclamationmark.triangle.fill',
};

export function Toast({ message, type = 'info', duration = 3000, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: TOAST_COLORS[type],
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity style={styles.content} onPress={dismiss} activeOpacity={0.9}>
        <IconSymbol name={TOAST_ICONS[type]} size={20} color="#fff" />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
