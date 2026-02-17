import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../types/navigation';

import WorkoutHomeScreen from '../screens/workout/WorkoutHomeScreen';
import ActiveWorkoutScreen from '../screens/workout/ActiveWorkoutScreen';
import SelectExerciseScreen from '../screens/workout/SelectExerciseScreen';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export default function WorkoutNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WorkoutHome" 
        component={WorkoutHomeScreen}
        options={{ title: 'Workout' }}
      />
      <Stack.Screen 
        name="ActiveWorkout" 
        component={ActiveWorkoutScreen}
        options={{ title: 'Active Workout', headerBackVisible: false }}
      />
      <Stack.Screen 
        name="SelectExercise" 
        component={SelectExerciseScreen}
        options={{ title: 'Add Exercise', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}