import React from 'react';
import { Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DebtsScreen from '../screens/DebtsScreen';
import ClaimsScreen from '../screens/ClaimsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: Platform.OS === 'android' ? 55 : 70,
          paddingBottom: Platform.OS === 'android' ? 15 : 20,  // فاصله از پایین
          paddingTop: 5,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          marginBottom: Platform.OS === 'android' ? 10 : 15,  // فاصله خارجی از پایین
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text> }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💸</Text> }}
      />
      <Tab.Screen 
        name="Debts" 
        component={DebtsScreen} 
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📉</Text> }}
      />
      <Tab.Screen 
        name="Claims" 
        component={ClaimsScreen} 
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📈</Text> }}
      />
    </Tab.Navigator>
  );
}
