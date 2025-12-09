import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { formatSeconds } from '../../utils/formatting';
import { Exercise } from '../../hooks/useWorkoutManager';

interface ExerciseCardProps {
    exercise: Exercise;
    isCurrent: boolean;
    onCompleteSet: (input: { weight?: string, reps?: string, duration?: string }) => void;
    onAddSet: () => void;
    onDeleteSet: (index: number) => void;
    restSeconds: number;
    theme: any;
}

export function ExerciseCard({ exercise, isCurrent, onCompleteSet, onAddSet, onDeleteSet, restSeconds, theme }: ExerciseCardProps) {
    // Current input state
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    
    // Derived state
    const completedSets = exercise.completedSets || 0;
    const isFinished = completedSets >= exercise.sets;

    const handleComplete = () => {
        onCompleteSet({ weight, reps });
        // Clear inputs for next set? Or keep current weights?
        // Usually good to keep weights if same, or clear. Let's keep for now or clear?
        // User might do same weight.
    };

    const styles = makeStyles(theme);

    return (
        <View style={[styles.card, isCurrent && styles.activeCard]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{exercise.name}</Text>
                    <Text style={styles.details}>Target: {exercise.sets} sets • {exercise.reps} reps</Text>
                </View>
                {isFinished && <IconSymbol name="checkmark.circle.fill" size={24} color={theme.primary} />}
                {isCurrent && !isFinished && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>CURRENT</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                {/* Headers */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.colHead, styles.colSet]}>SET</Text>
                    <Text style={[styles.colHead, styles.colPrev]}>PREVIOUS</Text>
                    <Text style={[styles.colHead, styles.colInput]}>LBS</Text>
                    <Text style={[styles.colHead, styles.colInput]}>REPS</Text>
                    <View style={styles.colAction} />
                    <View style={styles.colDelete} />
                </View>

                {/* Render Rows */}
                {Array.from({ length: Math.max(exercise.sets, exercise.logs?.length || 0) }).map((_, i) => {
                    const log = exercise.logs?.[i];
                    const isCompleted = !!log;
                    const isCurrentSet = !isCompleted && i === (exercise.logs?.length || 0);
                    
                    return (
                        <View key={i} style={[styles.row, isCurrentSet && styles.activeRow]}>
                            {/* Set Number */}
                            <View style={styles.colSet}>
                                <View style={[styles.setCircle, isCompleted && styles.setCircleCompleted, isCurrentSet && styles.setCircleActive]}>
                                    <Text style={[styles.setNum, isCompleted && styles.setNumCompleted]}>{i + 1}</Text>
                                </View>
                            </View>

                            {/* Previous (Placeholder for now, could be history) */}
                            <Text style={[styles.colPrev, styles.prevText]}>-</Text>

                            {/* Inputs / Values */}
                            {isCompleted ? (
                                <>
                                    <Text style={[styles.colInput, styles.valueText]}>{log.weight}</Text>
                                    <Text style={[styles.colInput, styles.valueText]}>{log.reps}</Text>
                                    <View style={styles.colAction}>
                                         <IconSymbol name="checkmark" size={16} color={theme.primary} />
                                    </View>
                                </>
                            ) : isCurrentSet ? (
                                <>
                                    <TextInput 
                                        style={styles.cellInput} 
                                        value={weight} 
                                        onChangeText={setWeight} 
                                        placeholder="-" 
                                        keyboardType="numeric" 
                                        placeholderTextColor={theme.icon}
                                    />
                                    <TextInput 
                                        style={styles.cellInput} 
                                        value={reps} 
                                        onChangeText={setReps} 
                                        placeholder={exercise.reps.toString()}
                                        keyboardType="numeric" 
                                        placeholderTextColor={theme.icon}
                                    />
                                    <TouchableOpacity style={styles.checkBtn} onPress={handleComplete}>
                                        <IconSymbol name="checkmark" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text style={[styles.colInput, styles.placeholderText]}>-</Text>
                                    <Text style={[styles.colInput, styles.placeholderText]}>-</Text>
                                    <View style={styles.colAction} />
                                </>
                            )}
                            
                            {/* Delete Action */}
                            <TouchableOpacity style={styles.colDelete} onPress={() => onDeleteSet(i)}>
                                <IconSymbol name="trash" size={16} color={theme.icon} />
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* Rest Timer (Compact) */}
                {isCurrent && restSeconds > 0 && (
                     <View style={styles.restBar}>
                        <IconSymbol name="timer" size={16} color={theme.primary} />
                        <Text style={styles.restText}>{formatSeconds(restSeconds)}</Text>
                    </View>
                )}

                {/* Add Set Button */}
                <TouchableOpacity style={styles.addSetBtn} onPress={onAddSet}>
                     <IconSymbol name="plus.circle.fill" size={20} color={theme.primary} />
                     <Text style={styles.addSetText}>Add Set</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const makeStyles = (theme: any) => StyleSheet.create({
    card: {
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        width: '100%',
    },
    activeCard: {
        borderColor: theme.primary,
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: { fontSize: 18, fontWeight: '700', color: theme.text, marginBottom: 4 },
    details: { fontSize: 14, color: theme.icon },
    badge: { backgroundColor: theme.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    
    content: { paddingTop: 12 },
    
    tableHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
    colHead: { fontSize: 10, color: theme.icon, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center' },
    colSet: { width: 30 },
    colPrev: { flex: 1, textAlign: 'center' },
    colInput: { width: 60, textAlign: 'center' },
    colAction: { width: 40, alignItems: 'center' },
    colDelete: { width: 30, alignItems: 'center', justifyContent: 'center' },

    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, height: 44, backgroundColor: theme.surface, borderRadius: 8 },
    activeRow: { backgroundColor: theme.surfaceComponent || '#f8f9fa' }, // Slight highlight for active row

    setCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
    setCircleCompleted: { backgroundColor: theme.primary },
    setCircleActive: { borderWidth: 1, borderColor: theme.primary },
    setNum: { fontSize: 12, fontWeight: '700', color: theme.icon },
    setNumCompleted: { color: '#fff' },

    prevText: { fontSize: 12, color: theme.icon },
    valueText: { fontSize: 14, fontWeight: '700', color: theme.text },
    placeholderText: { fontSize: 14, color: theme.border },

    cellInput: { 
        width: 60, 
        height: 36, 
        backgroundColor: theme.background, 
        borderRadius: 8, 
        textAlign: 'center', 
        fontSize: 16, 
        fontWeight: '700',
        color: theme.text,
        marginHorizontal: 4
    },
    
    checkBtn: { 
        width: 36, 
        height: 36, 
        borderRadius: 8, 
        backgroundColor: theme.primary, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginLeft: 4
    },
    
    restBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, padding: 8, backgroundColor: theme.surfaceComponent, borderRadius: 8 },
    restText: { fontSize: 14, fontWeight: '700', color: theme.text, fontVariant: ['tabular-nums'] },

    addSetBtn: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 12, 
        marginTop: 8,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: theme.border
    },
    addSetText: { fontSize: 14, fontWeight: '600', color: theme.primary },
});
