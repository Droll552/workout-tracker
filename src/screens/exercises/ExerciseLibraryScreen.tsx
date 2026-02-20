import React, {useState, useCallback} from 'react'
import {View, StyleSheet, FlatList} from 'react-native'
import {Searchbar, Chip, Text, Card, useTheme} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {Q} from '@nozbe/watermelondb'
import {useDatabase} from '@nozbe/watermelondb/hooks'

import {exercisesCollection} from '../../database'
import  Exercise  from '../../database/models/Exercise'
import { ExercisesStackParamList } from '../../types/navigation'

type NavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseLibrary'>

const CATEGORIES = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio'] as const
const EQUIPMENT = ['all', 'barbell', 'dumbell', 'machine', 'bodyweight', 'cable'] as const

export default function ExrciseLibraryScreen() {
    const theme = useTheme
    const navigation = useNavigation<NavigationProp>()
    const database = useDatabase()

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    // Load exercises with filters
    const loadExercises = useCallback(async () => {
        setIsLoading(true);
        try {
            let query = exercisesCollection.query();

            const conditions = []

            if (searchQuery.trim()) {
                conditions.push(Q.where('name', Q.like(`%${searchQuery}`)))
            }

            if (selectedCategory !== 'all') {
                conditions.push(Q.where('category', selectedCategory))
            }

            if(selectedEquipment !== 'all') {
                conditions.push (Q.where('equipment', selectedEquipment))
            }

            if(conditions.length > 0) {
                query = exercisesCollection.query(Q.and(...conditions))
            }

            const results = await query.fetch()
            setExercises(results)

        } catch (error) {
            console.error ('Dailed to load exercises:', error)
        } finally {
            setIsLoading(false)
        }

    }, [searchQuery, selectedCategory, selectedEquipment])

    // Load on mount and when filters change
    React.useEffect(() => {
        loadExercises()
    }, [loadExercises])

      const renderExerciseCard = ({ item }: { item: Exercise }) => (
    <Card 
      style={styles.card}
      onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}
    >
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <View style={styles.cardMeta}>
          <Chip compact style={styles.chip}>{item.category}</Chip>
          <Chip compact style={styles.chip}>{item.equipment}</Chip>
          <Chip compact style={styles.chip}>{item.difficulty}</Chip>
        </View>
        <Text variant="bodySmall" style={styles.muscleGroups}>
          {item.muscleGroups.join(' • ')}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search exercises..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text variant="labelMedium" style={styles.filterLabel}>Category</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={styles.filterChip}
              compact
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Chip>
          )}
        />
      </View>

      {/* Equipment Filter */}
      <View style={styles.filterSection}>
        <Text variant="labelMedium" style={styles.filterLabel}>Equipment</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={EQUIPMENT}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedEquipment === item}
              onPress={() => setSelectedEquipment(item)}
              style={styles.filterChip}
              compact
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Chip>
          )}
        />
      </View>

      {/* Results Count */}
      <Text variant="bodySmall" style={styles.resultsCount}>
        {exercises.length} exercises found
      </Text>

      {/* Exercise List */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    marginBottom: 8,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  filterChip: {
    marginRight: 8,
  },
  resultsCount: {
    paddingHorizontal: 16,
    opacity: 0.6,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  muscleGroups: {
    marginTop: 8,
    opacity: 0.7,
  },
});
