import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PRODUCTS: '@kasir_umkm_products',
  TRANSACTIONS: '@kasir_umkm_transactions',
  QRIS: '@kasir_umkm_qris',
  CART: '@kasir_umkm_cart',
};

export async function getProducts() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PRODUCTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveProducts(products) {
  await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

export async function getTransactions() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveTransactions(transactions) {
  await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export async function addTransaction(transaction) {
  const list = await getTransactions();
  await saveTransactions([transaction, ...list]);
}

export async function getQrisAccounts() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.QRIS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveQrisAccounts(accounts) {
  await AsyncStorage.setItem(KEYS.QRIS, JSON.stringify(accounts));
}

export async function getCart() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CART);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveCart(cart) {
  await AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart));
}

export async function clearCart() {
  await AsyncStorage.removeItem(KEYS.CART);
}
