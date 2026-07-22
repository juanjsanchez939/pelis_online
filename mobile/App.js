import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { UserProvider } from './src/contexts/UserProvider';
import { FiltersProvider } from './src/contexts/FiltersProvider';
import { FavsProvider } from './src/contexts/FavsProvider';
import { SnackbarProvider } from './src/contexts/SnackbarProvider';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDark } = useTheme();
  const [fontsLoaded] = useFonts({});

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer
        theme={{
          dark: isDark,
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
            },
          },
          colors: {
            primary: '#e50914',
            background: isDark ? '#0d0d0d' : '#f5f5f5',
            card: isDark ? '#1a1a2e' : '#ffffff',
            text: isDark ? '#ffffff' : '#1a1a1a',
            border: isDark ? '#2a2a4a' : '#e0e0e0',
            notification: '#e50914',
          },
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <UserProvider>
          <FiltersProvider>
            <FavsProvider>
              <AppContent />
            </FavsProvider>
          </FiltersProvider>
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
