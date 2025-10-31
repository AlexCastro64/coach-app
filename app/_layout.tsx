import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { StorageService } from '@/services/storage.service';
import { usePushNotifications } from '@/hooks/use-notifications';
import { useWebSocket, useRealtimeUpdates } from '@/hooks/use-websocket';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000, // 1 minute
      gcTime: 5 * 60_000, // 5 minutes (formerly cacheTime)
    },
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [localOnboardingComplete, setLocalOnboardingComplete] = useState<boolean | null>(null);
  
  // Setup push notifications
  usePushNotifications();
  
  // Setup WebSocket connection and real-time updates
  useWebSocket();
  useRealtimeUpdates();

  // Check local storage for onboarding completion
  // Re-check whenever navigation changes (e.g., after payment completion)
  useEffect(() => {
    const checkLocalOnboarding = async () => {
      const completed = await StorageService.getItem('onboarding_completed');
      setLocalOnboardingComplete(completed === 'true');
    };
    checkLocalOnboarding();
  }, [segments]);

  useEffect(() => {
    if (isLoading || localOnboardingComplete === null) return;

    // Skip authentication checks if auth is disabled
    const authDisabled = process.env.EXPO_PUBLIC_DISABLE_AUTH === 'true';
    if (authDisabled) {
      const inAuthGroup = segments[0] === '(tabs)';
      if (!inAuthGroup) {
        // Redirect to tabs when auth is disabled
        router.replace('/(tabs)');
      }
      return;
    }

    const inAuthGroup = segments[0] === '(tabs)';

    if (!isAuthenticated) {
      // User is not signed in and trying to access a protected route
      if (inAuthGroup) {
        router.replace('/login');
      }
      return;
    } else {
      // User is signed in
      const inOnboarding = segments[0] === 'onboarding';
      
      // Check both backend and local storage for onboarding completion
      const isOnboardingComplete = user?.onboarding_completed || localOnboardingComplete;

      if (!inAuthGroup && !inOnboarding) {
        // Check if onboarding is completed
        if (isOnboardingComplete) {
          router.replace('/(tabs)/today');
        } else {
          // Redirect to onboarding flow
          router.replace('/onboarding/welcome');
        }
      } else if (inAuthGroup && !isOnboardingComplete) {
        // User trying to access tabs without completing onboarding
        router.replace('/onboarding/welcome');
      }
    }
  }, [isAuthenticated, isLoading, segments, user, localOnboardingComplete]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/testimonials" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/questions" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/payment" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
