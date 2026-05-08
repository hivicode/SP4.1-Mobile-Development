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

const PROVIDERS = ['GoPay', 'ShopeePay', 'DANA'];

export default function AddQRISScreen({ navigation, route }) {
  const editing = route.params?.account;
  const [providerName, setProviderName] = useState(
    editing?.providerName ?? 'GoPay'
  );
  const [merchantName, setMerchantName] = useState(editing?.merchantName ?? '');
  const [qrImageUrl, setQrImageUrl] = useState(editing?.qrImageUrl ?? '');

  const save = async () => {
    const merchant = merchantName.trim();
    if (!merchant) return;
    const list = await getQrisAccounts();
    const url = qrImageUrl.trim();
    if (editing) {
      const next = list.map((a) =>
        a.id === editing.id
          ? {
              ...a,
              providerName,
              merchantName: merchant,
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
          merchantName: merchant,
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
          <Text style={styles.label}>Penyedia</Text>
          <View style={styles.row}>
            {PROVIDERS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.chip,
                  providerName === p && styles.chipActive,
                ]}
                onPress={() => setProviderName(p)}
              >
                <Text
                  style={[
                    styles.chipText,
                    providerName === p && styles.chipTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Nama merchant</Text>
          <TextInput
            style={styles.input}
            placeholder="Warung Bu Sri"
            placeholderTextColor={colors.inkSoft}
            value={merchantName}
            onChangeText={setMerchantName}
          />

          <Text style={styles.label}>URL gambar QR (opsional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={colors.inkSoft}
            autoCapitalize="none"
            value={qrImageUrl}
            onChangeText={setQrImageUrl}
          />
          <Text style={styles.hint}>
            Kosongkan untuk placeholder. Gunakan URL gambar QR yang valid.
          </Text>

          <ButtonPrimary
            title={editing ? 'Simpan perubahan' : 'Simpan akun'}
            onPress={save}
            disabled={!merchantName.trim()}
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
  hint: {
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 8,
  },
});
