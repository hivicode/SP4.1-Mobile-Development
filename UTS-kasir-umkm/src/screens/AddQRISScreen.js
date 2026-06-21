import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ButtonPrimary from '../components/ButtonPrimary';
import ScreenShell from '../components/ScreenShell';
import { getQrisAccounts, saveQrisAccounts } from '../storage/storage';
import { colors, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

const PROVIDERS = ['GoPay', 'ShopeePay', 'DANA'];

export default function AddQRISScreen({ navigation, route }) {
  const { settings, appColors } = useAppSettings();
  const editing = route.params?.account;
  const [providerName, setProviderName] = useState(
    editing?.providerName ?? 'GoPay'
  );
  const [label, setLabel] = useState(editing?.label ?? '');
  const [qrImageUrl, setQrImageUrl] = useState(editing?.qrImageUrl ?? '');
  const merchantName = settings.storeName || 'Kasir UMKM';

  const save = async () => {
    const list = await getQrisAccounts();
    const url = qrImageUrl.trim();
    const cleanLabel = label.trim();
    if (editing) {
      const next = list.map((a) =>
        a.id === editing.id
          ? {
              ...a,
              providerName,
              merchantName,
              label: cleanLabel,
              qrImageUrl: url,
            }
          : a
      );
      await saveQrisAccounts(next);
    } else {
      const id = 'q_' + Date.now();
      await saveQrisAccounts([
        ...list,
        {
          id,
          providerName,
          merchantName,
          label: cleanLabel,
          qrImageUrl: url,
        },
      ]);
    }
    navigation.goBack();
  };

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={[styles.label, { color: appColors.ink }]}>Penyedia</Text>
          <View style={styles.row}>
            {PROVIDERS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  {
                    backgroundColor: appColors.card,
                    borderColor: appColors.borderLight,
                  },
                  providerName === p && styles.chipActive,
                  providerName === p && {
                    borderColor: appColors.primary,
                    backgroundColor: appColors.primarySoft,
                  },
                ]}
                onPress={() => setProviderName(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: appColors.inkMuted },
                    providerName === p && styles.chipTextActive,
                    providerName === p && { color: appColors.primary },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: appColors.ink }]}>Merchant</Text>
          <View
            style={[
              styles.readOnlyBox,
              {
                backgroundColor: appColors.card,
                borderColor: appColors.borderLight,
              },
            ]}
          >
            <Text style={[styles.readOnlyText, { color: appColors.ink }]}>
              {merchantName}
            </Text>
          </View>

          <Text style={[styles.label, { color: appColors.ink }]}>Label QRIS (opsional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: appColors.card,
                borderColor: appColors.borderLight,
                color: appColors.ink,
              },
            ]}
            placeholder="Contoh: QRIS utama"
            placeholderTextColor={colors.inkSoft}
            value={label}
            onChangeText={setLabel}
          />

          <Text style={[styles.label, { color: appColors.ink }]}>URL gambar QR (opsional)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: appColors.card,
                borderColor: appColors.borderLight,
                color: appColors.ink,
              },
            ]}
            placeholder="https://..."
            placeholderTextColor={colors.inkSoft}
            autoCapitalize="none"
            value={qrImageUrl}
            onChangeText={setQrImageUrl}
          />
          <Text style={[styles.hint, { color: appColors.inkSoft }]}>
            Kosongkan untuk placeholder. Gunakan URL gambar QR yang valid.
          </Text>

          <ButtonPrimary
            title={editing ? 'Simpan perubahan' : 'Simpan akun'}
            onPress={save}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    ...inter.bold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
    marginHorizontal: -4,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.borderLight,
    margin: 4,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  chipText: {
    ...inter.bold,
    fontSize: 14,
    color: colors.inkMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  readOnlyBox: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 18,
    borderWidth: 1,
  },
  readOnlyText: {
    ...inter.extraBold,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 8,
  },
});
