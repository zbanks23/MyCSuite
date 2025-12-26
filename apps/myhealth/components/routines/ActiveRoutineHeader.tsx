import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ActiveRoutineHeaderProps {
  routineName: string;
  onClearRoutine: () => void;
}

export function ActiveRoutineHeader({
  routineName,
  onClearRoutine,
}: ActiveRoutineHeaderProps) {

  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-lg font-semibold mb-2 text-light dark:text-dark flex-1 mr-2" numberOfLines={1}>
        Active Routine - {routineName}
      </Text>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={onClearRoutine}>
          <Text className="text-xs text-gray-500">Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
