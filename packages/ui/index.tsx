import { Text, Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable className support for React Native components
cssInterop(Pressable, { className: 'style' });
cssInterop(Text, { className: 'style' });

export const SharedButton = ({ title, ...props }: { title: string } & PressableProps) => {
  return (
    <Pressable {...props} className="p-4 my-4 bg-purple-600 rounded-lg active:bg-purple-800">
      <Text className="text-center text-white font-bold">{title}</Text>
    </Pressable>
  );
};