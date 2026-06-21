import { LayoutAnimation, Platform, UIManager } from 'react-native';

export function enableGlobalLayoutAnimations() {
  // New Architecture prints a warning because this API is a no-op there.
  // LayoutAnimation.configureNext below still fails safely when unsupported.
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
