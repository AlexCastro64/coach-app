import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

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
    } else {
      // User is signed in
      const inOnboarding = segments[0] === 'onboarding';

      if (!inAuthGroup && !inOnboarding) {
        // Check if onboarding is completed
        if (user?.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          // Redirect to onboarding flow
          router.replace('/onboarding/welcome');
        }
      } else if (inAuthGroup && !user?.onboarding_completed) {
        // User trying to access tabs without completing onboarding
        router.replace('/onboarding/welcome');
      }
    }
  }, [isAuthenticated, isLoading, segments, user]);

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
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
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
