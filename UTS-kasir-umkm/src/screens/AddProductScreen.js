import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ButtonPrimary from '../components/ButtonPrimary';
import ScreenShell from '../components/ScreenShell';
import ProductThumb from '../components/ProductThumb';
import { getProducts, saveProducts } from '../storage/storage';
import { colors, inter } from '../theme/design';

const pickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.55,
  base64: true,
};

function assetToPersistUri(asset) {
  if (!asset) return null;
  if (asset.base64) {
    return `data:image/jpeg;base64,${asset.base64}`;
  }
  return asset.uri || null;
}

export default function AddProductScreen({ navigation, route }) {
  const editing = route.params?.product;
  const [name, setName] = useState(editing?.name ?? '');
  const [price, setPrice] = useState(
    editing ? String(editing.price) : ''
  );
  const [imageUri, setImageUri] = useState(editing?.imageUri ?? null);
  const [emojiIcon, setEmojiIcon] = useState(editing?.emoji ?? '');

  const pickFromLibrary = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert(
        'Izin galeri',
        'Izinkan akses galeri untuk memilih foto produk.'
      );
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (res.canceled || !res.assets?.[0]) return;
    const uri = assetToPersistUri(res.assets[0]);
    setImageUri(uri);
  };

  const takePhoto = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert(
        'Izin kamera',
        'Izinkan akses kamera untuk memfoto produk.'
      );
      return;
    }
    const res = await ImagePicker.launchCameraAsync(pickerOptions);
    if (res.canceled || !res.assets?.[0]) return;
    const uri = assetToPersistUri(res.assets[0]);
    setImageUri(uri);
  };

  const clearImage = () => setImageUri(null);

  const save = async () => {
    const trimmed = name.trim();
    const num = parseFloat(price.replace(/,/g, '.'));
    if (!trimmed || Number.isNaN(num) || num < 0) {
      return;
    }
    const list = await getProducts();
    if (editing) {
      const next = list.map((p) => {
        if (p.id !== editing.id) return p;
        const updated = {
          ...p,
          name: trimmed,
          price: num,
        };
        if (imageUri) {
          updated.imageUri = imageUri;
        } else {
          delete updated.imageUri;
        }
        const em = emojiIcon.trim();
        if (em) {
          updated.emoji = em;
        } else {
          delete updated.emoji;
        }
        return updated;
      });
      await saveProducts(next);
    } else {
      const id = 'p_' + Date.now();
      const product = { id, name: trimmed, price: num };
      if (imageUri) product.imageUri = imageUri;
      const em = emojiIcon.trim();
      if (em) product.emoji = em;
      await saveProducts([...list, product]);
    }
    navigation.goBack();
  };

  const idForPreview = editing?.id ?? 'preview';

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.label}>Foto produk</Text>
          <View style={styles.imageBlock}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewFull}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.previewPlaceholder}>
                <ProductThumb
                  imageUri={null}
                  emoji={emojiIcon.trim() || undefined}
                  productId={idForPreview}
                  size={96}
                />
                <Text style={styles.previewHint}>
                  {emojiIcon.trim() ? 'Tap galeri/kamera untuk pakai foto' : 'Belum ada foto'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.pickRow}>
            <TouchableOpacity
              style={[styles.pickBtn, styles.pickBtnPrimary]}
              onPress={pickFromLibrary}
              activeOpacity={0.88}
            >
              <Text style={styles.pickBtnText}>Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pickBtn, styles.pickBtnPrimary]}
              onPress={takePhoto}
              activeOpacity={0.88}
            >
              <Text style={styles.pickBtnText}>Kamera</Text>
            </TouchableOpacity>
            {imageUri ? (
              <TouchableOpacity
                style={styles.pickBtn}
                onPress={clearImage}
                activeOpacity={0.88}
              >
                <Text style={styles.pickBtnMuted}>Hapus foto</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={styles.label}>Emoji ikon</Text>
          <TextInput
            style={styles.input}
            placeholder="Misal ☕ atau 🍜"
            placeholderTextColor={colors.inkSoft}
            value={emojiIcon}
            onChangeText={setEmojiIcon}
            maxLength={32}
          />

          <Text style={styles.label}>Nama produk</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Kopi Susu"
            placeholderTextColor={colors.inkSoft}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Harga (Rp)</Text>
          <TextInput
            style={styles.input}
            placeholder="15000"
            placeholderTextColor={colors.inkSoft}
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
          <ButtonPrimary
            title={editing ? 'Simpan perubahan' : 'Simpan produk'}
            onPress={save}
            disabled={!name.trim() || !price.trim()}
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
  imageBlock: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 220,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: colors.mintIconBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  previewFull: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewHint: {
    ...inter.semiBold,
    marginTop: 10,
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
  },
  pickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
  },
  pickBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  pickBtnPrimary: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
  pickBtnText: {
    ...inter.bold,
    fontSize: 14,
    color: colors.primary,
  },
  pickBtnMuted: {
    ...inter.semiBold,
    fontSize: 14,
    color: colors.danger,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  saveBtn: {
    marginTop: 8,
  },
});
