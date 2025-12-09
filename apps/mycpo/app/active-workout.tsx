"use client"

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { useUITheme as useTheme } from '@mycsuite/ui';
import { IconSymbol } from '../components/ui/icon-symbol';
import { formatSeconds } from '../utils/formatting';
import { useActiveWorkout } from '../providers/ActiveWorkoutProvider';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { ExerciseCard } from '../components/ui/ExerciseCard';
// ... imports

export default function ActiveWorkoutScreen() {
    // Initializing theme and router
    const theme = useTheme();
    const router = useRouter();
    const navigation = useNavigation();

    // Animation state
    const [isVisible, setIsVisible] = useState(true);
    const isAnimatingOut = useRef(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (isAnimatingOut.current) {
                // If already animating, let the action proceed
                return;
            }

            // Prevent default behavior of leaving the screen
            e.preventDefault();

            // Trigger animation
            isAnimatingOut.current = true;
            setIsVisible(false);

            // Wait for animation to finish then dispatch the action
            setTimeout(() => {
                navigation.dispatch(e.data.action);
            }, 400); // Match duration of SlideOutUp
        });

        return unsubscribe;
    }, [navigation]);

    // List of all exercises
    const {
        exercises,
        isRunning,
        workoutSeconds,
        restSeconds,
        currentIndex,
        pauseWorkout,
        startWorkout,
        completeSet,
        updateExercise,
    } = useActiveWorkout();

    const styles = makeStyles(theme);


    if (!exercises || exercises.length === 0) {
         // Fallback if something is wrong or empty
        return (
            <Animated.View style={{ flex: 1, backgroundColor: 'transparent' }} entering={SlideInUp.duration(400)} exiting={SlideOutUp.duration(400)}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>No exercises found</Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <Text style={styles.controlText}>Close</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Animated.View>
        );
    }

    return (
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {isVisible && (
            <Animated.View style={{ flex: 1, backgroundColor: 'transparent' }} entering={SlideInUp.duration(400)} exiting={SlideOutUp.duration(400)}>
                <SafeAreaView style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <IconSymbol name="chevron.down" size={24} color={theme.icon ?? '#000'} />
                        </TouchableOpacity>
                        <Text style={styles.timer}>{formatSeconds(workoutSeconds)}</Text>
                        <TouchableOpacity onPress={isRunning ? pauseWorkout : startWorkout} style={styles.iconButton}>
                            <IconSymbol name={isRunning ? "pause.fill" : "play.fill"} size={24} color={theme.primary ?? '#000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {exercises.map((exercise, index) => (
                            <ExerciseCard 
                                key={index}
                                exercise={exercise}
                                isCurrent={index === currentIndex}
                                restSeconds={restSeconds}
                                theme={theme}
                                onCompleteSet={(input) => completeSet(index, input)}
                                onAddSet={() => updateExercise(index, { sets: exercise.sets + 1 })}
                                onDeleteSet={(setIndex) => {
                                    // Logic for deleting a set
                                    const currentLogs = exercise.logs || [];
                                    const currentTarget = exercise.sets;
                                    
                                    if (setIndex < currentLogs.length) {
                                        // Deleting a completed set (log)
                                        const newLogs = [...currentLogs];
                                        newLogs.splice(setIndex, 1);
                                        updateExercise(index, { 
                                            logs: newLogs, 
                                            completedSets: (exercise.completedSets || 1) - 1,
                                            sets: currentTarget > 0 ? currentTarget - 1 : 0
                                        });
                                    } else {
                                        // Deleting a pending set (reduce target)
                                        updateExercise(index, { sets: Math.max(0, currentTarget - 1) });
                                    }
                                }}
                            />
                        ))}

                </ScrollView>
            </SafeAreaView>

            </Animated.View>
            )}
            </View>
    );
}

const makeStyles = (theme: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, marginTop: 40 },
        iconButton: { padding: 8 },
        timer: { fontSize: 24, fontVariant: ['tabular-nums'], fontWeight: '700', color: theme.text },
        title: { fontSize: 20, color: theme.text },
        closeButton: { padding: 10 },
        controlText: { color: theme.primary },
        content: { padding: 20, paddingBottom: 150 },
    });
