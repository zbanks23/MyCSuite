import React from 'react';
import { View, Text } from 'react-native';

export const SetRow = ({ index }: any) => (
  <View testID={`set-row-${index}`}>
    <Text>Set {index + 1}</Text>
  </View>
);

export const getExerciseFields = () => ({
  showWeight: true,
  showReps: true,
  showDuration: false,
  showDistance: false,
  showBodyweight: false,
});
