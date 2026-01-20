import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#334155' : '#e2e8f0',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Özet',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Stok',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="cube-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Satış',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="cart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="personnel"
        options={{
          title: 'Personel',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="people-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Daha Fazla',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="menu-outline" color={color} />,
        }}
      />
      {/* Hide old explore tab */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
