import { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Store } from 'lucide-react-native';

const GRADIENT_COLORS = ['#2F5F3D', '#3D7A4D', '#5C9E62', '#7CB971'];
const GRADIENT_LOCATIONS = [0, 0.35, 0.72, 1];

const TILE = '#F8F9ED';
const ICON_COLOR = '#2F5F3D';

export default function WarungBootSplash() {
  const insets = useSafeAreaInsets();
  const blink = useRef(new Animated.Value(0.38)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 0.32,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      locations={GRADIENT_LOCATIONS}
      style={styles.grad}
      start={{ x: 0.45, y: 0 }}
      end={{ x: 0.45, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.iconTile}>
          <Store color={ICON_COLOR} size={56} strokeWidth={2} />
        </View>
        <View style={styles.brandWrap}>
          <Text
            style={styles.brand}
            allowFontScaling={false}
            numberOfLines={1}
          >
            WarungPOS
          </Text>
        </View>
        <Text
          style={styles.tagline}
          allowFontScaling={false}
          numberOfLines={2}
          textAlign="center"
        >
          Kasir Pintar untuk UMKM
        </Text>
      </View>

      <Animated.View
        style={[
          styles.dotsRow,
          {
            opacity: blink,
            paddingBottom: Math.max(insets.bottom, 34),
          },
        ]}
      >
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotGap]} />
        <View style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  grad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 56,
  },
  iconTile: {
    width: 118,
    height: 118,
    borderRadius: 28,
    backgroundColor: TILE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  brandWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: Platform.OS === 'android' ? 30 : 32,
    color: '#FFFFFF',
    letterSpacing: Platform.OS === 'android' ? 0 : -0.8,
    textAlign: 'center',
    ...(Platform.OS === 'android'
      ? { includeFontPadding: false }
      : {
          // Flat theme: no text shadow.
        }),
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    letterSpacing: Platform.OS === 'android' ? 0 : -0.1,
    textAlign: 'center',
    width: '100%',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  },
  dotsRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dotGap: {
    marginHorizontal: 8,
  },
});
