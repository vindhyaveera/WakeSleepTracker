import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

// Import icons from @expo/vector-icons
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6200ea',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Transparent background on iOS for blur effect
          },
          default: {},
        }),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ), // Home icon
        }}
      />

      {/* Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="paper-plane" size={28} color={color} />
          ), // Paper plane icon
        }}
      />

      {/* WakeSleepTracker Tab */}
      <Tabs.Screen
        name="WakeSleepTracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => (
            <Ionicons name="alarm-outline" size={28} color={color} />
          ), // Outline clock icon for tracker
        }}
      />
    </Tabs>
  );
}
