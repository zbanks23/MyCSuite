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

    const {
        // ... unused destructuring
        exercises,
        isRunning,
        workoutSeconds,
        restSeconds,
        currentIndex,
        pauseWorkout,
        completeSet,
        nextExercise,
        prevExercise,
    } = useActiveWorkout();

    const styles = makeStyles(theme);
    const current = exercises[currentIndex];
    
    // Preview next exercise
    const nextItem = exercises[currentIndex + 1];

    if (!current) {
         // Fallback if something is wrong or empty
        return (
            <Animated.View style={{ flex: 1, backgroundColor: 'transparent' }} entering={SlideInUp.duration(400)} exiting={SlideOutUp.duration(400)}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>No active exercise</Text>
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
                        <TouchableOpacity onPress={pauseWorkout} style={styles.iconButton}>
                            <IconSymbol name={isRunning ? "pause.fill" : "play.fill"} size={24} color={theme.primary ?? '#000'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {/* Main Card */}
                        <View style={styles.currentCard}>

                    <Text style={styles.exerciseName}>{current.name}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{current.completedSets || 0}</Text>
                            <Text style={styles.statLabel}>Sets Done</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{current.sets}</Text>
                            <Text style={styles.statLabel}>Target Sets</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{current.reps}</Text>
                            <Text style={styles.statLabel}>Reps</Text>
                        </View>
                    </View>
                    
                    {restSeconds > 0 && (
                        <View style={styles.restContainer}>
                            <Text style={styles.restTitle}>Resting</Text>
                            <Text style={styles.restTimer}>{formatSeconds(restSeconds)}</Text>
                        </View>
                    )}
                </View>

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={prevExercise}>
                       <IconSymbol name="backward.fill" size={24} color={theme.text} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryBtn} onPress={completeSet}>
                        <Text style={styles.primaryBtnText}>Complete Set</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn} onPress={nextExercise}>
                        <IconSymbol name="forward.fill" size={24} color={theme.text} />
                    </TouchableOpacity>
                </View>

                {/* Up Next */}
                {nextItem && (
                    <View style={styles.upNextContainer}>
                        <Text style={styles.sectionTitle}>Up Next</Text>
                        <View style={styles.nextCard}>
                            <Text style={styles.nextName}>{nextItem.name}</Text>
                            <Text style={styles.nextDetails}>{nextItem.sets} sets • {nextItem.reps} reps</Text>
                        </View>
                    </View>
                )}
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
        header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
        iconButton: { padding: 8 },
        timer: { fontSize: 24, fontVariant: ['tabular-nums'], fontWeight: '700', color: theme.text },
        title: { fontSize: 20, color: theme.text },
        closeButton: { padding: 10 },
        controlText: { color: theme.primary },
        content: { padding: 20, alignItems: 'center' },
        currentCard: { 
            width: '100%', 
            padding: 24, 
            borderRadius: 20, 
            backgroundColor: theme.surface, 
            alignItems: 'center',
            marginBottom: 30,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        exerciseName: { fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 20, color: theme.text },
        statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
        statItem: { alignItems: 'center', flex: 1 },
        statValue: { fontSize: 28, fontWeight: '700', color: theme.primary },
        statLabel: { fontSize: 12, color: theme.icon, marginTop: 4, textTransform: 'uppercase' },
        statDiv: { width: 1, height: '80%', backgroundColor: theme.border || '#ccc', alignSelf: 'center' },
        restContainer: { marginTop: 10, alignItems: 'center', padding: 10, backgroundColor: theme.background, borderRadius: 12, width: '100%' },
        restTitle: { color: theme.icon, marginBottom: 4 },
        restTimer: { fontSize: 32, fontWeight: '700', color: theme.text, fontVariant: ['tabular-nums'] },
        
        controlsContainer: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 40 },
        primaryBtn: { 
            backgroundColor: theme.primary, 
            paddingVertical: 16, 
            paddingHorizontal: 32, 
            borderRadius: 16,
            minWidth: 160,
            alignItems: 'center',
            shadowColor: theme.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
        },
        primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
        secondaryBtn: { 
            padding: 16, 
            borderRadius: 12, 
            backgroundColor: theme.surface,
            alignItems: 'center',
            justifyContent: 'center'
        },

        upNextContainer: { width: '100%', opacity: 0.8 },
        sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.icon, marginBottom: 10, textTransform: 'uppercase' },
        nextCard: { 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 16, 
            borderRadius: 12, 
            backgroundColor: theme.surface 
        },
        nextName: { fontSize: 18, fontWeight: '600', color: theme.text },
        nextDetails: { color: theme.icon },
    });
