import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import WarungBootSplash from './src/components/WarungBootSplash';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/design';
import { enableGlobalLayoutAnimations } from './src/utils/layoutAnimate';

enableGlobalLayoutAnimations();

const MIN_SPLASH_MS = 1150;

function mergeDefaultFontStyle(existing) {
  const base = { fontFamily: 'Inter_400Regular' };
  if (existing == null) return base;
  return Array.isArray(existing) ? [base, ...existing] : [base, existing];
}

function applyTextDefaults() {
  Text.defaultProps = Text.defaultProps || {};
  TextInput.defaultProps = TextInput.defaultProps || {};
  Text.defaultProps.style = mergeDefaultFontStyle(Text.defaultProps.style);
  TextInput.defaultProps.style = mergeDefaultFontStyle(TextInput.defaultProps.style);
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const didApplyDefaults = useRef(false);
  const [splashDone, setSplashDone] = useState(false);

  const bootstrapOk = fontsLoaded || fontError;

  useLayoutEffect(() => {
    if (splashDone) return undefined;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        SplashScreen.hideAsync().catch(() => {});
      });
    });
    return () => cancelAnimationFrame(id);
  }, [splashDone]);

  useEffect(() => {
    if (!bootstrapOk) return undefined;

    let alive = true;

    if (fontsLoaded && !didApplyDefaults.current) {
      didApplyDefaults.current = true;
      applyTextDefaults();
    }

    (async () => {
      await new Promise((r) => setTimeout(r, MIN_SPLASH_MS));
      if (alive) {
        setSplashDone(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [bootstrapOk, fontsLoaded]);

  return (
    <SafeAreaProvider
      style={[
        rootStyles.shell,
        {
          backgroundColor: splashDone ? colors.pageBg : '#2F5F3D',
        },
      ]}
    >
      <View style={rootStyles.fill}>
        {!splashDone ? <WarungBootSplash /> : <AppNavigator />}
      </View>
      <StatusBar style="light" backgroundColor={colors.headerGreen} />
    </SafeAreaProvider>
  );
}

const rootStyles = StyleSheet.create({
  shell: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
