import { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Package,
  ShoppingCart,
  BarChart3,
  QrCode,
  TrendingUp,
  Banknote,
} from 'lucide-react-native';
import { getTransactions } from '../storage/storage';
import { GreenHeaderHome } from '../components/GreenHeader';
import FadeSlideIn from '../components/FadeSlideIn';
import { colors, cardShadow, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const QUICK_MENU = [
  { label: 'Produk', Icon: Package, screen: 'ProductScreen' },
  { label: 'Kasir', Icon: ShoppingCart, screen: 'CashierScreen' },
  { label: 'Laporan', Icon: BarChart3, screen: 'ReportScreen' },
  { label: 'QRIS Manager', Icon: QrCode, screen: 'QRISScreen' },
];

export default function HomeScreen({ navigation }) {
  const { appColors } = useAppSettings();
  const [todaySales, setTodaySales] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [yesterdaySales, setYesterdaySales] = useState(0);

  const tileW = useMemo(() => {
    const w = Dimensions.get('window').width;
    const pad = 20 * 2;
    const gap = 12;
    return (w - pad - gap) / 2;
  }, []);

  const load = async () => {
    const txs = await getTransactions();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dayTxs = txs.filter((t) => isSameDay(new Date(t.date), today));
    const sales = dayTxs.reduce((s, t) => s + t.total, 0);
    const yTxs = txs.filter((t) => isSameDay(new Date(t.date), yesterday));
    const ySales = yTxs.reduce((s, t) => s + t.total, 0);

    setTodaySales(sales);
    setTodayCount(dayTxs.length);
    setYesterdaySales(ySales);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const formatMoney = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  let pctLabel = '0% dari kemarin';
  if (yesterdaySales > 0) {
    const pct = Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100);
    pctLabel = `${pct >= 0 ? '+' : ''}${pct}% dari kemarin`;
  } else if (todaySales > 0) {
    pctLabel = '+100% dari kemarin';
  }

  return (
    <View style={[styles.screen, { backgroundColor: appColors.pageBg }]}>
      <GreenHeaderHome />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeSlideIn delay={0}>
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: appColors.creamCard,
                borderColor: appColors.borderLight,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.trendChip,
                {
                  backgroundColor: appColors.card,
                  borderColor: appColors.borderLight,
                },
              ]}
              activeOpacity={0.85}
            >
              <TrendingUp size={18} color={appColors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={[styles.heroLabel, { color: appColors.inkMuted }]}>
              Total Penjualan Hari Ini
            </Text>
            <Text style={[styles.heroAmount, { color: appColors.primary }]}>
              {formatMoney(todaySales)}
            </Text>
            <View style={[styles.badge, { backgroundColor: appColors.badgeBg }]}>
              <Text style={[styles.badgeText, { color: appColors.badgeText }]}>
                {pctLabel}
              </Text>
            </View>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={55}>
          <View
            style={[
              styles.txSummary,
              { backgroundColor: appColors.card, borderColor: appColors.borderLight },
            ]}
          >
            <View style={[styles.mintIcon, { backgroundColor: appColors.mintIconBg }]}>
              <Banknote size={22} color={appColors.primary} strokeWidth={2.3} />
            </View>
            <View style={styles.txSummaryText}>
              <Text style={[styles.txSummaryLabel, { color: appColors.inkMuted }]}>
                Total Transaksi
              </Text>
              <Text style={[styles.txSummaryValue, { color: appColors.ink }]}>
                {todayCount} transaksi
              </Text>
            </View>
          </View>
        </FadeSlideIn>

        <FadeSlideIn delay={100}>
          <Text style={[styles.section, { color: appColors.ink }]}>Menu Cepat</Text>
        </FadeSlideIn>
        <View style={styles.menuGrid}>
          {QUICK_MENU.map(({ label, Icon, screen }, index) => {
            const MENU_COLORS = ['#DBEAFE', '#FCE7F3', '#F3E8FF', '#D1FAE5'];
            const tileBg = MENU_COLORS[index % MENU_COLORS.length];
            return (
              <FadeSlideIn
                key={screen}
                delay={150 + index * 55}
                style={{ width: tileW }}
              >
                <TouchableOpacity
                  style={[
                    styles.menuTile,
                    { backgroundColor: tileBg },
                  ]}
                  onPress={() => navigation.navigate(screen)}
                  activeOpacity={0.9}
                >
                  <View
                    style={[
                      styles.menuIconCircle,
                      { backgroundColor: '#FFFFFF' },
                    ]}
                  >
                    <Icon size={28} color={appColors.primary} strokeWidth={2.2} />
                  </View>
                  <Text style={[styles.menuTileLabel, { color: appColors.ink }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              </FadeSlideIn>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: colors.creamCard,
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
    ...cardShadow(),
    borderWidth: 2.2,
    borderColor: '#0F172A',
  },
  trendChip: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  heroLabel: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.inkMuted,
    marginBottom: 8,
    paddingRight: 48,
  },
  heroAmount: {
    ...inter.extraBold,
    fontSize: 28,
    color: colors.primary,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  badgeText: {
    ...inter.bold,
    fontSize: 11,
    color: colors.badgeText,
  },
  txSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
    borderWidth: 2.2,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  mintIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.mintIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  txSummaryText: {
    flex: 1,
  },
  txSummaryLabel: {
    ...inter.semiBold,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  txSummaryValue: {
    ...inter.extraBold,
    fontSize: 17,
    color: colors.ink,
  },
  section: {
    ...inter.extraBold,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 14,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuTile: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2.2,
    borderColor: '#0F172A',
    ...cardShadow(),
  },
  menuIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  menuTileLabel: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
  },
});
