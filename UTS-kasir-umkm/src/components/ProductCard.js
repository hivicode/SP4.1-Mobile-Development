import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import ProductThumb from './ProductThumb';
import { colors, cardShadow, inter } from '../theme/design';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ProductCard({ product, onEdit, onDelete }) {
  const { appColors } = useAppSettings();
  const formatPrice = (n) =>
    `Rp ${Number(n).toLocaleString('id-ID')}`;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: appColors.card, borderColor: appColors.borderLight },
      ]}
    >
      <View style={styles.thumbOuter}>
        <ProductThumb
          imageUri={product.imageUri}
          emoji={product.emoji}
          productId={product.id}
          size={52}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: appColors.ink }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.price, { color: appColors.inkMuted }]}>
          {formatPrice(product.price)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: appColors.iconCircle }]}
          onPress={() => onEdit(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Pencil size={18} color={appColors.primary} strokeWidth={2.4} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, styles.iconBtnDanger]}
          onPress={() => onDelete(product.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Trash2 size={18} color={colors.danger} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.07, 8),
  },
  thumbOuter: {
    marginRight: 14,
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  name: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 4,
  },
  price: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.inkMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDanger: {
    backgroundColor: colors.dangerSoft,
    marginLeft: 10,
  },
});
