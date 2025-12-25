import { Text, Pressable } from 'react-native';
import type { PressableProps } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable className support for React Native components (if not already enabled globally)
cssInterop(Pressable, { className: 'style' });
cssInterop(Text, { className: 'style' });

export const RaisedButton = ({ title, className, textClassName, style, ...props }: { title: string; className?: string; textClassName?: string } & PressableProps) => {
  const defaultClasses = 'p-4 my-4 rounded-xl items-center justify-center bg-light dark:bg-dark border border-t-highlight border-l-highlight border-b-transparent border-r-transparent dark:border-t-highlight-dark dark:border-l-highlight-dark active:opacity-90';
  const combined = `${defaultClasses}${className ? ' ' + className : ''}`;

  const shadowStyle = {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  };

  return (
    <Pressable
      {...props}
      className={combined}
      style={[shadowStyle, style] as any}>
      <Text className={textClassName || "text-center text-primary font-bold text-lg"}>{title}</Text>
    </Pressable>
  );
};
