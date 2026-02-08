import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Workout Tracker</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Phase 1: Local MVP
      </Text>

      <Button
        mode="contained"
        buttonColor="#15edf4ff"
        textColor="#5c1ae2ff"
        style={styles.startButton}
        onPress={() => console.log('Starting workout!')}>
            Start Workout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    marginVertical: 16,
    color: '#1c09aeff',
  },
  startButton: {
    marginVertical: 4,
    padding: 2
  },
});