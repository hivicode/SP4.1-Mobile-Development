import * as SQLite from 'expo-sqlite';

const DB_NAME = 'kasir_umkm.db';
export const DEFAULT_STORE_SETTINGS = {
  storeName: 'KES',
  ownerName: 'Bintang',
  logoUri: null,
  appearanceMode: 'light',
};

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY NOT NULL,
          data TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY NOT NULL,
          data TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS qris_accounts (
          id TEXT PRIMARY KEY NOT NULL,
          data TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS cart_items (
          product_id TEXT PRIMARY KEY NOT NULL,
          data TEXT NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

function parseRows(rows) {
  return rows
    .map((row) => {
      try {
        return JSON.parse(row.data);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function replaceRows(tableName, idColumn, rows, getId) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM ${tableName}`);
    for (const [index, item] of rows.entries()) {
      const id = getId(item);
      if (!id) continue;
      await db.runAsync(
        `INSERT INTO ${tableName} (${idColumn}, data, sort_order) VALUES (?, ?, ?)`,
        [id, JSON.stringify(item), index]
      );
    }
  });
}

export async function getProducts() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT data FROM products ORDER BY sort_order ASC'
  );
  return parseRows(rows);
}

export async function saveProducts(products) {
  const list = Array.isArray(products) ? products : [];
  await replaceRows('products', 'id', list, (product) => product?.id);
}

export async function getTransactions() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT data FROM transactions ORDER BY created_at DESC'
  );
  return parseRows(rows);
}

export async function saveTransactions(transactions) {
  const db = await getDb();
  const list = Array.isArray(transactions) ? transactions : [];
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM transactions');
    for (const tx of list) {
      if (!tx?.id) continue;
      await db.runAsync(
        'INSERT INTO transactions (id, data, created_at) VALUES (?, ?, ?)',
        [tx.id, JSON.stringify(tx), tx.date || new Date().toISOString()]
      );
    }
  });
}

export async function addTransaction(transaction) {
  if (!transaction?.id) return;
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO transactions (id, data, created_at) VALUES (?, ?, ?)',
    [
      transaction.id,
      JSON.stringify(transaction),
      transaction.date || new Date().toISOString(),
    ]
  );
}

export async function getQrisAccounts() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT data FROM qris_accounts ORDER BY sort_order ASC'
  );
  return parseRows(rows);
}

export async function saveQrisAccounts(accounts) {
  const list = Array.isArray(accounts) ? accounts : [];
  await replaceRows('qris_accounts', 'id', list, (account) => account?.id);
}

export async function getCart() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    'SELECT data FROM cart_items ORDER BY sort_order ASC'
  );
  return parseRows(rows);
}

export async function saveCart(cart) {
  const list = Array.isArray(cart) ? cart : [];
  await replaceRows(
    'cart_items',
    'product_id',
    list,
    (item) => item?.productId
  );
}

export async function clearCart() {
  const db = await getDb();
  await db.runAsync('DELETE FROM cart_items');
}

export async function getStoreSettings() {
  const db = await getDb();
  const row = await db.getFirstAsync(
    'SELECT value FROM app_settings WHERE key = ?',
    ['store_profile']
  );

  if (!row?.value) return DEFAULT_STORE_SETTINGS;

  try {
    return {
      ...DEFAULT_STORE_SETTINGS,
      ...JSON.parse(row.value),
    };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings) {
  const db = await getDb();
  const next = {
    ...DEFAULT_STORE_SETTINGS,
    ...(settings || {}),
  };
  await db.runAsync(
    'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
    ['store_profile', JSON.stringify(next)]
  );
  return next;
}
