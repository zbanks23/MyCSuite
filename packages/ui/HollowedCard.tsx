import * as React from 'react';
import { View, TouchableOpacity, ViewProps, TouchableOpacityProps, useWindowDimensions } from 'react-native';
import { cssInterop } from 'nativewind';

interface CardProps extends ViewProps {
  onPress?: () => void;
  activeOpacity?: number;
}

export function HollowedCard({ children, style, className, onPress, activeOpacity = 0.9, ...props }: CardProps) {
  // Neumorphic HollowedCard "Faux Inset" Style using NativeWind
  // Strategy: slightly darker BG + Asymmetric borders to simulate inner shadow/highlight
  // Light Mode: slightly darker BG (gray-200), Top-Left Border Darker (gray-300), Bottom-Right Border lighter (white)
  // Dark Mode: darker BG (black/20), Top-Left Border Black, Bottom-Right Border lighter (gray-800)
  
  const baseClassName = `
    w-full mb-1 p-3 rounded-xl
    bg-gray-100 dark:bg-black/20
    border-t-[3px] border-l-[3px] border-b-[1px] border-r-[1px]
    border-t-gray-300 border-l-gray-300 border-b-white border-r-white
    dark:border-t-black/60 dark:border-l-black/60 dark:border-b-white/10 dark:border-r-white/10
    ${className || ''}
  `.replace(/\s+/g, ' ').trim();
  
  const shadowStyle = { 
    //   overflow: 'hidden' as const
  };

  return onPress ? (
    <TouchableOpacity 
        style={[style, shadowStyle]} 
        className={baseClassName} 
        onPress={onPress} 
        activeOpacity={activeOpacity}
        {...(props as TouchableOpacityProps)}
    >
        {children}
    </TouchableOpacity>
  ) : (
    <View style={[style, shadowStyle]} className={baseClassName} {...props}>
        {children}
    </View>
  );
}
