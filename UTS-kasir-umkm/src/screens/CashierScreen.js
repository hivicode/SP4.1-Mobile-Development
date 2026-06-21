import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import CartItem from '../components/CartItem';
import ButtonPrimary from '../components/ButtonPrimary';
import { GreenHeaderTitle } from '../components/GreenHeader';
import ProductThumb from '../components/ProductThumb';
import { getProducts, getCart, saveCart } from '../storage/storage';
import { colors, cardShadow, inter } from '../theme/design';
import { smoothLayout } from '../utils/layoutAnimate';
import { useAppSettings } from '../context/AppSettingsContext';

export default function CashierScreen({ navigation }) {
  const { appColors } = useAppSettings();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartExpanded, setCartExpanded] = useState(false);
  const chevronSpin = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cart.length === 0) {
      setCartExpanded(false);
    }
  }, [cart.length]);

  useEffect(() => {
    if (cart.length === 0) return;
    Animated.spring(chevronSpin, {
      toValue: cartExpanded ? 0 : 1,
      friction: 9,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [cartExpanded, cart.length, chevronSpin]);

  const cardW = useMemo(() => {
    const w = Dimensions.get('window').width;
    const pad = 16 * 2;
    const gap = 12;
    return (w - pad - gap) / 2;
  }, []);

  const persistCart = async (next) => {
    const becomesVisible = cart.length === 0 && next.length > 0;
    const becomesHidden = cart.length > 0 && next.length === 0;
    if (becomesVisible || becomesHidden) {
      smoothLayout();
    }
    setCart(next);
    await saveCart(next);
  };

  const load = async () => {
    const [prods, savedCart] = await Promise.all([getProducts(), getCart()]);
    setProducts(prods);
    setCart(savedCart);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const addProduct = (product) => {
    const existing = cart.find((c) => c.productId === product.id);
    let next;
    if (existing) {
      next = cart.map((c) =>
        c.productId === product.id ? { ...c, qty: c.qty + 1 } : c
      );
    } else {
      next = [
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          ...(product.imageUri ? { imageUri: product.imageUri } : {}),
          ...(product.emoji && String(product.emoji).trim()
            ? { emoji: String(product.emoji).trim() }
            : {}),
        },
      ];
    }
    persistCart(next);
  };

  const increase = (productId) => {
    const next = cart.map((c) =>
      c.productId === productId ? { ...c, qty: c.qty + 1 } : c
    );
    persistCart(next);
  };

  const decrease = (productId) => {
    const next = cart
      .map((c) =>
        c.productId === productId ? { ...c, qty: c.qty - 1 } : c
      )
      .filter((c) => c.qty > 0);
    persistCart(next);
  };

  const remove = (productId) => {
    persistCart(cart.filter((c) => c.productId !== productId));
  };

  const total = useMemo(
    () => cart.reduce((s, c) => s + c.price * c.qty, 0),
    [cart]
  );
  const totalQty = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const formatMoney = (n) => `Rp ${Number(n).toLocaleString('id-ID')}`;

  const toggleCartExpanded = () => {
    if (cart.length === 0) return;
    smoothLayout();
    setCartExpanded((prev) => !prev);
  };

  const chevronRotation = chevronSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const checkout = () => {
    if (cart.length === 0) return;
    navigation.navigate('PaymentScreen', {
      cartItems: cart,
      cartTotal: total,
    });
  };

  const cartScrollMax = useMemo(() => {
    const h = Dimensions.get('window').height;
    return Math.min(Math.round(h * 0.42), 320);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: appColors.pageBg }]}>
      <GreenHeaderTitle title="Kasir" />
      <View style={[styles.body, { backgroundColor: appColors.pageBg }]}>
        <ScrollView
          style={[styles.productScroll, { backgroundColor: appColors.pageBg }]}
          contentContainerStyle={[
            styles.productScrollInner,
            products.length === 0 && styles.productEmptyInner,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {products.length > 0 ? (
            <>
              <Text style={[styles.hint, { color: appColors.inkMuted }]}>
                Pilih produk untuk ditambahkan ke keranjang
              </Text>

              <View style={styles.grid}>
                {products.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.gridCard,
                      {
                        backgroundColor: appColors.card,
                        borderColor: appColors.borderLight,
                      },
                      { width: cardW },
                      index % 2 === 0 ? styles.gridCardLeft : styles.gridCardRight,
                    ]}
                  >
                    <View style={styles.gridThumbWrap}>
                      <ProductThumb
                        imageUri={item.imageUri}
                        emoji={item.emoji}
                        productId={item.id}
                        size={56}
                      />
                    </View>
                    <Text
                      style={[styles.gridName, { color: appColors.ink }]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.gridPrice, { color: appColors.primary }]}>
                      {formatMoney(item.price)}
                    </Text>
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: appColors.primary }]}
                      onPress={() => addProduct(item)}
                      activeOpacity={0.88}
                    >
                  <Text style={[styles.addBtnText, { color: appColors.onPrimary }]}>
                    + Tambah
                  </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyCenter}>
              <Text style={[styles.empty, { color: appColors.inkSoft }]}>
                Tambah produk di menu Produk dulu.
              </Text>
            </View>
          )}
        </ScrollView>

        {cart.length > 0 ? (
          <View
            style={[
              styles.bottomDock,
              { backgroundColor: appColors.card, borderTopColor: appColors.borderLight },
            ]}
          >
            <View
              style={[
                styles.cartPanel,
                { backgroundColor: appColors.card, borderColor: appColors.borderLight },
                !cartExpanded && styles.cartPanelCollapsed,
              ]}
            >
              <TouchableOpacity
                style={styles.cartHeaderTouchable}
                onPress={toggleCartExpanded}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={
                  cartExpanded
                    ? 'Tutup detail keranjang'
                    : 'Buka detail keranjang'
                }
              >
                <View style={styles.cartHeaderTextCol}>
                  <Text style={[styles.cartSectionTitle, { color: appColors.ink }]}>
                    Keranjang
                  </Text>
                  <Text style={[styles.cartHeaderMeta, { color: appColors.inkMuted }]}>
                    {totalQty} item · ketuk untuk{' '}
                    {cartExpanded ? 'tutup' : 'ubah qty'}
                  </Text>
                </View>
                <View style={styles.cartHeaderActions}>
                  {!cartExpanded ? (
                    <Text style={[styles.cartHeaderTotal, { color: appColors.primary }]}>
                      {formatMoney(total)}
                    </Text>
                  ) : null}
                  <Animated.View
                    style={{ transform: [{ rotate: chevronRotation }] }}
                  >
                    <ChevronDown
                      size={22}
                      color={appColors.inkMuted}
                      strokeWidth={2.6}
                    />
                  </Animated.View>
                </View>
              </TouchableOpacity>

              {cartExpanded ? (
                <ScrollView
                  nestedScrollEnabled
                  style={[styles.cartListScroll, { maxHeight: cartScrollMax }]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={cart.length > 4}
                >
                  {cart.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onIncrease={increase}
                      onDecrease={decrease}
                      onRemove={remove}
                    />
                  ))}
                </ScrollView>
              ) : null}

              {cartExpanded ? (
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: appColors.ink }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: appColors.primary }]}>
                    {formatMoney(total)}
                  </Text>
                </View>
              ) : null}

              <ButtonPrimary
                title="Bayar"
                onPress={checkout}
                style={[
                  styles.bayarBtn,
                  !cartExpanded && styles.bayarBtnCollapsedSpacing,
                ]}
              />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  body: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  productScroll: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.pageBg,
  },
  productScrollInner: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  productEmptyInner: {
    justifyContent: 'center',
  },
  bottomDock: {
    flexShrink: 0,
    paddingTop: 6,
    paddingHorizontal: 0,
    paddingBottom: 6,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  hint: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.inkMuted,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 14,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  gridCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.07, 8),
  },
  gridCardLeft: {
    marginRight: 12,
  },
  gridCardRight: {
    marginRight: 0,
  },
  gridThumbWrap: {
    marginBottom: 10,
  },
  gridName: {
    ...inter.extraBold,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'center',
    minHeight: 36,
    marginBottom: 6,
  },
  gridPrice: {
    ...inter.bold,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 12,
  },
  addBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {
    ...inter.extraBold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  empty: {
    color: colors.inkSoft,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  emptyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartPanel: {
    marginTop: -6,
    marginHorizontal: 0,
    marginBottom: 0,
    zIndex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow(0.08, 10),
  },
  cartPanelCollapsed: {
    paddingBottom: 14,
    paddingTop: 12,
  },
  cartHeaderTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 2,
  },
  cartHeaderTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  cartHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  cartSectionTitle: {
    ...inter.extraBold,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 4,
  },
  cartHeaderMeta: {
    ...inter.semiBold,
    fontSize: 12,
    color: colors.inkMuted,
    lineHeight: 17,
  },
  cartHeaderTotal: {
    ...inter.extraBold,
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  cartListScroll: {
    marginTop: 10,
    marginBottom: 2,
  },
  bayarBtn: {
    marginTop: 4,
  },
  bayarBtnCollapsedSpacing: {
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  totalLabel: {
    ...inter.extraBold,
    fontSize: 18,
    color: colors.ink,
  },
  totalValue: {
    ...inter.extraBold,
    fontSize: 21,
    color: colors.primary,
  },
});
