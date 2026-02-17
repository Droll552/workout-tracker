import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useTheme} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/home/HomeScreen';
import WorkoutNavigator from './WorkoutNavigator';
import ExercisesNavigator from './ExercisesNavigator';
import HistoryNavigator from './HistoryNavigator';
import ProfileNavigator from './ProfileNavigator';
import { MainTabParamList } from '../types/navigation';


const Tab = createBottomTabNavigator<MainTabParamList>()

export default function mainTabNavigator() {
    const theme = useTheme()

     return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.surfaceVariant,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="dumbbell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Exercises"
        component={ExercisesNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="arm-flex" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}