import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductThumb from './ProductThumb';
import { colors, inter } from '../theme/design';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const formatPrice = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  return (
    <View style={styles.row}>
      <View style={styles.thumbCol}>
        <ProductThumb
          imageUri={item.imageUri}
          emoji={item.emoji}
          productId={item.productId}
          size={46}
        />
      </View>
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.unit}>{formatPrice(item.price)} × {item.qty}</Text>
      </View>
      <View style={styles.right}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrease(item.productId)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncrease(item.productId)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.remove} onPress={() => onRemove(item.productId)}>
            <Text style={styles.removeText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  thumbCol: {
    marginRight: 12,
  },
  left: {
    flex: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  name: {
    ...inter.bold,
    fontSize: 15,
    color: colors.ink,
  },
  unit: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  qtyBtnText: {
    ...inter.bold,
    fontSize: 18,
    color: colors.primary,
  },
  qty: {
    ...inter.bold,
    minWidth: 28,
    textAlign: 'center',
    marginHorizontal: 8,
    color: colors.ink,
  },
  remove: {
    marginLeft: 10,
  },
  removeText: {
    ...inter.bold,
    color: colors.danger,
    fontSize: 13,
  },
});
