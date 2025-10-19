import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { useFonts } from 'expo-font';

import { useEffect } from 'react';
import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, error] = useFonts({
    'PublicSans-Regular': require('../assets/fonts/PublicSans-Regular.ttf'),
    'PublicSans-Medium': require('../assets/fonts/PublicSans-Medium.ttf'),
    'PublicSans-Bold': require('../assets/fonts/PublicSans-Bold.ttf'),
    'PublicSans-Black': require('../assets/fonts/PublicSans-Black.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="cliente/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="permissions/index" options={{ headerShown: false }} />        
          </Stack>
          <StatusBar style="auto" translucent={false}/>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
