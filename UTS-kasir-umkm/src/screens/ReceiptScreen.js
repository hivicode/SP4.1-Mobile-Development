import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import ButtonPrimary from '../components/ButtonPrimary';
import ScreenShell from '../components/ScreenShell';
import { colors, cardShadow, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ReceiptScreen({ navigation, route }) {
  const { settings, appColors } = useAppSettings();
  const { transaction, fromHistory = false } = route.params || {};

  const formatMoney = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;
  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  const done = () => {
    if (fromHistory) {
      navigation.goBack();
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  const inner = !transaction ? (
    <View style={styles.center}>
      <Text style={styles.warn}>Tidak ada data struk.</Text>
      <ButtonPrimary title="Tutup" onPress={done} />
    </View>
  ) : (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.receiptCard}>
        <Text style={styles.brand}>{settings.storeName}</Text>
        <Text style={[styles.success, { color: appColors.primary }]}>
          {fromHistory ? 'Detail transaksi' : 'Transaksi berhasil'}
        </Text>
        <Text style={styles.id}>{transaction.id}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>

        <View style={styles.divider} />

        {(Array.isArray(transaction.items) ? transaction.items : []).map((line, idx) => (
          <View key={`${idx}-${line.productId}`} style={styles.line}>
            <Text style={styles.lineName}>{line.name}</Text>
            <Text style={styles.lineMeta}>
              {formatMoney(line.price)} × {line.qty}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Total</Text>
        <Text style={[styles.totalValue, { color: appColors.primary }]}>
          {formatMoney(transaction.total)}
        </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.meta}>Metode</Text>
          <Text style={styles.metaBold}>{transaction.method}</Text>
        </View>
      </View>

      <ButtonPrimary
        title={fromHistory ? 'Kembali' : 'Selesai'}
        onPress={done}
        style={styles.btn}
      />
    </ScrollView>
  );

  return <ScreenShell>{inner}</ScreenShell>;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'transparent',
  },
  warn: {
    textAlign: 'center',
    marginBottom: 16,
    color: colors.inkMuted,
  },
  receiptCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.09, 12),
    marginBottom: 20,
  },
  brand: {
    ...inter.extraBold,
    fontSize: 23,
    color: colors.ink,
    textAlign: 'center',
  },
  success: {
    ...inter.bold,
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 8,
  },
  id: {
    textAlign: 'center',
    color: colors.inkMuted,
    marginTop: 12,
    fontSize: 13,
  },
  date: {
    textAlign: 'center',
    color: colors.inkSoft,
    fontSize: 13,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  line: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  lineName: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
  },
  lineMeta: {
    ...inter.semiBold,
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    ...inter.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  totalValue: {
    ...inter.extraBold,
    fontSize: 23,
    color: colors.primary,
  },
  meta: {
    fontSize: 14,
    color: colors.inkMuted,
  },
  metaBold: {
    ...inter.extraBold,
    fontSize: 14,
    color: colors.ink,
  },
  btn: {
    marginTop: 4,
  },
});
