import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../types/navigation';

import HistoryListScreen from '../screens/history/HistoryListScreen';
import WorkoutDetailScreen from '../screens/history/WorkoutDetailScreen';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistoryList" 
        component={HistoryListScreen}
        options={{ title: 'History' }}
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ title: 'Workout' }}
      />
    </Stack.Navigator>
  );
}