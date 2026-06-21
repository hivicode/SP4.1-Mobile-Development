import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QrisProviderLogo from './QrisProviderLogo';
import { colors, cardShadow, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function QRISCard({ account, onEdit, onDelete }) {
  const { appColors } = useAppSettings();
  const title = account.label?.trim() || account.providerName;
  const subtitle = account.label?.trim()
    ? `${account.providerName} - ${account.merchantName || '-'}`
    : account.merchantName;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: appColors.card, borderColor: appColors.borderLight },
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.logoWrap,
            { backgroundColor: appColors.primarySoft, borderColor: appColors.borderLight },
          ]}
        >
          <QrisProviderLogo
            providerName={account.providerName}
            size={56}
            borderRadius={12}
          />
        </View>
        <View style={styles.info}>
          <Text style={[styles.provider, { color: appColors.ink }]}>{title}</Text>
          <Text style={[styles.merchant, { color: appColors.inkMuted }]}>
            {subtitle}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: appColors.primarySoft }]}
          onPress={() => onEdit(account)}
        >
          <Text style={[styles.editText, { color: appColors.primary }]}>Ubah</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={() => onDelete(account.id)}>
          <Text style={styles.delText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.08, 10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  provider: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
  merchant: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },
  editText: {
    ...inter.bold,
    color: colors.primary,
    fontSize: 13,
  },
  delBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
    marginLeft: 10,
  },
  delText: {
    ...inter.bold,
    color: colors.danger,
    fontSize: 13,
  },
});
