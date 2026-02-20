import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//TODO: Check ICoN import later
import {useWorkoutStore} from '../../stores/workoutStore'
import {WorkoutStackParamList} from '../../types/navigation'

type NavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutHome'>

export default function WorkoutHomeScreen() {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp>()
    const {isActive, startWorkout} = useWorkoutStore()

    const handleStartWorkout = async () => {
        if(isActive) {
            // Resume existing workout
            navigation.navigate('ActiveWorkout', {})
        } else { 
            // Start new workout
            await startWorkout()
            navigation.navigate('ActiveWorkout', {})
        }
    }

    return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Quick Start Section */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon name="lightning-bolt" size={48} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={styles.cardTitle}>
            Quick Start
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Start an empty workout and add exercises as you go
          </Text>
          <Button 
            mode="contained" 
            onPress={handleStartWorkout}
            style={styles.startButton}
            icon={isActive ? "play" : "plus"}
          >
            {isActive ? 'Resume Workout' : 'Start Workout'}
          </Button>
        </Card.Content>
      </Card>

      {/* From Template Section */}
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Icon name="file-document-outline" size={48} color={theme.colors.secondary} />
          <Text variant="headlineSmall" style={styles.cardTitle}>
            From Template
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            Start a workout from one of your saved templates
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => {/* Navigate to template selection */}}
            style={styles.startButton}
            icon="folder-open"
          >
            Choose Template
          </Button>
        </Card.Content>
      </Card>

      {/* Active Workout Indicator */}
      {isActive && (
        <Card style={[styles.activeCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content style={styles.activeContent}>
            <Icon name="dumbbell" size={24} color={theme.colors.primary} />
            <View style={styles.activeText}>
              <Text variant="titleMedium">Workout in Progress</Text>
              <Text variant="bodySmall">Tap to continue your session</Text>
            </View>
            <Button mode="text" onPress={handleStartWorkout}>
              Resume
            </Button>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  cardTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  cardDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  startButton: {
    minWidth: 200,
  },
  activeCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeText: {
    flex: 1,
    marginLeft: 12,
  },
});
