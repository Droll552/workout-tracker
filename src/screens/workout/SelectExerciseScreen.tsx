import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, List, Chip, useTheme, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Q } from '@nozbe/watermelondb';

import { exercisesCollection } from '../../database';
import {Exercise} from '../../database/models';
import { useWorkoutStore } from '../../stores/workoutStore';
import { useSettingsStore } from '../../stores/settingsStore';


export default function SelectExerciseScreen() {
    const theme = useTheme()
    const navigation = useNavigation()
    const {addExercise} = useWorkoutStore()
    const {defaultRestSeconds} = useSettingsStore()

    const [searchQuery, setSearchQuery] = useState('')
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [recentIds, setRecentIds] = useState<string[]>([])

    useEffect(() => {
        loadExercises()
    }, [searchQuery])

    const loadExercises = async () => {
        let query = exercisesCollection.query(
            Q.sortBy('name', Q.asc)
        )

        if(searchQuery.trim()) {
            query = exercisesCollection.query(
                Q.where('name', Q.like(`%${searchQuery}%`)),
                Q.sortBy('name', Q.asc)
            )
        }

        const results = await query.fetch()
        setExercises(results)
    }

    const handleSelect = (exercise: Exercise) => {
        addExercise(exercise.id, exercise.name, defaultRestSeconds)
        navigation.goBack()
    }

    const renderExercise =({item}: {item: Exercise}) => (
        <List.Item
            title={item.name}
            description={`${item.category} • ${item.equipment}`}
            onPress={() => handleSelect(item)}
            left={(props) => <List.Icon {...props} icon="dumbbell" />}
            right={(props) => (
                <View style={styles.musclePreview}>
                    <Chip compact>{item.muscleGroups[0]}</Chip>
                </View>
            )}
    />
  );

return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search exercises..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        autoFocus
      />
      
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExercise}
        ItemSeparatorComponent={Divider}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  musclePreview: {
    justifyContent: 'center',
  },
});
