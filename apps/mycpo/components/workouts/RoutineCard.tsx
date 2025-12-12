import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUITheme } from '@mycsuite/ui';



interface RoutineCardProps {
  routine: {
    id: string;
    name: string;
    sequence: any[];
    createdAt: string;
  };
  onPress: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
}

export function RoutineCard({ routine, onPress, onLongPress, onDelete }: RoutineCardProps) {
  const theme = useUITheme();
  const styles = makeStyles(theme);

  const workoutCount = routine.sequence.filter((s) => s.type === 'workout').length;
  const totalDays = routine.sequence.length;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.name, {flex: 1}]} numberOfLines={1}>
          {routine.name}
        </Text>
        {onDelete && (
             <TouchableOpacity 
                onPress={(e) => { 
                    onDelete(); 
                }} 
                style={{padding: 4}}
            >
                <Text style={{color: theme.icon, fontSize: 18}}>×</Text>
            </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.stats}>
          {totalDays} Days • {workoutCount} Workouts
        </Text>
        {/* Preview of first few days could go here if we had space */}
      </View>

      <View style={styles.footer}>
        <Text style={styles.actionText}>Set Active</Text>
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 12,
      width: '100%',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.options?.borderColor || 'rgba(150,150,150,0.1)',
      justifyContent: 'space-between',
      minHeight: 90, // ensure consistent height
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    content: {
      flex: 1,
    },
    stats: {
      fontSize: 13,
      color: theme.icon,
      marginBottom: 2,
    },
    footer: {
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionText: {
      color: theme.primary,
      fontWeight: '600',
      fontSize: 14,
    },
  });
