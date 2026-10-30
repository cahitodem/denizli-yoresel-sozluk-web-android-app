import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.cardBorder,
          borderTopWidth: 1,
          height: Platform.select({
            ios: 60 + insets.bottom,
            android: 64 + insets.bottom,
            default: 60,
          }),
          paddingBottom: Platform.select({
            ios: insets.bottom > 0 ? insets.bottom : Spacing.xs,
            android: insets.bottom > 0 ? insets.bottom + 4 : Spacing.sm,
            default: Spacing.xs,
          }),
          paddingTop: Spacing.xs + 2,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.semibold,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarLabel: 'Ana Sayfa',
          tabBarAccessibilityLabel: 'Ana Sayfa Sekmesi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Sözlük',
          tabBarLabel: 'Sözlük',
          tabBarAccessibilityLabel: 'Sözlük Sekmesi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoriler',
          tabBarLabel: 'Favoriler',
          tabBarAccessibilityLabel: 'Favoriler Sekmesi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Hakkında',
          tabBarLabel: 'Hakkında',
          tabBarAccessibilityLabel: 'Hakkında Sekmesi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
