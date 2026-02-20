import React, {useState, useEffect} from 'react'
import {View, StyleSheet, ScrollView, Alert} from 'react-native'
import {Text, Button, Card, IconButton, useTheme, Portal, Dialog, TextInput} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useWorkoutStore } from '../../stores/workoutStore'
import { useRestTimerStore } from '../../stores/restTimerStore'
import { WorkoutStackParamList } from '../../types/navigation'
import ExerciseCard from '../../components/workout/ExerciseCard'
import RestTimerOverlay from '../../components/workout/RestTimerOverlay'

type NavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'ActiveWorkout'>

export default function ActiveWorkoutScreen() { 
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp>()
    const {
        workoutName, 
        startTime,
        exercises,
        endWorkout,
        discardWorkout,
        addSet,
        updateSet,
        completeSet,
        removeExercise
    } = useWorkoutStore()

    const {isActive: timerActive} = useRestTimerStore()

    const [elapsed, setElapsed] = useState(0)
    const [showDiscardDialog, setShowDiscardDialog] = useState(false)

    //Update elapsed time
    useEffect(() => {
        if (!startTime) return;
        
        const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
        }, 1000);
        
        return () => clearInterval(interval);
    }, [startTime])

    const formatTime = (seconds:number) => {
        const hrs = Math.floor(seconds/3600)
        const mins = Math.floor((seconds %3600) / 60)
        const secs = seconds % 60

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
            return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const handleFinish = () => {
        Alert.alert(
            'Finish Workout',
            'Are you sure you want to finish this workout?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Finish',
                    onPress: async () => {
                        await endWorkout()
                        navigation.goBack()
                    }
                }
            ]
        )
    }

    const handleDiscard = async () => {
        await discardWorkout()
        setShowDiscardDialog(false)
        navigation.goBack()
    }

    const handleAddExercise = () => {
        navigation.navigate('SelectExercise', {workoutId: ''})
    }

    return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="titleLarge">{workoutName}</Text>
          <Text variant="bodyMedium" style={styles.timer}>
            ⏱ {formatTime(elapsed)}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon="delete"
            onPress={() => setShowDiscardDialog(true)}
          />
          <Button mode="contained" onPress={handleFinish}>
            Finish
          </Button>
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {exercises.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyLarge">No exercises yet</Text>
              <Text variant="bodyMedium" style={styles.emptyHint}>
                Tap the button below to add your first exercise
              </Text>
            </Card.Content>
          </Card>
        ) : (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.tempId}
              exercise={exercise}
              onAddSet={() => addSet(exercise.tempId)}
              onUpdateSet={(setIndex, updates) => 
                updateSet(exercise.tempId, setIndex, updates)
              }
              onCompleteSet={(setIndex) => completeSet(exercise.tempId, setIndex)}
              onRemove={() => removeExercise(exercise.tempId)}
            />
          ))
        )}
        
        {/* Add Exercise Button */}
        <Button 
          mode="outlined" 
          onPress={handleAddExercise}
          style={styles.addButton}
          icon="plus"
        >
          Add Exercise
        </Button>
        
        {/* Bottom padding for scroll */}
        <View style={{ height: timerActive ? 100 : 20 }} />
      </ScrollView>

      {/* Rest Timer Overlay */}
      <RestTimerOverlay />

      {/* Discard Dialog */}
      <Portal>
        <Dialog visible={showDiscardDialog} onDismiss={() => setShowDiscardDialog(false)}>
          <Dialog.Title>Discard Workout?</Dialog.Title>
          <Dialog.Content>
            <Text>This will delete all progress from this workout. This cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDiscardDialog(false)}>Cancel</Button>
            <Button onPress={handleDiscard} textColor={theme.colors.error}>Discard</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timer: {
    marginTop: 4,
    opacity: 0.7,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyCard: {
    marginBottom: 16,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyHint: {
    marginTop: 8,
    opacity: 0.6,
  },
  addButton: {
    marginTop: 8,
  },
});

