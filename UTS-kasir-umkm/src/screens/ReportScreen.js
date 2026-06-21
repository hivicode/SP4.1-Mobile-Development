import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  TrendingUp,
  Banknote,
  Receipt,
} from 'lucide-react-native';
import { GreenHeaderTitle } from '../components/GreenHeader';
import { getTransactions } from '../storage/storage';
import { colors, cardShadow, inter } from '../theme/design';
import { smoothLayout } from '../utils/layoutAnimate';
import { useAppSettings } from '../context/AppSettingsContext';

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeekMonday(d) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function filterTransactions(txs, segment) {
  const now = new Date();
  if (segment === 'all') return txs;
  if (segment === 'today') {
    return txs.filter((t) => isSameDay(new Date(t.date), now));
  }
  const start = startOfWeekMonday(now);
  return txs.filter((t) => new Date(t.date) >= start);
}

function formatMoney(n) {
  return `Rp ${Number(n).toLocaleString('id-ID')}`;
}

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const SEGMENTS = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'week', label: 'Minggu Ini' },
  { key: 'all', label: 'Semua' },
];

export default function ReportScreen({ navigation }) {
  const { appColors } = useAppSettings();
  const [transactions, setTransactions] = useState([]);
  const [segment, setSegment] = useState('today');

  const load = async () => {
    setTransactions(await getTransactions());
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const filtered = useMemo(
    () => filterTransactions(transactions, segment),
    [transactions, segment]
  );

  const revenue = useMemo(
    () => filtered.reduce((s, t) => s + t.total, 0),
    [filtered]
  );

  const txLineSubtitle = (item) => {
    const items = Array.isArray(item?.items) ? item.items : [];
    const n = items.reduce((acc, line) => acc + (Number(line?.qty) || 0), 0);
    return `${n} item · ${item?.method || '-'} · ${formatTime(item?.date)}`;
  };

  return (
    <View style={[styles.screen, { backgroundColor: appColors.pageBg }]}>
      <GreenHeaderTitle title="Laporan" />

      <View style={styles.segmentOuter}>
        <View
          style={[
            styles.segmentBar,
            { backgroundColor: appColors.card, borderColor: appColors.borderLight },
          ]}
        >
          {SEGMENTS.map(({ key, label }) => {
            const on = segment === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.segBtn,
                  on && styles.segBtnOn,
                  on && { backgroundColor: appColors.primary },
                ]}
                onPress={() => {
                  smoothLayout();
                  setSegment(key);
                }}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segText,
                    { color: appColors.inkMuted },
                    on && styles.segTextOn,
                    on && { color: appColors.onPrimary },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.summary}>
        <View
          style={[
            styles.summaryCard,
            styles.summaryCardLeft,
            { backgroundColor: appColors.card, borderColor: appColors.borderLight },
          ]}
        >
          <View style={[styles.iconMint, { backgroundColor: appColors.mintIconBg }]}>
            <TrendingUp size={22} color={appColors.primary} strokeWidth={2.4} />
          </View>
          <Text style={[styles.sumLabel, { color: appColors.inkMuted }]}>Total Pendapatan</Text>
          <Text style={[styles.sumValue, { color: appColors.primary }]}>
            {formatMoney(revenue)}
          </Text>
        </View>
        <View
          style={[
            styles.summaryCard,
            styles.summaryCardRight,
            { backgroundColor: appColors.card, borderColor: appColors.borderLight },
          ]}
        >
          <View style={[styles.iconMint, { backgroundColor: appColors.mintIconBg }]}>
            <Banknote size={22} color={appColors.primary} strokeWidth={2.4} />
          </View>
          <Text style={[styles.sumLabel, { color: appColors.inkMuted }]}>Total Transaksi</Text>
          <Text style={[styles.sumValue, { color: appColors.ink }]}>{filtered.length}</Text>
        </View>
      </View>

      <Text style={[styles.section, { color: appColors.ink }]}>Riwayat Transaksi</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={[
          styles.list,
          filtered.length === 0 && styles.emptyList,
          { paddingBottom: 28 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyCenter}>
            <Text style={[styles.empty, { color: appColors.inkSoft }]}>
              Belum ada transaksi untuk filter ini.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.txCard,
              { backgroundColor: appColors.card, borderColor: appColors.borderLight },
            ]}
            activeOpacity={0.86}
            onPress={() =>
              navigation.navigate('ReceiptScreen', {
                transaction: item,
                fromHistory: true,
              })
            }
          >
            <View
              style={[
                styles.iconMintSmall,
                { backgroundColor: appColors.mintIconBg },
              ]}
            >
              <Receipt size={20} color={appColors.primary} strokeWidth={2.3} />
            </View>
            <View style={styles.txMid}>
              <Text style={[styles.txId, { color: appColors.ink }]}>#{item.id}</Text>
              <Text style={[styles.txSub, { color: appColors.inkMuted }]}>
                {txLineSubtitle(item)}
              </Text>
            </View>
            <Text style={[styles.txAmt, { color: appColors.primary }]}>
              {formatMoney(item.total)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  segmentOuter: {
    paddingHorizontal: 20,
    marginTop: -10,
    marginBottom: 14,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.06, 6),
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  segBtnOn: {
    backgroundColor: colors.primary,
  },
  segText: {
    ...inter.bold,
    fontSize: 13,
    color: colors.inkMuted,
  },
  segTextOn: {
    color: '#FFFFFF',
  },
  summary: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.07, 8),
  },
  summaryCardLeft: {
    marginRight: 6,
  },
  summaryCardRight: {
    marginLeft: 6,
  },
  iconMint: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.mintIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sumLabel: {
    ...inter.semiBold,
    fontSize: 12,
    color: colors.inkMuted,
    marginBottom: 4,
  },
  sumValue: {
    ...inter.extraBold,
    fontSize: 17,
    color: colors.primary,
  },
  sumBlack: {
    color: colors.ink,
  },
  section: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.ink,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: colors.inkSoft,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.06, 6),
  },
  iconMintSmall: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.mintIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txMid: {
    flex: 1,
    paddingRight: 10,
  },
  txId: {
    ...inter.extraBold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  txSub: {
    ...inter.semiBold,
    fontSize: 12,
    color: colors.inkMuted,
    lineHeight: 17,
  },
  txAmt: {
    ...inter.extraBold,
    fontSize: 15,
    color: colors.primary,
  },
});
