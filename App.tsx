import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from './src/database/seed/seedDatabase';

// Temporary home screen
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Workout Tracker</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Database initialized! ✓
      </Text>
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await initializeDatabase();
        setIsReady(true);
      } catch (e) {
        console.error('Init failed:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }
    init();
  }, []);

  if (error) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <View style={styles.container}>
            <Text variant="headlineSmall" style={styles.error}>
              Initialization Error
            </Text>
            <Text>{error}</Text>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <PaperProvider>
          <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.loading}>Initializing database...</Text>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
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
    marginTop: 16,
    color: '#4CAF50',
  },
  loading: {
    marginTop: 16,
    color: '#666',
  },
  error: {
    color: '#f44336',
    marginBottom: 8,
  },
});