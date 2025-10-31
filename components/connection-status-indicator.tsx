/**
 * Connection Status Indicator
 * Shows WebSocket connection status
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WebSocketService } from '@/services/websocket.service';

export function ConnectionStatusIndicator() {
  const [isConnected, setIsConnected] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkConnection = () => {
      const ws = WebSocketService.getInstance();
      const connected = ws.isConnected();
      
      if (connected !== isConnected) {
        setIsConnected(connected);
        
        if (!connected) {
          // Show disconnected indicator
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          // Hide indicator after brief success message
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    };

    const interval = setInterval(checkConnection, 1000);
    checkConnection();

    return () => clearInterval(interval);
  }, [isConnected, fadeAnim]);

  if (fadeAnim._value === 0 && isConnected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: isConnected ? '#10B981' : '#EF4444',
        },
      ]}
    >
      <IconSymbol
        name={isConnected ? 'checkmark.circle.fill' : 'wifi.slash'}
        size={16}
        color="#fff"
      />
      <ThemedText style={styles.text}>
        {isConnected ? 'Connected' : 'Offline - Reconnecting...'}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
