import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Store } from 'lucide-react-native';
import { colors, inter, cardShadow } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

function contentPaddingTop(insets, extraBreathing) {
  const extra = extraBreathing != null ? extraBreathing : 12;
  const androidBar = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const top = Math.max(insets.top ?? 0, androidBar);
  return top + extra;
}

function getGradientColors(title) {
  const t = String(title || '').toLowerCase();
  if (t.includes('kasir')) {
    return ['#60A5FA', colors.pageBg]; // sky blue to page bg
  }
  if (t.includes('transaksi') || t.includes('riwayat') || t.includes('struk') || t.includes('detail')) {
    return ['#F472B6', colors.pageBg]; // pink to page bg
  }
  if (t.includes('produk') || t.includes('barang')) {
    return ['#C084FC', colors.pageBg]; // purple to page bg
  }
  if (t.includes('profil') || t.includes('umkm') || t.includes('pengaturan')) {
    return ['#FBBF24', colors.pageBg]; // orange/yellow to page bg
  }
  // Default is neon green (like calendar!)
  return ['#4ADE80', colors.pageBg]; // lime green to page bg
}

export function GreenHeaderHome() {
  const { settings } = useAppSettings();
  const insets = useSafeAreaInsets();
  const pt = contentPaddingTop(insets, 14);

  return (
    <LinearGradient
      colors={['#4ADE80', colors.pageBg]}
      style={[styles.shell, { paddingTop: pt }]}
    >
      <View style={styles.homeRow}>
        <View style={styles.homeText}>
          <Text style={styles.welcome} numberOfLines={1}>
            Selamat datang di {settings.storeName}
          </Text>
          <Text style={styles.halo} numberOfLines={1}>
            Halo, {settings.ownerName}!
          </Text>
        </View>
        <View
          style={[
            styles.logoTile,
            settings.logoUri && styles.logoTileUploaded,
          ]}
        >
          {settings.logoUri ? (
            <Image
              source={{ uri: settings.logoUri }}
              style={styles.logoImage}
              resizeMode="cover"
            />
          ) : (
            <Store color="#0F172A" size={26} strokeWidth={2.4} />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

export function GreenHeaderTitle({ title, onBack }) {
  const insets = useSafeAreaInsets();
  const pt = contentPaddingTop(insets, 12);
  const gradientColors = getGradientColors(title);

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.shell, styles.shellTight, { paddingTop: pt }]}
    >
      <View style={styles.titleContainer}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButtonCircle}
            activeOpacity={0.85}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ChevronLeft color="#0F172A" size={22} strokeWidth={3} />
          </TouchableOpacity>
        ) : null}
        
        <Text style={styles.centeredScreenTitle} numberOfLines={1}>
          {title}
        </Text>
        
        {onBack ? <View style={{ width: 38 }} /> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  shellTight: {
    paddingBottom: 14,
  },
  welcome: {
    ...inter.medium,
    color: '#1E293B',
    fontSize: 14,
    marginBottom: 6,
  },
  halo: {
    ...inter.extraBold,
    color: '#0F172A',
    fontSize: 26,
    letterSpacing: -0.6,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeText: {
    flex: 1,
    paddingRight: 14,
  },
  logoTile: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  logoTileUploaded: {
    backgroundColor: 'transparent',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButtonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow(),
  },
  centeredScreenTitle: {
    ...inter.extraBold,
    flex: 1,
    textAlign: 'center',
    color: '#0F172A',
    fontSize: 20,
    letterSpacing: -0.4,
  },
});
