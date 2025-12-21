import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const Card = ({ children, onDelete, onEdit }: any) => (
  <View testID="card-container">
    {children}
    {onDelete && (
      <TouchableOpacity onPress={onDelete} testID="card-delete-btn">
        <Text>Delete</Text>
      </TouchableOpacity>
    )}
    {onEdit && (
      <TouchableOpacity onPress={onEdit} testID="card-edit-btn">
        <Text>Edit</Text>
      </TouchableOpacity>
    )}
  </View>
);
