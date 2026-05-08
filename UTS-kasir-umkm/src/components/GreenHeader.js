import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors, inter } from '../theme/design';

function contentPaddingTop(insets, extraBreathing) {
  const extra = extraBreathing != null ? extraBreathing : 12;
  const androidBar = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const top = Math.max(insets.top ?? 0, androidBar);
  return top + extra;
}

export function GreenHeaderHome({ userName = 'Bintang' }) {
  const insets = useSafeAreaInsets();
  const pt = contentPaddingTop(insets, 14);

  return (
    <View style={[styles.shell, { paddingTop: pt }]}>
      <Text style={styles.welcome}>Selamat datang</Text>
      <Text style={styles.halo}>Halo, {userName}!</Text>
    </View>
  );
}

export function GreenHeaderTitle({ title, onBack }) {
  const insets = useSafeAreaInsets();
  const pt = contentPaddingTop(insets, 12);

  return (
    <View style={[styles.shell, styles.shellTight, { paddingTop: pt }]}>
      {onBack ? (
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backHit}
          >
            <ChevronLeft color="#FFFFFF" size={28} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.screenTitleNext} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        <Text style={styles.screenTitle} numberOfLines={1}>
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.headerGreen,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  shellTight: {
    paddingBottom: 14,
  },
  welcome: {
    ...inter.semiBold,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    marginBottom: 6,
  },
  halo: {
    ...inter.extraBold,
    color: '#FFFFFF',
    fontSize: 26,
    letterSpacing: -0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backHit: {
    marginRight: 6,
    marginLeft: -4,
  },
  screenTitle: {
    ...inter.extraBold,
    alignSelf: 'stretch',
    textAlign: 'left',
    color: '#FFFFFF',
    fontSize: 24,
    letterSpacing: -0.4,
  },
  screenTitleNext: {
    ...inter.extraBold,
    flex: 1,
    color: '#FFFFFF',
    fontSize: 24,
    letterSpacing: -0.4,
  },
});
