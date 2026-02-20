import React, {useState, useEffect} from 'react'
import { View, StyleSheet, ScrollView} from 'react-native'
import {Text, Card, Chip, Button, useTheme, Divider} from 'react-native-paper'
import { useRoute,useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import {exercisesCollection, personalRecordsCollection} from '../../database'
import { Exercise } from '../../database/models'
import {PersonalRecord} from '../../database/models'
import { ExercisesStackParamList } from '../../types/navigation'
import {Q} from '@nozbe/watermelondb'


type Props = NativeStackScreenProps<ExercisesStackParamList, 'ExerciseDetail'>

export default function ExerciseDetailScreen() {
    const route = useRoute<Props['route']>()
    const theme = useTheme()
    const {exerciseId} = route.params

    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [records, setRecords] = useState<PersonalRecord[]>([])

    useEffect(() => {
        async function load() {
            const ex = await exercisesCollection.find(exerciseId)
            setExercise(ex)

            // Load PRs for this exercise
            const prs = await personalRecordsCollection
                .query(Q.where('exercise_id', exerciseId))
                .fetch()
            setRecords(prs)
        }
        load()
    }, [exerciseId])

    if(!exercise) {
        return (
            <View style={styles.loading}>
                <Text>Loading...</Text>
            </View>
        );

    }

    return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium">{exercise.name}</Text>
        <View style={styles.chips}>
          <Chip style={styles.chip}>{exercise.category}</Chip>
          <Chip style={styles.chip}>{exercise.equipment}</Chip>
          <Chip style={styles.chip}>{exercise.difficulty}</Chip>
        </View>
      </View>

      <Divider />

      {/* Muscle Groups */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium">Target Muscles</Text>
          <View style={styles.muscleChips}>
            {exercise.muscleGroups.map((muscle) => (
              <Chip key={muscle} style={styles.muscleChip} compact>
                {muscle}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Instructions */}
      {exercise.instructions && (
        <Card style={styles.section}>
          <Card.Content>
            <Text variant="titleMedium">Instructions</Text>
            <Text variant="bodyMedium" style={styles.instructions}>
              {exercise.instructions}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Personal Records */}
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium">Personal Records</Text>
          {records.length === 0 ? (
            <Text variant="bodyMedium" style={styles.noPr}>
              No records yet. Complete a workout with this exercise to track PRs!
            </Text>
          ) : (
            records.map((pr) => (
              <View key={pr.id} style={styles.prRow}>
                <Text variant="bodyMedium">{pr.recordType}</Text>
                <Text variant="titleMedium">{pr.value} kg</Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Spacer */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  chips: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  section: {
    margin: 16,
    marginBottom: 0,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  muscleChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  instructions: {
    marginTop: 8,
    lineHeight: 22,
  },
  noPr: {
    marginTop: 8,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
