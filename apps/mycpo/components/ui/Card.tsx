import React, { useRef } from 'react';
import { View, TouchableOpacity, ViewProps, TouchableOpacityProps, useWindowDimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { 
    useAnimatedStyle, 
    useAnimatedReaction, 
    runOnJS, 
    interpolate, 
    Extrapolation, 
    SharedValue,
    useSharedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './icon-symbol';

interface CardProps extends ViewProps {
  onPress?: () => void;
  activeOpacity?: number;
  onDelete?: () => void;
  onEdit?: () => void;
}

// Actions component that monitors drag distance
const CardSwipeAction = ({ 
    dragX, 
    onDelete,
    onEdit,
    onSetReadyToDelete
}: { 
    dragX: SharedValue<number>; 
    onDelete: () => void;
    onEdit?: () => void;
    onSetReadyToDelete: (ready: boolean) => void;
}) => {
    const { width } = useWindowDimensions();
    const hasTriggered = useSharedValue(false);
    // Trigger when card is swiped past 45% of screen width
    const TRIGGER_THRESHOLD = -width * 0.45;
    
    const BUTTON_HEIGHT = 40; 
    const GAP = 10; // Between buttons
    const MARGIN = 20; // Right edge margin (Card has no margin now)
    const CARD_GAP = 10; // Padding from the card
    
    // Layout width for buttons + all spacing
    // If edit exists: (BUTTON_HEIGHT * 2) + GAP + MARGIN + CARD_GAP
    // If no edit: BUTTON_HEIGHT + MARGIN + CARD_GAP + extra padding for single button look?
    const hasEdit = !!onEdit;
    const LAYOUT_WIDTH = hasEdit 
        ? (BUTTON_HEIGHT * 2) + GAP + MARGIN + CARD_GAP 
        : BUTTON_HEIGHT + MARGIN + CARD_GAP + 20; // extra space if just one button

    // Monitor drag value to trigger haptic feedback on long swipe
    useAnimatedReaction(
        () => dragX.value,
        (currentDrag) => {
            if (currentDrag < TRIGGER_THRESHOLD && !hasTriggered.value) {
                hasTriggered.value = true;
                runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
                // Mark parent as ready to delete
                runOnJS(onSetReadyToDelete)(true);
            } else if (currentDrag > TRIGGER_THRESHOLD + 40 && hasTriggered.value) {
                hasTriggered.value = false;
                // Unmark if user swipes back
                runOnJS(onSetReadyToDelete)(false);
            }
        }
    );

    // Delete Button (Red Blob) Animation
    const deleteStyle = useAnimatedStyle(() => {
        const drag = dragX.value;
        const absDrag = Math.abs(drag);
        
        let w = BUTTON_HEIGHT;
        let borderRadius = BUTTON_HEIGHT / 2;
        
        // Only expand if we have dragged past the full layout width (overshoot)
        // This prevents the red button from covering the Edit button during normal swipe
        if (absDrag > LAYOUT_WIDTH) {
             w = BUTTON_HEIGHT + (absDrag - LAYOUT_WIDTH);
        }

        const scale = interpolate(
            drag,
            [-50, 0], 
            [1, 0], 
            Extrapolation.CLAMP
        );

        // Fade in entire button
        const opacity = interpolate(
            drag,
            [-50, -10],
            [1, 0],
            Extrapolation.CLAMP
        );
        
        const isDeleting = drag < TRIGGER_THRESHOLD;

        return {
            width: w, 
            height: BUTTON_HEIGHT,
            borderRadius: borderRadius, 
            transform: [{ scale }],
            opacity,
            zIndex: isDeleting ? 10 : 0, 
        };
    });

    // Edit Button Animation
    const editStyle = useAnimatedStyle(() => {
        if (!hasEdit) return { opacity: 0 };

        const drag = dragX.value;
        const absDrag = Math.abs(drag);
        
        let translateX = 0;
        if (absDrag > LAYOUT_WIDTH) {
             translateX = -(absDrag - LAYOUT_WIDTH);
        }
        
         const scale = interpolate(
            drag,
            [-110, -50], 
            [1, 0], 
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            drag,
            [-110, -60],
            [1, 0],
            Extrapolation.CLAMP
        );
        
        const isDeleting = drag < TRIGGER_THRESHOLD;

        return {
            transform: [{ translateX }, { scale }],
            opacity: isDeleting ? 0 : opacity,
        };
    });
    
    const deleteIconStyle = useAnimatedStyle(() => {
         const scale = interpolate(
            dragX.value,
            [-50, 0],
            [1, 0.5],
            Extrapolation.CLAMP
        );
        return { transform: [{ scale }] };
    });



    const deleteLabelStyle = useAnimatedStyle(() => {
        const drag = dragX.value;
        const absDrag = Math.abs(drag);
        
        let translateX = 0;
        
        // Calculate how much the button has expanded beyond its initial size
        // The button exapnds to the left, so we need to move the text to the left by half that amount to stay centered
        if (absDrag > LAYOUT_WIDTH) {
             const expansion = absDrag - LAYOUT_WIDTH;
             translateX = -expansion / 2;
        }

        return {
            transform: [{ translateX }],
            // Removed opacity fade as requested - text remains visible
        };
    });

    return (
        <View style={{ width: LAYOUT_WIDTH, height: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
             
             {/* Gap from Card */}
             <View style={{ width: CARD_GAP }} />

             {/* Edit Button Wrapper */}
             {hasEdit && (
                 <View style={{ marginRight: GAP, alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.View style={[editStyle]} className="justify-center items-center">
                        <TouchableOpacity 
                            onPress={onEdit} 
                            activeOpacity={0.8}
                            style={{ 
                                width: BUTTON_HEIGHT, 
                                height: BUTTON_HEIGHT, 
                                borderRadius: BUTTON_HEIGHT/2, 
                                backgroundColor: '#2563eb', // blue-600
                                justifyContent: 'center', 
                                alignItems: 'center',
                            }}
                            className="bg-primary dark:bg-primary_dark"
                        >
                            <IconSymbol name="pencil" size={18} color="white" />
                        </TouchableOpacity>
                        <Animated.Text className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1">
                            Edit
                        </Animated.Text>
                    </Animated.View>
                 </View>
             )}

             {/* Delete Button Wrapper */}
            <View style={{ marginRight: MARGIN, alignItems: 'center', justifyContent: 'center' }}>
                {/* 
                    Top part: The Button Anchor. 
                    We use a relative container of 40x40 to match the Edit button's circle slot.
                    The Expanding Red Blob is absolute positioned inside this anchor so it grows from right-to-left 
                    without breaking the layout or alignment.
                */}
                <View style={{ width: BUTTON_HEIGHT, height: BUTTON_HEIGHT, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                     <Animated.View 
                        className="bg-red-500 overflow-hidden" 
                        style={[deleteStyle, { position: 'absolute', right: 0 }]} 
                    >
                        <TouchableOpacity onPress={onDelete} activeOpacity={0.8} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Animated.View style={[deleteIconStyle]}>
                                <IconSymbol name="trash.fill" size={16} color="white" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                
                {/* Bottom part: The Label. visible in static state, hidden in expansion */}
                <Animated.Text 
                    className="text-gray-500 dark:text-gray-400 text-[10px] font-semibold mt-1"
                    style={[deleteLabelStyle]}
                >
                    Trash
                </Animated.Text>
            </View>
        </View>
    );
};

export function Card({ children, style, className, onPress, activeOpacity = 0.9, onDelete, onEdit, ...props }: CardProps) {
  // Base styling from RoutineCard
  const baseClassName = `bg-surface dark:bg-surface_dark rounded-xl p-3 w-full mb-1 border border-black/5 dark:border-white/10 shadow-sm ${className || ''}`;

  // Track if we are deep enough to delete
  const shouldDelete = useRef(false);
  const swipeableRef = useRef<any>(null);

  const setReadyToDelete = (ready: boolean) => {
      shouldDelete.current = ready;
  };

  const Content = (
    onPress ? (
        <TouchableOpacity 
          style={style} 
          className={baseClassName} 
          onPress={onPress} 
          activeOpacity={activeOpacity}
          {...(props as TouchableOpacityProps)}
        >
          {children}
        </TouchableOpacity>
      ) : (
        <View style={style} className={baseClassName} {...props}>
          {children}
        </View>
      )
  );

  if (onDelete) {
      return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={(progress, dragX) => (
                <CardSwipeAction 
                    dragX={dragX}
                    onDelete={() => {
                        swipeableRef.current?.close();
                        onDelete();
                    }}
                    onEdit={onEdit}
                    onSetReadyToDelete={setReadyToDelete}
                />
            )}
            overshootRight={true} // Allow overshooting
            friction={2}
            rightThreshold={40}
            onSwipeableWillOpen={() => {
                // Trigger delete ONLY if we dragged past the deep threshold
                if (shouldDelete.current) {
                    swipeableRef.current?.close();
                    onDelete();
                }
            }}
            containerStyle={{ overflow: 'visible' }}
        >
            {Content}
        </Swipeable>
      );
  }

  return Content;
}
