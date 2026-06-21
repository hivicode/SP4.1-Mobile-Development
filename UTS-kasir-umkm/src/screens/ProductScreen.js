import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import ProductCard from '../components/ProductCard';
import { GreenHeaderTitle } from '../components/GreenHeader';
import { getProducts, saveProducts } from '../storage/storage';
import { colors, cardShadow, inter } from '../theme/design';
import { smoothLayout } from '../utils/layoutAnimate';
import { useAppSettings } from '../context/AppSettingsContext';

export default function ProductScreen({ navigation }) {
  const { appColors } = useAppSettings();
  const [products, setProducts] = useState([]);

  const load = async () => {
    setProducts(await getProducts());
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Hapus produk?', 'Data tidak bisa dikembalikan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          smoothLayout();
          const next = products.filter((p) => p.id !== id);
          setProducts(next);
          await saveProducts(next);
        },
      },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: appColors.pageBg }]}>
      <GreenHeaderTitle title="Produk" />
      <Text style={[styles.subtitle, { color: appColors.inkMuted }]}>
        {products.length} produk tersedia
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        contentContainerStyle={[
          styles.list,
          products.length === 0 && styles.emptyList,
          { paddingBottom: 88 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyCenter}>
            <Text style={[styles.empty, { color: appColors.inkSoft }]}>
              Belum ada produk. Tekan tombol + untuk menambah.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={(p) => navigation.navigate('AddProductScreen', { product: p })}
            onDelete={handleDelete}
          />
        )}
      />
      <TouchableOpacity
        style={[
          styles.fab,
          {
            bottom: 22,
            backgroundColor: appColors.primary,
            borderColor: appColors.primaryBorder,
          },
        ]}
        activeOpacity={0.92}
        onPress={() => navigation.navigate('AddProductScreen', { product: null })}
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
    paddingHorizontal: 20,
    paddingTop: 8,
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
