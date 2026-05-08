import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QrisProviderLogo from './QrisProviderLogo';
import { colors, cardShadow, inter } from '../theme/design';

export default function QRISCard({ account, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.logoWrap}>
          <QrisProviderLogo
            providerName={account.providerName}
            size={56}
            borderRadius={12}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.provider}>{account.providerName}</Text>
          <Text style={styles.merchant}>{account.merchantName}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(account)}>
          <Text style={styles.editText}>Ubah</Text>
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
