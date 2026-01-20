import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useSession } from '@/ctx';

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  /*
  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!session && inTabsGroup) {
      // Redirect to the login page if not signed in
      router.replace('/login');
    } else if (session && !inTabsGroup) {
      // Redirect to the tabs page if signed in
      // Only redirect if we are strictly in login or root, not if we are in other protected routes or modals
      // Ideally we check if we are in login
      const inLogin = segments[0] === 'login';
      if (inLogin || segments.length === 0) {
         router.replace('/(tabs)');
      }
    }
  }, [session, isLoading, segments]);
  */

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
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
