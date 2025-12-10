import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../components/ui/ThemedText';
import { ThemedView } from '../components/ui/ThemedView';
import { useUITheme } from '@mycsuite/ui';
import { useWorkoutManager } from '../hooks/useWorkoutManager';
import { useActiveWorkout } from '../providers/ActiveWorkoutProvider';

export default function SavedWorkoutsScreen() {
  const router = useRouter();
  const theme = useUITheme();
  
  const { savedWorkouts, deleteSavedWorkout } = useWorkoutManager();
  const { hasActiveSession, setExercises } = useActiveWorkout();

  const styles = makeStyles(theme);

  const handleLoad = (id: string, name: string, workoutExercises: any[]) => {
      if (hasActiveSession) {
          Alert.alert("Active Session", "Please finish or cancel your current workout before loading a new one.");
          return;
      }
      setExercises(workoutExercises || []);
      Alert.alert('Loaded', `Workout '${name}' loaded.`);
      router.back();
  };

  const handleDelete = (id: string, name: string) => {
      Alert.alert(
          "Delete Workout",
          `Are you sure you want to delete '${name}'?`,
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive", 
                  onPress: () => deleteSavedWorkout(id) 
              }
          ]
      );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
           <ThemedText type="link">Close</ThemedText>
        </TouchableOpacity>
        <ThemedText type="subtitle">Saved Workouts</ThemedText>
        <View style={{width: 50}} /> 
      </ThemedView>
      
      {savedWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
              <ThemedText style={{color: theme.icon}}>No saved workouts found.</ThemedText>
          </View>
      ) : (
          <FlatList
            data={savedWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{flex: 1}}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <ThemedText style={{color: theme.icon ?? '#888', fontSize: 12}}>
                        {new Date(item.createdAt).toLocaleDateString()}
                    </ThemedText> 
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity 
                        onPress={() => handleLoad(item.id, item.name, item.exercises)} 
                        style={[styles.button, {backgroundColor: theme.primary}]}
                    >
                        <ThemedText style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>Load</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDelete(item.id, item.name)} 
                        style={[styles.button, {borderColor: theme.surface, borderWidth: 1}]}
                    >
                        <ThemedText style={{fontSize: 14}}>Delete</ThemedText>
                    </TouchableOpacity>
                </View>
              </View>
            )}
            style={styles.list}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
      )}
    </ThemedView>
  );
}

const makeStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.surface,
  },
  closeButton: {
      padding: 8,
  },
  list: {
      flex: 1,
  },
  emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
  },
  item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.surface,
  },
  actions: {
      flexDirection: 'row',
      gap: 8,
  },
  button: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
  }
});
