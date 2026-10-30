import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, Typography } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontSize: Typography.fontSize.lg,
            fontWeight: Typography.fontWeight.bold,
            color: Colors.textPrimary,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="word/[id]"
          options={{
            title: 'Kelime Detayı',
            headerShown: true,
            headerBackTitle: 'Geri',
            headerTintColor: Colors.primary,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
