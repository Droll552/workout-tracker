import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExercisesStackParamList } from '../types/navigation';

import ExerciseLibraryScreen from '../screens/exercises/ExerciseLibraryScreen';
import ExerciseDetailScreen from '../screens/exercises/ExerciseDetailScreen';

const Stack = createNativeStackNavigator<ExercisesStackParamList>();

export default function ExercisesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ExerciseLibrary" 
        component={ExerciseLibraryScreen}
        options={{ title: 'Exercises' }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen}
        options={{ title: 'Exercise' }}
      />
    </Stack.Navigator>
  );
}