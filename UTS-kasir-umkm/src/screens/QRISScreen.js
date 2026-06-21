import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import QRISCard from '../components/QRISCard';
import { GreenHeaderTitle } from '../components/GreenHeader';
import { getQrisAccounts, saveQrisAccounts } from '../storage/storage';
import { colors, cardShadow, inter } from '../theme/design';
import { smoothLayout } from '../utils/layoutAnimate';
import { useAppSettings } from '../context/AppSettingsContext';

export default function QRISScreen({ navigation }) {
  const { appColors } = useAppSettings();
  const [accounts, setAccounts] = useState([]);
  const insets = useSafeAreaInsets();

  const load = async () => {
    setAccounts(await getQrisAccounts());
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Hapus akun QRIS?', '', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          smoothLayout();
          const next = accounts.filter((a) => a.id !== id);
          setAccounts(next);
          await saveQrisAccounts(next);
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: appColors.pageBg }]}>
      <GreenHeaderTitle
        title="Kelola QRIS"
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.subtitle, { color: appColors.inkMuted }]}>
        {accounts.length} akun QRIS
      </Text>
      <FlatList
        data={accounts}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 88 },
        ]}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: appColors.inkSoft }]}>
            Belum ada akun. Tekan + untuk menambah GoPay, ShopeePay, atau DANA.
          </Text>
        }
        renderItem={({ item }) => (
          <QRISCard
            account={item}
            onEdit={(acc) =>
              navigation.navigate('AddQRISScreen', { account: acc })
            }
            onDelete={handleDelete}
          />
        )}
      />
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 16,
            backgroundColor: appColors.primary,
            borderColor: appColors.primaryBorder,
          },
        ]}
        activeOpacity={0.92}
        onPress={() =>
          navigation.navigate('AddQRISScreen', { account: null })
        }
      >
        <Plus size={28} color={appColors.onPrimary} strokeWidth={2.8} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  subtitle: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.inkMuted,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 6,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  empty: {
    textAlign: 'center',
    color: colors.inkSoft,
    marginTop: 48,
    paddingHorizontal: 28,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    ...cardShadow(0.22, 14),
  },
});
