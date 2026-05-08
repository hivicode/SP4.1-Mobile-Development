import { LayoutAnimation, Platform, UIManager } from 'react-native';

export function enableGlobalLayoutAnimations() {
  if (
    Platform.OS === 'android' &&
    typeof UIManager.setLayoutAnimationEnabledExperimental === 'function'
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export function smoothLayout() {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    LayoutAnimation.configureNext({
      duration: 260,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  } catch {}
}
