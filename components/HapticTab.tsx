import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform } from 'react-native';

export function HapticTab(props: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable
      {...props}
      onPress={e => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPress?.(e);
      }}
    />
  );
}

import { Pressable } from 'react-native';